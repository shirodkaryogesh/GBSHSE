const express = require("express");
const db = require("../dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();
const authenticateJWT = require("../middleware/authenticateJWT");

const router = express.Router();
const secretKey = process.env.SECRET_KEY;

//route for login the user
router.post("/login", (req, res) => {
  //getting data from the response
  const { email, password, role } = req.body;
  //checking if all the data is present
  if (!email || !password || !role) {
    return res.status(400).json({ message: "email and password required" });
  }
  //fetching the user using email and role
  const fetchQuery = "SELECT * FROM user_details WHERE email = ? AND role = ?";
  db.query(fetchQuery, [email, role], (err, result) => {
    if (err) {
      console.log("error fetching user:", err);
      return res.status(500).json({ message: "server error" });
    }
    if (result.length === 0) {
      return res.status(401).json({ message: "invalid email and role" });
    }

    const user = result[0];
    console.log("user: ", user);
    console.log("password: ", password);
    console.log("hashedPassword: ", user.password);

    //if the user found then using bycrypt to compare the password and the hashedpassword
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.log("error comparing the password: ", err);
        return res.status(500).json({ message: "server error" });
      }
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // res.status(200).json({
      //   message: "Login Successfully",
      // });
      console.log("Password matched. Generating token...");
      const token = jwt.sign(
        {
          userId: user.user_id,
          email: user.email,
          role: user.role,
        },
        secretKey,
        { expiresIn: "1h" }
      );

      console.log("Generated JWT Token:", token);
      console.log("adminId:", user.user_id);

      return res.status(200).json({
        message: "Login Successfully",
        token: token,
        userId: user.user_id,
      });
    });
  });
});

//route for registering the user
router.post("/register", (req, res) => {
  //getting all data from the request
  const { firstName, lastName, email, contact, password, role } = req.body;
  //check is all data present
  if (!firstName || !lastName || !email || !contact || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  //checking using db if same user already present or not
  const checkQuery = "SELECT * FROM user_details WHERE email = ?";
  db.query(checkQuery, [email], (err, result) => {
    if (err) {
      console.log("Error fetching the user:", err);
      return res.status(500).json({ message: "server error" });
    }
    if (result.length > 0) {
      return res.status(403).json({ message: "User already exists" });
    }

    //HASHING THE PASSWORD
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.log("Error Hashing the Password: ", err);
        return res.status(500).json({ message: "server error" });
      }

      //if same user is not present then insert the data in db
      const InsertQuery =
        "INSERT INTO user_details (firstName, lastName, email, contact, password, role) VALUES (?,?,?,?,?,?)";
      db.query(
        InsertQuery,
        [firstName, lastName, email, contact, hashedPassword, role],
        (err, result) => {
          if (err) {
            console.log("Error inserting user:", err);
            return res.status(500).json({ message: "server error" });
          }
          res.status(201).json({ message: "User registered" });
        }
      );
    });
  });
});

router.get("/employees", authenticateJWT, (req, res) => {
  const fetchEmpQuery = "SELECT * From user_details";
  db.query(fetchEmpQuery, (err, result) => {
    if (err) {
      console.log("error fetching employees: ", err);
      return res.status(500).json({ message: "employees not fetched" });
    }
    console.log("Fetched Employees: ", result);
    res.status(200).json(result);
  });
});

//set up for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

//to upload file in db
router.post(
  "/uploadFile",
  authenticateJWT,
  upload.single("file"),
  (req, res) => {
    const adminId = req.body.userId;
    const subject = req.body.subject;
    const selectedEmployees = JSON.parse(req.body.selectedEmployees);
    const file = req.file;

    if (
      !selectedEmployees ||
      !adminId ||
      !subject ||
      selectedEmployees.length === 0 ||
      !file
    ) {
      return res
        .status(400)
        .json({ message: "Employee ID ,subject, file are required" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      file.filename
    }`;
    const currentDateTime = new Date();

    const InsertQuery =
      "INSERT INTO employee_files (emp_id, file_subject, file_url, send_by, upload_date) VALUES (?, ?, ?, ?, ?)";
    selectedEmployees.forEach((empId) => {
      db.query(
        InsertQuery,
        [empId, subject, fileUrl, adminId, currentDateTime],
        (err, result) => {
          if (err) {
            console.error("Error saving file info to DB:", err);
            return res.status(500).json({ message: "Server error" });
          }
        }
      );
    });
    res.status(200).json({ message: "File Uploaded Successfully" });
  }
);

//to send file to particular user
router.get("/fileRequest/:employeeId", authenticateJWT, (req, res) => {
  const employeeId = req.params.employeeId;
  const fetchFileRequestQuery = `SELECT ef.file_id, ef.file_url, ef.upload_date, ef.assigned, ef.file_subject, ud.firstname as sender_firstname, ud.lastname as sender_lastname
  FROM employee_files ef 
  JOIN user_details ud 
  ON ef.send_by = ud.user_id 
  WHERE ef.emp_id = ?`;
  db.query(fetchFileRequestQuery, [employeeId], (err, result) => {
    if (err) {
      console.error("Error fetching files for employee:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (result.length === 0) {
      return res
        .status(400)
        .json({ message: "No file found for this employee" });
    }
    // console.log("result:", result);
    res.status(200).json(result);
  });
});

//assigning the file
router.post("/assignFile", authenticateJWT, (req, res) => {
  const { fileId, assigned } = req.body;
  const currentDateTime = new Date();
  const insertAssignValueQuery =
    "UPDATE employee_files SET assigned = ?, assigned_date = ? WHERE file_id = ?";

  db.query(
    insertAssignValueQuery,
    [assigned, currentDateTime, fileId],
    (err, result) => {
      if (err) {
        console.error("Error updating assigned status:", error);
        return res.status(500).json({ error: "Database update failed" });
      }

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "Updated successfully" });
      } else {
        return res.status(404).json({ error: "File not found" });
      }
    }
  );
});

router.get("/secretaryData", authenticateJWT, (req, res) => {
  const query = `
    SELECT 
        ef.file_subject, 
        ef.file_url, 
        ef.assigned, 
        ef.upload_date AS sent_date, 
        ef.assigned_date, 
        CONCAT(us1.firstname, ' ', us1.lastname) AS send_by, 
        CONCAT(us2.firstname, ' ', us2.lastname) AS send_to
    FROM 
        employee_files ef
    JOIN 
        user_details us1 ON ef.send_by = us1.user_id 
    JOIN 
        user_details us2 ON ef.emp_id = us2.user_id
    ORDER BY 
        ef.upload_date DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
