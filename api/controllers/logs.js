import db from "diskdb";
import fs from "fs";

export const logEvent = data => {
  const currentDate = new Date();
  const logFileName = `${currentDate.getFullYear()}-${currentDate.getMonth()}-log`;
  const logFileFullName = `../data/logs/${logFileName}.json`;
  if (!fs.existsSync(logFileFullName)) {
    fs.writeFileSync(logFileFullName, "[]");
  }
  db.connect("../data/logs/", [logFileName]);
  db[logFileName].save(data);
  return null;
};
