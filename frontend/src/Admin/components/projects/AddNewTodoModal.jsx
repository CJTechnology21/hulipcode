import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import DropDown from "../../../components/DropDown";
import { createTask } from "../../../services/taskServices";
import { toast } from "react-toastify";
import { fetchAssignableUsers } from "../../../services/leadServices"; // ✅ Use assignable users instead of just architects
import { fetchProjects } from "../../../services/projectServices";

function AddNewTodoModal({ isOpen, setIsOpen, projectId, onCreated }) {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    startDate: "",
    taskType: "",
    assignedTo: "",
    project: "",
    description: "",
    status: "TODO",
    value: "",
    weight_pct: "",
    priority: "MEDIUM",
  });
  const [loading, setLoading] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState([]); // ✅ Renamed from architects
  const [projects, setProjects] = useState([]);

  // Fetch assignable users (architects + Site Staff) & projects
  useEffect(() => {
    const loadData = async () => {
      try {
        const [users, projs] = await Promise.all([
          fetchAssignableUsers(), // ✅ Fetch architects + Site Staff
          fetchProjects(),
        ]);
        setAssignableUsers(users);
        setProjects(projs);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dropdown data");
      }
    };

    if (isOpen) loadData();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };
  const handleSave = async () => {
    if (!formData.title || !formData.dueDate) {
      toast.error("Please fill all required fields (Title and Due Date)");
      return;
    }

    if (!projectId && !formData.project) {
      toast.error("Please select a project");
      return;
    }

    const taskData = {
      name: formData.title,
      description: formData.description || "",
      projectId: projectId || formData.project,
      assignedTo: formData.assignedTo || undefined,
      startDate: formData.startDate || undefined,
      dueDate: formData.dueDate || undefined,
      status: formData.status || "TODO",
      priority: formData.priority || "MEDIUM",
      value: formData.value ? parseFloat(formData.value) : 0,
      weight_pct: formData.weight_pct ? parseFloat(formData.weight_pct) : 0,
    };

    // Remove undefined fields
    Object.keys(taskData).forEach(key => {
      if (taskData[key] === undefined) {
        delete taskData[key];
      }
    });

    console.log("🟢 Creating task with data:", taskData);

    try {
      setLoading(true);
      const res = await createTask(taskData);
      console.log("✅ Task created successfully:", res);
      
      // Extract task from response (could be { task: {...} } or just task object)
      const createdTask = res.task || res;

      toast.success("Task created successfully!");
      setShowMessage(true);

      // Reset form
      setFormData({
        title: "",
        dueDate: "",
        startDate: "",
        taskType: "",
        assignedTo: "",
        project: "",
        description: "",
        status: "TODO",
        value: "",
        weight_pct: "",
        priority: "MEDIUM",
      });

      if (onCreated) onCreated();

      setTimeout(() => {
        setShowMessage(false);
        setIsOpen(false);
      }, 1200);
    } catch (error) {
      console.error("❌ Error while creating task:", error);
      if (error.response) {
        console.error("🔴 Backend responded with:", error.response.data);
        toast.error(
          `Failed: ${error.response?.data?.message || "Unknown error"}`
        );
      } else {
        toast.error("Failed to create task");
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleSave = async () => {
  //   if (!formData.title || !formData.dueDate || !formData.taskType) {
  //     toast.error("Please fill all required fields");
  //     return;
  //   }

  //   const todoData = {
  //     itemName: formData.title,
  //     dueDate: formData.dueDate,
  //     type: formData.taskType,
  //     assigned: formData.assignedTo ? [formData.assignedTo] : [], // ✅ just array of ids
  //     projectId: projectId || formData.project, // ✅ backend requires projectId
  //     status: formData.status,
  //     description: formData.description,
  //   };

  //   try {
  //     setLoading(true);
  //     await createTodo(todoData);
  //     toast.success("Todo created successfully!");
  //     setShowMessage(true);
  //     setFormData({
  //       title: "",
  //       dueDate: "",
  //       taskType: "",
  //       assignedTo: "",
  //       project: "",
  //       description: "",
  //       status: "Pending",
  //     });
  //     if (onCreated) onCreated(); // refresh parent data
  //     setTimeout(() => {
  //       setShowMessage(false);
  //       setIsOpen(false);
  //     }, 1200);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to create todo");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={handleClose}
      ></div>

      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 h-full w-[450px] max-w-full bg-white shadow-lg z-50 animate-slide-in-left overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-4 border-red-500 sticky top-0 bg-white z-10 shadow">
          <div className="text-sm font-medium tracking-wide">NEW TO DO</div>
          <div className="flex items-center space-x-2">
            <Button
              className="bg-red-600 text-white text-sm px-4 py-1.5 rounded hover:bg-red-700"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button
              className="text-gray-600 hover:text-black"
              onClick={handleClose}
              aria-label="Close Modal"
            >
              <MdClose size={24} />
            </Button>
          </div>
        </div>

        {/* Optional Save Message */}
        {showMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 text-sm text-center font-medium">
            Saved successfully!
          </div>
        )}

        {/* Form Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-gray-500">TITLE</label>
            <Input
              name="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange("title")}
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="text-xs font-medium text-gray-500">
              START DATE
            </label>
            <div className="flex items-center mt-1 border rounded-md px-3 py-2 text-sm">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <input
                type="date"
                value={formData.startDate}
                onChange={handleChange("startDate")}
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-xs font-medium text-gray-500">
              DUE DATE
            </label>
            <div className="flex items-center mt-1 border rounded-md px-3 py-2 text-sm">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <input
                type="date"
                value={formData.dueDate}
                onChange={handleChange("dueDate")}
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Assigned To (Architects + Site Staff) */}
          <DropDown
            label="ASSIGNED TO"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange("assignedTo")}
            options={assignableUsers.map((user) => ({ 
              value: user._id, 
              label: `${user.name} (${user.role})` // ✅ Show name and role
            }))}
          />

          {/* <DropDown
            label="ASSIGNED TO"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange("assignedTo")}
            options={architects.map((a) => ({ value: a.id, label: a.name }))}
          /> */}
          {/* Project Selection (only if no projectId passed) */}

          {!projectId && (
            <DropDown
              label="PROJECT"
              name="project"
              value={formData.project}
              onChange={handleChange("project")}
              options={projects.map((p) => ({ value: p._id || p.id, label: p.name }))}
            />
          )}
          {projectId && (
            <div>
              <label className="text-xs font-medium text-gray-500">PROJECT</label>
              <div className="mt-1 px-3 py-2 border rounded-md text-sm bg-gray-50">
                {projects.find(p => (p._id || p.id) === projectId)?.name || "Current Project"}
              </div>
            </div>
          )}

          {/* Task Type */}
          <DropDown
            label="TASK TYPE"
            name="taskType"
            value={formData.taskType}
            onChange={handleChange("taskType")}
            options={[
              { value: "Plumbing", label: "Plumbing" },
              { value: "Electrical", label: "Electrical" },
            ]}
          />

          {/* Status */}
          <DropDown
            label="STATUS"
            name="status"
            value={formData.status}
            onChange={handleChange("status")}
            options={[
              { value: "TODO", label: "TODO" },
              { value: "IN_PROGRESS", label: "IN_PROGRESS" },
              { value: "REVIEW", label: "REVIEW" },
              { value: "DONE", label: "DONE" },
              { value: "REJECTED", label: "REJECTED" },
            ]}
          />

          {/* Priority */}
          <DropDown
            label="PRIORITY"
            name="priority"
            value={formData.priority}
            onChange={handleChange("priority")}
            options={[
              { value: "LOW", label: "LOW" },
              { value: "MEDIUM", label: "MEDIUM" },
              { value: "HIGH", label: "HIGH" },
              { value: "CRITICAL", label: "CRITICAL" },
            ]}
          />

          {/* Value */}
          <div>
            <label className="text-xs font-medium text-gray-500">
              VALUE (₹)
            </label>
            <Input
              name="value"
              type="number"
              placeholder="Enter task value (e.g., 50000)"
              value={formData.value}
              onChange={handleChange("value")}
              min="0"
            />
          </div>

          {/* Weight Percentage */}
          <div>
            <label className="text-xs font-medium text-gray-500">
              WEIGHT % (0-100)
            </label>
            <Input
              name="weight_pct"
              type="number"
              placeholder="Enter weight percentage (e.g., 15)"
              value={formData.weight_pct}
              onChange={handleChange("weight_pct")}
              min="0"
              max="100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-gray-500">
              DESCRIPTION
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={handleChange("description")}
              placeholder="Enter description"
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewTodoModal;
