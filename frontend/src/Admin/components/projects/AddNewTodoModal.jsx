import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import DropDown from "../../../components/DropDown";
import { createTodo } from "../../../services/todoServices";
import { toast } from "react-toastify";
import { fetchArchitects } from "../../../services/leadServices";
import { fetchProjects } from "../../../services/projectServices";

function AddNewTodoModal({ isOpen, setIsOpen, projectId, onCreated }) {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    taskType: "",
    assignedTo: "",
    project: "",
    description: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);
  const [architects, setArchitects] = useState([]);
  const [projects, setProjects] = useState([]);

  // Fetch architects & projects
  useEffect(() => {
    const loadData = async () => {
      try {
        const [archs, projs] = await Promise.all([
          fetchArchitects(),
          fetchProjects(),
        ]);
        setArchitects(archs);
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
    if (!formData.title || !formData.dueDate || !formData.taskType) {
      toast.error("Please fill all required fields");
      return;
    }

    const todoData = {
      itemName: formData.title,
      dueDate: formData.dueDate,
      type: formData.taskType,
      assigned: formData.assignedTo ? [formData.assignedTo] : [],
      projectId: projectId || formData.project,
      status: formData.status,
      description: formData.description,
    };

    // 🔎 Debug logs
    console.log("🟢 FormData state before sending:", formData);
    console.log(
      "🟡 Final todoData being sent:",
      JSON.stringify(todoData, null, 2)
    );

    try {
      setLoading(true);
      const res = await createTodo(todoData);
      console.log("✅ Server response:", res);

      toast.success("Todo created successfully!");
      setShowMessage(true);

      setFormData({
        title: "",
        dueDate: "",
        taskType: "",
        assignedTo: "",
        project: "",
        description: "",
        status: "Pending",
      });

      if (onCreated) onCreated();

      setTimeout(() => {
        setShowMessage(false);
        setIsOpen(false);
      }, 1200);
    } catch (error) {
      console.error("❌ Error while creating todo:", error);
      if (error.response) {
        console.error("🔴 Backend responded with:", error.response.data);
        toast.error(
          `Failed: ${error.response.data.message || "Unknown error"}`
        );
      } else {
        toast.error("Failed to create todo");
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

          {/* Assigned To Architect */}
          <DropDown
            label="ASSIGNED TO"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange("assignedTo")}
            options={architects.map((a) => ({ value: a.id, label: a.name }))}
          />
          {/* Project Selection (only if no projectId passed) */}

          <DropDown
            label="PROJECT"
            name="project"
            value={formData.project}
            onChange={handleChange("project")}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
          />

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
              { value: "Pending", label: "Pending" },
              { value: "Completed", label: "Completed" },
            ]}
          />

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
