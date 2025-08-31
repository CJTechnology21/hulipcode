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
// controllers/staffController.js
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, personType, attendance } = req.body;

    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Update basic fields
    if (name) staff.name = name;
    if (personType) staff.personType = personType;

    // Handle attendance update if provided
    if (attendance && attendance.date && attendance.status) {
      const date = new Date(attendance.date);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const day = date.getDate();

      // Find existing month record or create new
      let monthRecord = staff.attendanceHistory.find(
        (record) => record.month === monthYear
      );
      if (!monthRecord) {
        monthRecord = { month: monthYear, dates: [] };
        staff.attendanceHistory.push(monthRecord);
      }

      // Update or add attendance for that day
      const existingDateIndex = monthRecord.dates.findIndex(
        (d) => d.date === day
      );
      if (existingDateIndex >= 0) {
        monthRecord.dates[existingDateIndex].status = attendance.status;
      } else {
        monthRecord.dates.push({ date: day, status: attendance.status });
      }

      // Update latest attendance
      staff.attendance = {
        date,
        status: attendance.status,
      };
    }

    const updatedStaff = await staff.save();
    res.json(updatedStaff);
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// const updateStaff = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const staff = await Staff.findByIdAndUpdate(id, req.body, { new: true });
//     res.json(staff);
//   } catch (error) {
//     console.error("Error updating staff:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


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
// Mark attendance for staff
const markAttendance = async (req, res) => {
  try {
    const { id } = req.params; // staffId
    const { status, date } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Attendance status is required" });
    }

    //  Use provided date or default to today
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setUTCHours(0, 0, 0, 0);

    const targetDateStr = targetDate.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const month = targetDate.toISOString().slice(0, 7); // "YYYY-MM"

    //  Find staff
    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    //  If marking today's attendance, update current attendance
    const todayStr = new Date().toISOString().slice(0, 10);
    if (targetDateStr === todayStr) {
      staff.attendance = { date: targetDate, status };
    }

    //  Find or create month record
    let monthRecord = staff.attendanceHistory.find((m) => m.month === month);

    if (!monthRecord) {
      // Push a proper mongoose subdocument
      staff.attendanceHistory.push({
        month,
        records: []
      });

      // Re-fetch the newly added monthRecord from array
      monthRecord = staff.attendanceHistory.find((m) => m.month === month);
    }

    //  Check if the record for target date exists
    let dayRecord = monthRecord.records.find(
      (r) => new Date(r.date).toISOString().slice(0, 10) === targetDateStr
    );

    if (dayRecord) {
      // Update existing record
      dayRecord.status = status;
    } else {
      // Add new record
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


// // Mark attendance for staff
// const markAttendance = async (req, res) => {
//   try {
//     const { id } = req.params; // staffId
//     const { status, date } = req.body;

//     if (!status) {
//       return res.status(400).json({ message: "Attendance status is required" });
//     }

//     // ✅ Use provided date or default to today
//     const targetDate = date ? new Date(date) : new Date();
//     targetDate.setUTCHours(0, 0, 0, 0);

//     const targetDateStr = targetDate.toISOString().slice(0, 10); // "YYYY-MM-DD"
//     const month = targetDate.toISOString().slice(0, 7); // "YYYY-MM"

//     // ✅ Find staff
//     const staff = await Staff.findById(id);
//     if (!staff) {
//       return res.status(404).json({ message: "Staff not found" });
//     }

//     // ✅ If marking today's attendance, update current attendance
//     const todayStr = new Date().toISOString().slice(0, 10);
//     if (targetDateStr === todayStr) {
//       staff.attendance = { date: targetDate, status };
//     }

//     // ✅ Find or create month record
//     let monthRecord = staff.attendanceHistory.find((m) => m.month === month);
//     if (!monthRecord) {
//       monthRecord = { month, records: [] };
//       staff.attendanceHistory.push(monthRecord);
//     }

//     // ✅ Check if the record for target date exists
//     const dayRecord = monthRecord.records.find(
//       (r) => new Date(r.date).toISOString().slice(0, 10) === targetDateStr
//     );

//     if (dayRecord) {
//       // Update existing
//       dayRecord.status = status;
//     } else {
//       // Add new
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


module.exports = { createStaff, getStaffByProject, updateStaff, deleteStaff,markAttendance };
