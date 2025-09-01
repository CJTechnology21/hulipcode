import React, { useState, useEffect } from "react";
import DropDown from "../../../../components/DropDown"; // your reusable dropdown
import Button from "../../../../components/Button";
import { toast } from "react-toastify";
import {fetchStaffByType} from '../../../../services/staffServices'
import { getTaskName } from "../../../../services/taskServices";
import {getTodoName} from '../../../../services/todoServices'
function SubconModal({
  isOpen,
  onClose,
  onSubmit,
  fetchTodos,
  fetchTasks,
  fetchStaff,
  projectId,
}) {
  const [todos, setTodos] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);

  const [formData, setFormData] = useState({
    todo: "",
    task: "",
    staff: "",
    amount: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          setTodos(await fetchTodos());
          setTasks(await fetchTasks());
          setStaff(await fetchStaff());
        } catch (err) {
          toast.error("Failed to fetch dropdown data");
          console.error(err);
        }
      })();
    }
  }, [isOpen, fetchTodos, fetchTasks, fetchStaff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !formData.todo ||
      !formData.task ||
      !formData.staff ||
      !formData.amount
    ) {
      toast.error("Please fill required fields");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Create Sub-Con Work Order
        </h2>

        <div className="space-y-4">
          <DropDown
            label="Todo"
            name="todo"
            value={formData.todo}
            options={todos.map((t) => ({ value: t._id, label: t.title }))}
            onChange={handleChange}
          />
          <DropDown
            label="Task"
            name="task"
            value={formData.task}
            options={tasks.map((t) => ({ value: t._id, label: t.name }))}
            onChange={handleChange}
          />
          <DropDown
            label="Staff"
            name="staff"
            value={formData.staff}
            options={staff.map((s) => ({ value: s._id, label: s.name }))}
            onChange={handleChange}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quote Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="custom"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            variant="custom"
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Create Order
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SubconModal;
