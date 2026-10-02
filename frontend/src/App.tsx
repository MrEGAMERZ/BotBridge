import { useEffect, useState } from 'react';
import { Tldraw, createShapeId, TLGeoShape, TLArrowShape } from 'tldraw';
import 'tldraw/tldraw.css';
import * as Y from 'yjs';
import YProvider from 'y-partykit/provider';
import dagre from 'dagre';

const HOST = "localhost:1999";
const ROOM = "my-room";
const SECRET = "secret123";

export default function App() {
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    // 1. Setup Yjs
    const doc = new Y.Doc();
    const provider = new (YProvider as any).default(HOST, ROOM, doc, {
      connect: true,
      params: { secret: SECRET }
    });

    const nodesMap = doc.getMap('nodes');
    const edgesMap = doc.getMap('edges');

    // Wait for initial sync
    provider.on('sync', (isSynced: boolean) => {
      if (isSynced && store) {
        syncToTldraw(nodesMap, edgesMap, store);
      }
    });

    // Listen for changes from agents
    const observer = () => {
      if (store) {
        syncToTldraw(nodesMap, edgesMap, store);
      }
    };

    nodesMap.observe(observer);
    edgesMap.observe(observer);

    return () => {
      nodesMap.unobserve(observer);
      edgesMap.unobserve(observer);
      provider.disconnect();
    };
  }, [store]);

  const handleMount = (editor: any) => {
    setStore(editor.store);
  };

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw onMount={handleMount} />
    </div>
  );
}

function syncToTldraw(nodesMap: Y.Map<any>, edgesMap: Y.Map<any>, store: any) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'TB', marginx: 50, marginy: 50 });
  g.setDefaultEdgeLabel(() => ({}));

  // Build graph for layout
  nodesMap.forEach((node, id) => {
    g.setNode(id, { label: node.label, width: 200, height: 100, original: node });
  });

  edgesMap.forEach((edge, id) => {
    g.setEdge(edge.fromNodeId, edge.toNodeId, { id, original: edge });
  });

  dagre.layout(g);

  // Push to tldraw
  const shapes: any[] = [];
  
  g.nodes().forEach((id) => {
    const node = g.node(id);
    if (!node) return;
    
    shapes.push({
      id: createShapeId(`node-${id}`),
      type: 'geo',
      x: node.original.x ?? node.x - 100,
      y: node.original.y ?? node.y - 50,
      props: {
        geo: 'rectangle',
        w: 200,
        h: 100,
        text: node.label + (node.original.agentId ? `\n(${node.original.agentId})` : '')
      }
    });
  });

  g.edges().forEach((e) => {
    const edge = g.edge(e);
    if (!edge) return;
    const { id } = edge.original;
    
    shapes.push({
      id: createShapeId(`edge-${id}`),
      type: 'arrow',
      x: 0,
      y: 0,
      props: {
        start: { type: 'binding', isExact: false, boundShapeId: createShapeId(`node-${e.v}`), normalizedAnchor: {x: 0.5, y: 0.5} },
        end: { type: 'binding', isExact: false, boundShapeId: createShapeId(`node-${e.w}`), normalizedAnchor: {x: 0.5, y: 0.5} },
        text: edge.original.label || ''
      }
    });
  });

  if (shapes.length > 0) {
    store.put(shapes);
  }
}
