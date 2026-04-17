const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const studentData = [
  { id: 1, name: "Sehar Mehar", roll: "2024-001", cls: "BSET", status: "Active" },
  { id: 2, name: "Sehrish Hina", roll: "24-SET-001", cls: "BSCS", status: "Active" },
  { id: 3, name: "Fatima Kanwal", roll: "24-ST-002", cls: "BSIT", status: "Active" },
  { id: 4, name: "Mishee", roll: "24-CS-003", cls: "BSCS", status: "Inactive" },
  { id: 5, name: "Abdul Rehman", roll: "24-IT-004", cls: "BSIT", status: "Active" }
];

const attendanceData = {
  "2024-04-01": {
    1: { status: "Present", remark: "" },
    2: { status: "Present", remark: "" },
    3: { status: "Absent", remark: "Sick" }
  },
  "2024-04-02": {
    1: { status: "Present", remark: "" },
    2: { status: "Late", remark: "Traffic" },
    3: { status: "Present", remark: "" }
  }
};

app.get("/api/students", (req, res) => {
  res.json(studentData);
});

app.get("/api/attendance", (req, res) => {
  res.json(attendanceData);
});

app.get("/api/overview", (req, res) => {
  res.json({
    title: "Smart Attendance Manager",
    description: "A modern attendance tracking system with timetable and analytics.",
    features: [
      "Student management",
      "Attendance marking",
      "Timetable view",
      "Analytics reports",
      "Login system"
    ]
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
