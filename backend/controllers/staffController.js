const Staff = require("../models/Staff");

// Create staff
const createStaff = async (req, res) => {
  try {
    const { name, personType, projectId } = req.body;

    if (!name || !personType || !projectId) {
      return res
        .status(400)
        .json({ message: "Name, personType, and projectId are required" });
    }

    const staff = await Staff.create({ name, personType, projectId });
    res.status(201).json({ message: "Staff created successfully", staff });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all staff by project
const getStaffByProject = async (req, res) => {
  try {
    const { projectId } = req.query;

    // Just check presence, not ObjectId format
    if (!projectId) {
      return res.status(400).json({ message: "Missing projectId" });
    }

    // Query directly by string projectId
    const staff = await Staff.find({ projectId }).sort({ createdAt: -1 });

    if (!staff || staff.length === 0) {
      return res.status(404).json({ message: "No staff found for this project" });
    }

    res.status(200).json({ staff });
  } catch (err) {
    console.error("Get Staff Error:", err.message || err);
    res.status(500).json({ message: "Server error while fetching staff" });
  }
};
// Update staff
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, personType, attendance } = req.body;

    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (name) staff.name = name;
    if (personType) staff.personType = personType;

    // If attendance is provided
    if (attendance && attendance.date && attendance.status) {
      if (!Array.isArray(staff.attendance)) {
        staff.attendance = [];
      }

      const idx = staff.attendance.findIndex(
        (a) => new Date(a.date).toDateString() === new Date(attendance.date).toDateString()
      );

      if (idx >= 0) {
        staff.attendance[idx].status = attendance.status;
      } else {
        staff.attendance.push(attendance);
      }
    }

    const updatedStaff = await staff.save();
    res.json(updatedStaff);
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete staff
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await Staff.findByIdAndDelete(id);
    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.error("Error deleting staff:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// // Mark attendance for staff
const markAttendance = async (req, res) => {
  try {
    const { id } = req.params; // staffId
    const { status, date } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Attendance status is required" });
    }

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setUTCHours(0, 0, 0, 0);

    const targetDateStr = targetDate.toISOString().slice(0, 10);
    const month = targetDate.toISOString().slice(0, 7);

    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    // ✅ Update today's attendance object
    staff.attendance = { date: targetDate, status };

    // ✅ Ensure attendanceHistory exists
    if (!Array.isArray(staff.attendanceHistory)) staff.attendanceHistory = [];

    // ✅ Find or create month record
    let monthRecord = staff.attendanceHistory.find((m) => m.month === month);
    if (!monthRecord) {
      staff.attendanceHistory.push({ month, records: [] });
      monthRecord = staff.attendanceHistory.find((m) => m.month === month);
    }

    // ✅ Update or add day record
    let dayRecord = monthRecord.records.find(
      (r) => new Date(r.date).toISOString().slice(0, 10) === targetDateStr
    );

    if (dayRecord) {
      dayRecord.status = status;
    } else {
      monthRecord.records.push({ date: targetDate, status });
    }

    await staff.save();

    res.json({
      message: `Attendance for ${targetDateStr} marked successfully`,
      staff,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// const markAttendance = async (req, res) => {
//   try {
//     const { id } = req.params; // staffId
//     const { status, date } = req.body;

//     if (!status) {
//       return res.status(400).json({ message: "Attendance status is required" });
//     }

//     //  Use provided date or default to today
//     const targetDate = date ? new Date(date) : new Date();
//     targetDate.setUTCHours(0, 0, 0, 0);

//     const targetDateStr = targetDate.toISOString().slice(0, 10); // "YYYY-MM-DD"
//     const month = targetDate.toISOString().slice(0, 7); // "YYYY-MM"

//     //  Find staff
//     const staff = await Staff.findById(id);
//     if (!staff) {
//       return res.status(404).json({ message: "Staff not found" });
//     }

//     //  If marking today's attendance, update current attendance
//     const todayStr = new Date().toISOString().slice(0, 10);
//     if (targetDateStr === todayStr) {
//       staff.attendance = { date: targetDate, status };
//     }

//     //  Find or create month record
//     let monthRecord = staff.attendanceHistory.find((m) => m.month === month);

//     if (!monthRecord) {
//       // Push a proper mongoose subdocument
//       staff.attendanceHistory.push({
//         month,
//         records: []
//       });

//       // Re-fetch the newly added monthRecord from array
//       monthRecord = staff.attendanceHistory.find((m) => m.month === month);
//     }

//     //  Check if the record for target date exists
//     let dayRecord = monthRecord.records.find(
//       (r) => new Date(r.date).toISOString().slice(0, 10) === targetDateStr
//     );

//     if (dayRecord) {
//       // Update existing record
//       dayRecord.status = status;
//     } else {
//       // Add new record
//       monthRecord.records.push({ date: targetDate, status });
//     }

//     await staff.save();

//     res.json({
//       message: `Attendance for ${targetDateStr} marked successfully`,
//       staff,
//     });
//   } catch (error) {
//     console.error("Error marking attendance:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// get staff
const getStaffByType = async (req, res) => {
  try {
    // Fetch both Site Staff and Labour Contractors
    const persons = await Staff.find({
      personType: { $in: ["Site Staff", "Labour Contractor"] },
    }).select("_id name personType projectId ");

    res.json(persons);
  } catch (err) {
    console.error("Error in fetching persons:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// const getStaffByType = async (req, res) => {
//   try {
//     const { projectId } = req.query;

//     if (!projectId) {
//       return res.status(400).json({ message: "projectId is required" });
//     }

//     // Fetch both Site Staff and Labour Contractors for the given project
//     const persons = await Staff.find({
//       personType: { $in: ["Site Staff", "Labour Contractor"] },
//       projectId, // filter by projectId
//     }).select("_id name personType projectId");

//     res.json(persons);
//   } catch (err) {
//     console.error("Error in fetching persons:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


module.exports = { createStaff, getStaffByProject, updateStaff, deleteStaff, markAttendance, getStaffByType };
