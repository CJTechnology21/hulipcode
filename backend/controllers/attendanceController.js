
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");

// ✅ Create new attendance record
const createAttendance = async (req, res) => {
  try {
    const { name, date, status, projectId, personType } = req.body;

    const attendance = new Attendance({
      name,
      date,
      status,
      projectId,
      ...(personType && { personType }), // only add if provided
    });

    await attendance.save();
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get all attendance records (optionally filter by projectId)
const getAttendance = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (projectId && !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const query = projectId ? { projectId } : {};

    const records = await Attendance.find(query)
      .populate("projectId", "name")
      .sort({ date: -1 });

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    res.status(200).json({ attendance: records });
  } catch (error) {
    console.error("Get Attendance Error:", error);
    res.status(500).json({ message: "Server error while fetching attendance" });
  }
};

// ✅ Get current month's attendance (1st → today)
const getCurrentMonthAttendance = async (req, res) => {
  try {
    const { name } = req.query;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const query = { date: { $gte: startOfMonth, $lte: today } };

    if (name) {
      query.name = name; // filter by person if provided
    }

    const records = await Attendance.find(query).sort({ date: 1 });

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No attendance found for this month" });
    }

    res.status(200).json({ attendance: records });
  } catch (error) {
    console.error("Get Current Month Attendance Error:", error);
    res.status(500).json({ message: "Server error while fetching current month attendance" });
  }
};

// ✅ Update an attendance record
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, status, projectId, personType } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }

    const updateData = { name, date, status, projectId };
    if (personType) updateData.personType = personType; // only update if provided

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.status(200).json({ success: true, data: updatedAttendance });
  } catch (error) {
    console.error("Update Attendance Error:", error);
    res.status(500).json({ message: "Server error while updating attendance" });
  }
};

// ✅ Delete an attendance record
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }

    const deletedAttendance = await Attendance.findByIdAndDelete(id);

    if (!deletedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.status(200).json({ success: true, message: "Attendance record deleted" });
  } catch (error) {
    console.error("Delete Attendance Error:", error);
    res.status(500).json({ message: "Server error while deleting attendance" });
  }
};

module.exports = {
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getCurrentMonthAttendance, // ✅ new function
};

// const mongoose = require("mongoose");
// const Attendance = require("../models/Attendance");

// // Create new attendance record
// const createAttendance = async (req, res) => {
//   try {
//     const { name, date, status, projectId } = req.body;

//     const attendance = new Attendance({
//       name,
//       date,
//       status,
//       projectId,
//     });

//     await attendance.save();
//     res.status(201).json({ success: true, data: attendance });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // Get all attendance records
// const getAttendance = async (req, res) => {
//   try {
//     const { projectId } = req.query;

//     if (projectId && !mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid projectId" });
//     }

//     const query = projectId ? { projectId } : {};

//     const records = await Attendance.find(query)
//       .populate("projectId", "name")
//       .sort({ date: -1 });

//     if (!records || records.length === 0) {
//       return res.status(404).json({ message: "No attendance records found" });
//     }

//     res.status(200).json({ attendance: records });
//   } catch (error) {
//     console.error("Get Attendance Error:", error);
//     res.status(500).json({ message: "Server error while fetching attendance" });
//   }
// };

// // Update an attendance record
// const updateAttendance = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, date, status, projectId } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid attendance ID" });
//     }

//     const updatedAttendance = await Attendance.findByIdAndUpdate(
//       id,
//       { name, date, status, projectId },
//       { new: true, runValidators: true }
//     );

//     if (!updatedAttendance) {
//       return res.status(404).json({ message: "Attendance record not found" });
//     }

//     res.status(200).json({ success: true, data: updatedAttendance });
//   } catch (error) {
//     console.error("Update Attendance Error:", error);
//     res.status(500).json({ message: "Server error while updating attendance" });
//   }
// };

// // Delete an attendance record
// const deleteAttendance = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid attendance ID" });
//     }

//     const deletedAttendance = await Attendance.findByIdAndDelete(id);

//     if (!deletedAttendance) {
//       return res.status(404).json({ message: "Attendance record not found" });
//     }

//     res.status(200).json({ success: true, message: "Attendance record deleted" });
//   } catch (error) {
//     console.error("Delete Attendance Error:", error);
//     res.status(500).json({ message: "Server error while deleting attendance" });
//   }
// };

// module.exports = {
//   getAttendance,
//   createAttendance,
//   updateAttendance,
//   deleteAttendance,
// };
