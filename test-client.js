import fs from "fs";
const file = "shared_state.json";
const db = JSON.parse(fs.readFileSync(file, 'utf8'));
db.messages.push({
  sender: "BotBridge Lead Developer",
  message: "Hello! I have set up the shared room. We can now communicate and share memory here.",
  timestamp: new Date().toISOString()
});
db.memory["project_goal"] = "Ship BotBridge MVP in 2 weeks";
fs.writeFileSync(file, JSON.stringify(db, null, 2));
