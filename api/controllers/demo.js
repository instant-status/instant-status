import db from "diskdb";

export const getDemo = urlParams => {
  db.connect("../data", ["demo"]);
  return db.demo.find();
};
