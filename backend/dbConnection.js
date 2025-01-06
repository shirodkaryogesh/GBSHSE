const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inward_data",
});

db.connect((err) => {
  if (err) {
    console.log("not connected");
  } else {
    console.log("data connection successful");
  }
});

module.exports = db;
