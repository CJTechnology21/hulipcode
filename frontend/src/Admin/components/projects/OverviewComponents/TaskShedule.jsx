import React, { useState } from "react";
import Button from "../../../../components/Button";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "react-toastify";
import { deleteTask, updateTask } from "../../../../services/overViewServices"; // adjust path

function TaskSchedule({
  tasks,
  loading,
  formatDate,
  setTasks,
  setShowTaskModal,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Delete Handler
  const handleDelete = async (task) => {
    try {
      await deleteTask(task._id);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      toast.success("Task deleted successfully ");
    } catch (err) {
      toast.error("Failed to delete task ");
      console.error(err);
    }
  };

  // Enter edit mode
  const handleEdit = (task) => {
    setEditTaskId(task._id);
    setEditForm({
      name: task.name,
      startDate: task.startDate?.slice(0, 10), // YYYY-MM-DD format
      endDate: task.endDate?.slice(0, 10),
      progress: task.progress ?? "",
    });
  };

  // Save updated task
  const handleSave = async (taskId) => {
    try {
      const updated = await updateTask(taskId, editForm);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
      toast.success("Task updated successfully");
      setEditTaskId(null);
    } catch (err) {
      toast.error("Failed to update task ");
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between mb-2 items-center">
        <h3 className="font-semibold text-gray-800">Task Schedule</h3>
        <Button
          variant="custom"
          className="text-xs text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
          onClick={() => setShowTaskModal(true)}
        >
          + Add Task
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700 border">
          <thead>
            <tr className="text-gray-500 border-b bg-gray-50">
              <th className="py-2 px-3 text-left">S.No</th>
              <th className="py-2 px-3 text-left">Item</th>
              <th className="py-2 px-3 text-left">Start Date</th>
              <th className="py-2 px-3 text-left">End Date</th>
              <th className="py-2 px-3 text-left">Progress</th>
              <th className="py-2 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading tasks...
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-gray-400 py-4">
                  No tasks scheduled
                </td>
              </tr>
            ) : (
              tasks.map((task, idx) => (
                <tr
                  key={task._id}
                  className="border-t hover:bg-gray-50 transition relative"
                >
                  <td className="px-3 py-2">{idx + 1}</td>

                  {editTaskId === task._id ? (
                    <>
                      {/* Editable Row */}
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
                          value={editForm.startDate}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              startDate: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          value={editForm.endDate}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              endDate: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={editForm.progress}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              progress: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-16"
                        />{" "}
                        %
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => handleSave(task._id)}
                          className="text-green-600 px-2 hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditTaskId(null)}
                          className="text-gray-500 px-2 hover:underline"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Normal Row */}
                      <td className="px-3 py-2">{task.name}</td>
                      <td className="px-3 py-2">
                        {formatDate(task.startDate)}
                      </td>
                      <td className="px-3 py-2">{formatDate(task.endDate)}</td>
                      <td className="px-3 py-2">
                        {task.progress !== undefined && task.progress !== null
                          ? `${task.progress}%`
                          : "-"}
                      </td>
                      <td className="px-3 py-2 text-center relative">
                        <button
                          className="p-1 rounded hover:bg-gray-200"
                          onClick={() =>
                            setOpenMenu(openMenu === task._id ? null : task._id)
                          }
                        >
                          <BsThreeDotsVertical size={18} />
                        </button>

                        {openMenu === task._id && (
                          <div className="absolute right-4 mt-1 w-28 bg-white border rounded shadow-md text-sm z-10">
                            <button
                              className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                              onClick={() => {
                                setOpenMenu(null);
                                handleEdit(task);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                              onClick={() => {
                                setOpenMenu(null);
                                handleDelete(task);
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskSchedule;
