import db from "diskdb";

export const logEvent = data => {
  db.connect("../data", ["logs"]);
  db.logs.save(data);
  return null;
};
