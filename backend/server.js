const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes.js");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;
app.use(cors());

// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`the app is listening on the port ${port}`);
});
