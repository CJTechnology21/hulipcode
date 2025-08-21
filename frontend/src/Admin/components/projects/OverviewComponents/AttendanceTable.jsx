import React, { useState } from "react";
import Button from "../../../../components/Button";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "react-toastify";
import { deleteAttendance, updateAttendance } from "../../../../services/overViewServices"; // create these in services
import {formatDate} from '../../../../utils/dateFormatter'

function AttendanceTable({ attendance, loading, setAttendance, setShowAttendanceModal }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [editAttendanceId, setEditAttendanceId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Delete handler
  const handleDelete = async (record) => {
    try {
      await deleteAttendance(record._id);
      setAttendance((prev) => prev.filter((r) => r._id !== record._id));
      toast.success("Attendance deleted successfully ✅");
    } catch (err) {
      toast.error("Failed to delete attendance ❌");
      console.error(err);
    }
  };

  // Enter edit mode
  const handleEdit = (record) => {
    setEditAttendanceId(record._id);
    setEditForm({
      name: record.name,
      date: record.date?.slice(0, 10),
      status: record.status,
    });
  };

  // Save updated attendance
  const handleSave = async (attendanceId) => {
    try {
      const updated = await updateAttendance(attendanceId, editForm);
      setAttendance((prev) =>
        prev.map((r) => (r._id === attendanceId ? updated : r))
      );
      toast.success("Attendance updated successfully ✅");
      setEditAttendanceId(null);
    } catch (err) {
      toast.error("Failed to update attendance ❌");
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between mb-2 items-center">
        <h3 className="font-semibold text-gray-800">Labour Attendance</h3>
        <Button
          className="text-xs text-white bg-indigo-500 px-3 py-1 rounded hover:bg-indigo-600"
          onClick={() => setShowAttendanceModal(true)}
        >
          + Mark Attendance
        </Button>
      </div>

      {loading ? (
        <div className="h-24 text-center text-sm text-gray-400 flex items-center justify-center border rounded">
          Loading attendance...
        </div>
      ) : attendance.length === 0 ? (
        <div className="h-24 text-center text-sm text-gray-400 flex items-center justify-center border rounded">
          No attendance records
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700 border">
            <thead>
              <tr className="text-gray-500 border-b bg-gray-50">
                <th className="py-2 px-3 text-left">S.No</th>
                <th className="py-2 px-3 text-left">Name</th>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Status</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => (
                <tr
                  key={record._id || index}
                  className="border-t hover:bg-gray-50 transition relative"
                >
                  <td className="px-3 py-2">{index + 1}</td>

                  {editAttendanceId === record._id ? (
                    <>
                      {/* Editable row */}
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) =>
                            setEditForm({ ...editForm, date: e.target.value })
                          }
                          className="border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={editForm.status}
                          onChange={(e) =>
                            setEditForm({ ...editForm, status: e.target.value })
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="Full Day">Full Day</option>
                          <option value="Half Day">Half Day</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => handleSave(record._id)}
                          className="text-green-600 px-2 hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditAttendanceId(null)}
                          className="text-gray-500 px-2 hover:underline"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Normal row */}
                      <td className="px-3 py-2">{record.name}</td>
                      <td className="px-3 py-2">{formatDate(record.date)}</td>
                      <td
                        className={`px-3 py-2 ${
                          record.status === "Full Day"
                            ? "text-green-600"
                            : record.status === "Half Day"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {record.status}
                      </td>
                      <td className="px-3 py-2 text-center relative">
                        <button
                          className="p-1 rounded hover:bg-gray-200"
                          onClick={() =>
                            setOpenMenu(openMenu === record._id ? null : record._id)
                          }
                        >
                          <BsThreeDotsVertical size={18} />
                        </button>

                        {openMenu === record._id && (
                          <div className="absolute right-4 mt-1 w-28 bg-white border rounded shadow-md text-sm z-10">
                            <button
                              className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                              onClick={() => {
                                setOpenMenu(null);
                                handleEdit(record);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                              onClick={() => {
                                setOpenMenu(null);
                                handleDelete(record);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AttendanceTable;
