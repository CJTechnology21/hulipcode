
import React, { useState, useEffect, useCallback } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiPlus, FiFilter } from "react-icons/fi";
import Button from "../../../components/Button";
import SearchBar from "../../../components/SearchBar";
import TodoFilter from "./TodoFilter";
import AddNewTodoModal from "./AddNewTodoModal";
import { toast } from "react-toastify";
import {
  getDeliverablesByQuoteId,
  updateDeliverable,
  deleteDeliverable,
  fetchQuoteSummary,
} from "../../../services/quoteServices";
import { fetchTasksByProject } from "../../../services/overViewServices";
import { fetchAssignableUsers } from "../../../services/leadServices";
import { patchTask } from "../../../services/overViewServices";
import DropDown from "../../../components/DropDown";

function ProjectToDo({ projectId, quoteId }) {
  const [deliverables, setDeliverables] = useState([]);
  const [tasks, setTasks] = useState([]); // ✅ Add tasks state
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [summary, setSummary] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [viewMode, setViewMode] = useState(quoteId ? "deliverables" : "tasks"); // ✅ "tasks" or "deliverables"
  const [assignableUsers, setAssignableUsers] = useState([]); // All team members for assignment
  const [updatingDeliverable, setUpdatingDeliverable] = useState(null); // Track which deliverable is being updated
  const [selectedSpace, setSelectedSpace] = useState(null); // Selected space for filtering deliverables
  const [availableSpaces, setAvailableSpaces] = useState([]); // List of all spaces from summary
  const [editingTaskAssignment, setEditingTaskAssignment] = useState(null); // Track which task is being edited
  const [taskAssignmentValues, setTaskAssignmentValues] = useState({}); // Store temporary assignment values
  const [savingTask, setSavingTask] = useState(null); // Track which task is being saved
  const [isProfessional, setIsProfessional] = useState(false); // Check if current user is a professional
  const [isClient, setIsClient] = useState(false); // Check if current user is a client
  const [approvingDeliverable, setApprovingDeliverable] = useState(null); // Track which deliverable is being approved/canceled

  // ✅ Fetch Tasks
  const fetchTasks = async () => {
    try {
      // Skip fetching tasks for clients (they only see deliverables)
      const currentUserRole = localStorage.getItem('crm_role') || '';
      if (currentUserRole === 'client') {
        console.log("⏭️ Skipping task fetch for client user");
        setTasks([]);
        return;
      }
      
      if (!projectId) return;
      // Ensure projectId is a string
      const projectIdString = typeof projectId === 'string' ? projectId : (projectId?._id || projectId?.toString());
      if (!projectIdString) {
        console.warn("Invalid projectId:", projectId);
        return;
      }
      const data = await fetchTasksByProject(projectIdString);
      // Handle both { tasks: [...] } and array formats
      const tasksArray = Array.isArray(data) ? data : (data?.tasks || []);
      setTasks(tasksArray);
      if (viewMode === "tasks") {
        setFilteredItems(tasksArray);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // Don't show error if it's just 404 (no tasks yet) or 403 (forbidden for clients)
      if (error.response?.status !== 404 && error.response?.status !== 403) {
        toast.error("Failed to load tasks");
      }
      setTasks([]);
    }
  };

  // ✅ Fetch Deliverables
  const fetchDeliverables = async () => {
    try {
      if (!quoteId) return;
      // Ensure quoteId is a string (handle if it's an object)
      const quoteIdString = typeof quoteId === 'string' ? quoteId : (quoteId?._id || quoteId?.toString());
      if (!quoteIdString) {
        console.warn("Invalid quoteId:", quoteId);
        return;
      }
      const data = await getDeliverablesByQuoteId(quoteIdString);
      if (!data?.deliverables) return;
      
      // Log deliverables to verify spaceId is present
      console.log("📦 Fetched deliverables:", data.deliverables.map(d => ({
        id: d._id,
        code: d.code,
        space: d.space,
        spaceId: d.spaceId,
        spaceIdType: typeof d.spaceId
      })));
      
      setDeliverables(data.deliverables);
      if (viewMode === "deliverables") {
        setFilteredItems(data.deliverables);
      }
    } catch (error) {
      console.error("Error fetching deliverables:", error);
      toast.error("Failed to load deliverables");
    }
  };

  // ✅ Fetch Quote Summary
  const fetchSummary = async () => {
    if (!quoteId) return;
    try {
      setLoadingSummary(true);
      // Ensure quoteId is a string (handle if it's an object)
      const quoteIdString = typeof quoteId === 'string' ? quoteId : (quoteId?._id || quoteId?.toString());
      if (!quoteIdString) {
        console.warn("Invalid quoteId:", quoteId);
        return;
      }
      const data = await fetchQuoteSummary(quoteIdString);
      if (Array.isArray(data)) {
        setSummary(data);
        // Extract unique spaces from summary
        const spaces = data
          .filter(s => s.space)
          .map(s => ({ name: s.space, id: s._id, spaceId: s.spaceId }))
          .filter((space, index, self) => 
            index === self.findIndex(s => s.name === space.name)
          );
        setAvailableSpaces(spaces);
        // Auto-select first space if none selected
        if (!selectedSpace && spaces.length > 0) {
          setSelectedSpace(spaces[0].name);
        }
      } else {
        setSummary([]);
        setAvailableSpaces([]);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      toast.error("Failed to fetch summary");
    } finally {
      setLoadingSummary(false);
    }
  };

  // Fetch assignable users (all team members)
  const fetchUsers = async () => {
    try {
      console.log("👥 Fetching assignable users...");
      const users = await fetchAssignableUsers();
      console.log("👥 Fetched assignable users:", users?.length || 0, users);
      setAssignableUsers(users || []);
    } catch (error) {
      console.error("❌ Error fetching assignable users:", error);
      toast.error("Failed to load assignable users");
    }
  };

  // Check if current user is a professional or client
  useEffect(() => {
    const currentUserRole = localStorage.getItem('crm_role') || '';
    const isProf = currentUserRole === 'architect';
    const isCli = currentUserRole === 'client';
    setIsProfessional(isProf);
    setIsClient(isCli);
    console.log("👤 User role check:", { currentUserRole, isProf, isCli });
  }, []);

  useEffect(() => {
    // Only fetch tasks if user is not a client (clients only see deliverables)
    if (!isClient) {
      fetchTasks();
    }
    fetchDeliverables();
    fetchSummary();
    // Only fetch assignable users if user is a professional (for task assignment)
    if (isProfessional) {
      fetchUsers(); // Fetch team members
    }
  }, [projectId, quoteId, isClient, isProfessional]);

  // ✅ Convert deliverables to task-like format for Tasks tab
  const convertDeliverablesToTasks = useCallback((deliverablesList) => {
    if (!Array.isArray(deliverablesList)) return [];
    return deliverablesList.map((deliverable) => {
      // Extract spaceId from the original deliverable (should come from backend)
      let spaceIdValue = deliverable.spaceId;
      
      // If spaceId is an object, extract the _id
      if (spaceIdValue && typeof spaceIdValue === 'object') {
        spaceIdValue = spaceIdValue._id || spaceIdValue.toString();
      }
      
      // Convert to string if it exists
      if (spaceIdValue && typeof spaceIdValue !== 'string') {
        spaceIdValue = spaceIdValue.toString();
      }
      
      // Preserve all deliverable fields for display in Deliverables format
      const converted = {
        ...deliverable, // Preserve all original deliverable fields (including spaceId)
        _id: deliverable._id,
        name: deliverable.description || deliverable.code || "Untitled Deliverable",
        description: deliverable.spec || deliverable.description || "",
        status: deliverable.status || "PENDING", // Keep original status format
        priority: "MEDIUM",
        assignedTo: deliverable.assignedTo,
        dueDate: null, // Deliverables don't have due dates
        value: (deliverable.rate || 0) * (deliverable.qty || 0),
        weight_pct: 0,
        progress: deliverable.progress || 0,
        // Store deliverable info for reference
        isDeliverable: true,
        deliverableData: deliverable, // Keep original for reference
        space: deliverable.space,
        // Ensure spaceId is properly set (use extracted value or original)
        spaceId: spaceIdValue || deliverable.spaceId || null,
        code: deliverable.code,
        category: deliverable.category,
        unit: deliverable.unit,
        qty: deliverable.qty,
        rate: deliverable.rate,
        gst: deliverable.gst,
        photo: deliverable.photo,
      };
      
      // Log if spaceId is missing for debugging
      if (!converted.spaceId) {
        console.warn("⚠️ Deliverable missing spaceId after conversion:", {
          deliverableId: deliverable._id,
          originalSpaceId: deliverable.spaceId,
          convertedSpaceId: converted.spaceId,
          deliverableKeys: Object.keys(deliverable),
          deliverableSpace: deliverable.space
        });
      }
      
      return converted;
    });
  }, []);

  // ✅ Update filtered items when view mode or selected space changes
  useEffect(() => {
    if (viewMode === "tasks") {
      if (isClient) {
        // For clients, show only PENDING/not approved deliverables as requests (no regular tasks, no approved ones)
        const pendingDeliverables = deliverables.filter(d => 
          d.status !== "APPROVED" && 
          d.status !== "COMPLETED" && 
          d.status !== "CANCELLED" && 
          d.status !== "REJECTED"
        );
        const deliverablesAsTasks = convertDeliverablesToTasks(pendingDeliverables);
        setFilteredItems(deliverablesAsTasks);
      } else {
        // For professionals, combine tasks and deliverables
        const deliverablesAsTasks = convertDeliverablesToTasks(deliverables);
        const allItems = [...tasks, ...deliverablesAsTasks];
        setFilteredItems(allItems);
      }
    } else {
      // Deliverables tab - show approved deliverables for clients, assigned deliverables for professionals
      if (isClient) {
        // For clients, show only APPROVED deliverables
        const approvedDeliverables = deliverables.filter(d => 
          d.status === "APPROVED" || d.status === "COMPLETED"
        );
        setFilteredItems(approvedDeliverables);
      } else {
        // For professionals, show ONLY assigned deliverables
        const assignedDeliverables = deliverables.filter(d => 
          d.assignedTo && (d.assignedTo._id || d.assignedTo)
        );
        setFilteredItems(assignedDeliverables);
      }
    }
  }, [viewMode, tasks, deliverables, convertDeliverablesToTasks, isClient]);
  
  // ✅ Initial load - set filtered items based on view mode
  useEffect(() => {
    if (viewMode === "tasks") {
      if (isClient) {
        // For clients, show only PENDING/not approved deliverables as requests
        const pendingDeliverables = deliverables.filter(d => 
          d.status !== "APPROVED" && 
          d.status !== "COMPLETED" && 
          d.status !== "CANCELLED" && 
          d.status !== "REJECTED"
        );
        const deliverablesAsTasks = convertDeliverablesToTasks(pendingDeliverables);
        setFilteredItems(deliverablesAsTasks);
      } else {
        // For professionals, combine tasks and deliverables
        const deliverablesAsTasks = convertDeliverablesToTasks(deliverables);
        const allItems = [...tasks, ...deliverablesAsTasks];
        setFilteredItems(allItems);
      }
    } else if (viewMode === "deliverables") {
      // Deliverables tab - show approved deliverables for clients, assigned deliverables for professionals
      if (isClient) {
        // For clients, show only APPROVED deliverables
        const approvedDeliverables = deliverables.filter(d => 
          d.status === "APPROVED" || d.status === "COMPLETED"
        );
        setFilteredItems(approvedDeliverables);
      } else {
        // For professionals, show ONLY assigned deliverables
        const assignedDeliverables = deliverables.filter(d => 
          d.assignedTo && (d.assignedTo._id || d.assignedTo)
        );
        setFilteredItems(assignedDeliverables);
      }
    }
  }, [viewMode, tasks, deliverables, convertDeliverablesToTasks, isClient]);

  // ✅ Search Filter
  useEffect(() => {
    if (viewMode === "tasks") {
      if (isClient) {
        // For clients, show only PENDING/not approved deliverables as requests
        const pendingDeliverables = deliverables.filter(d => 
          d.status !== "APPROVED" && 
          d.status !== "COMPLETED" && 
          d.status !== "CANCELLED" && 
          d.status !== "REJECTED"
        );
        const deliverablesAsTasks = convertDeliverablesToTasks(pendingDeliverables);
        let filtered = deliverablesAsTasks;
        
        // Filter by selected space if one is selected
        if (selectedSpace) {
          filtered = filtered.filter((item) => item.space === selectedSpace);
        }
        
        // Apply search filter
        if (searchTerm) {
          filtered = filtered.filter((item) =>
            (item.name || item.description || item.code || item.space || "").toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        setFilteredItems(filtered);
      } else {
        // For professionals, combine tasks and deliverables for search
        const deliverablesAsTasks = convertDeliverablesToTasks(deliverables);
        let filtered = [...tasks, ...deliverablesAsTasks];
        
        // Filter by selected space if one is selected
        if (selectedSpace) {
          filtered = filtered.filter((item) => item.space === selectedSpace);
        }
        
        // Apply search filter
        if (searchTerm) {
          filtered = filtered.filter((item) =>
            (item.name || item.description || item.code || item.space || "").toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        setFilteredItems(filtered);
      }
    } else {
      // Deliverables tab - show approved deliverables for clients, assigned deliverables for professionals
      if (isClient) {
        // For clients, show only APPROVED deliverables, then filter by search
        let filtered = deliverables.filter(d => 
          d.status === "APPROVED" || d.status === "COMPLETED"
        );
        if (searchTerm) {
          filtered = filtered.filter((item) =>
            (item.description || item.code || item.space || "").toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        setFilteredItems(filtered);
      } else {
        // For professionals, show ONLY assigned deliverables, then filter by search
        let filtered = deliverables.filter(d => 
          d.assignedTo && (d.assignedTo._id || d.assignedTo)
        );
        if (searchTerm) {
          filtered = filtered.filter((item) =>
            (item.description || item.code || item.space || "").toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        setFilteredItems(filtered);
      }
    }
  }, [searchTerm, viewMode, tasks, deliverables, selectedSpace, convertDeliverablesToTasks, isClient]);

  // ✅ Handle approve/cancel deliverable request (for clients)
  const handleApproveDeliverable = async (deliverable) => {
    try {
      if (!quoteId) {
        toast.error("Quote ID is missing");
        return;
      }
      setApprovingDeliverable(deliverable._id);
      
      const spaceIdToUse = deliverable.spaceId || deliverable.deliverableData?.spaceId;
      if (!spaceIdToUse) {
        toast.error("Space ID is missing for this deliverable");
        setApprovingDeliverable(null);
        return;
      }
      
      const quoteIdString = typeof quoteId === 'string' ? quoteId : (quoteId?._id || quoteId?.toString());
      
      // Approve: Set status to "APPROVED"
      await updateDeliverable(
        quoteIdString,
        spaceIdToUse,
        deliverable._id,
        { status: "APPROVED" }
      );
      
      toast.success("Deliverable request approved");
      await fetchDeliverables(); // Refresh deliverables
    } catch (error) {
      console.error("Error approving deliverable:", error);
      toast.error(error.response?.data?.message || "Failed to approve request");
    } finally {
      setApprovingDeliverable(null);
    }
  };

  const handleCancelDeliverable = async (deliverable) => {
    try {
      if (!quoteId) {
        toast.error("Quote ID is missing");
        return;
      }
      setApprovingDeliverable(deliverable._id);
      
      const spaceIdToUse = deliverable.spaceId || deliverable.deliverableData?.spaceId;
      if (!spaceIdToUse) {
        toast.error("Space ID is missing for this deliverable");
        setApprovingDeliverable(null);
        return;
      }
      
      const quoteIdString = typeof quoteId === 'string' ? quoteId : (quoteId?._id || quoteId?.toString());
      
      // Cancel: Set status to "CANCELLED"
      await updateDeliverable(
        quoteIdString,
        spaceIdToUse,
        deliverable._id,
        { status: "CANCELLED" }
      );
      
      toast.success("Deliverable request cancelled");
      await fetchDeliverables(); // Refresh deliverables
    } catch (error) {
      console.error("Error cancelling deliverable:", error);
      toast.error(error.response?.data?.message || "Failed to cancel request");
    } finally {
      setApprovingDeliverable(null);
    }
  };

  // ✅ Update deliverable status or assignedTo
  const handleUpdateDeliverable = async (deliverable, field, value) => {
    try {
      if (!quoteId) {
        toast.error("Quote ID is missing");
        return;
      }
      setUpdatingDeliverable(deliverable._id);
      const updateData = { [field]: value };
      // Ensure quoteId is a string
      const quoteIdString = typeof quoteId === 'string' ? quoteId : (quoteId?._id || quoteId?.toString());
      await updateDeliverable(
        quoteIdString,
        deliverable.spaceId,
        deliverable._id,
        updateData
      );
      toast.success("Deliverable updated successfully");
      fetchDeliverables();
    } catch (error) {
      console.error("Error updating deliverable:", error);
      toast.error("Failed to update deliverable");
    } finally {
      setUpdatingDeliverable(null);
    }
  };

  // ✅ Edit / Save Deliverable (for other fields)
  const handleEdit = (deliverable) => {
    setEditingId(deliverable._id);
    setEditData({ ...deliverable });
    setActionMenuId(null);
  };

  const handleSave = async (deliverable) => {
    try {
      if (!quoteId) {
        toast.error("Quote ID is missing");
        return;
      }
      // Ensure quoteId is a string
      const quoteIdString = typeof quoteId === 'string' ? quoteId : (quoteId?._id || quoteId?.toString());
      await updateDeliverable(
        quoteIdString,
        deliverable.spaceId,
        deliverable._id,
        editData
      );
      toast.success("Deliverable updated successfully");
      setEditingId(null);
      setEditData({});
      fetchDeliverables();
    } catch (error) {
      console.error("Error updating deliverable:", error);
      toast.error("Failed to update deliverable");
    }
  };

  // ✅ Delete Deliverable
  const handleDelete = async (deliverable) => {
    try {
      if (!quoteId) {
        toast.error("Quote ID is missing");
        return;
      }
      // Ensure quoteId is a string
      const quoteIdString = typeof quoteId === 'string' ? quoteId : (quoteId?._id || quoteId?.toString());
      await deleteDeliverable(quoteIdString, deliverable.spaceId, deliverable._id);
      toast.success("Deliverable deleted successfully");
      fetchDeliverables();
      setActionMenuId(null);
    } catch (error) {
      console.error("Error deleting deliverable:", error);
      toast.error("Failed to delete deliverable");
    }
  };

  // ✅ Handle task assignment change
  const handleTaskAssignmentChange = (taskId, userId) => {
    setTaskAssignmentValues(prev => ({
      ...prev,
      [taskId]: userId
    }));
    // Don't set editingTaskAssignment here - we want dropdown always visible for professionals
  };

  // ✅ Save task assignment (handles both tasks and deliverables)
  const handleSaveTaskAssignment = async (task) => {
    try {
      setSavingTask(task._id);
      
      // Get the selected value from state, or fallback to current assignment
      const selectedUserId = taskAssignmentValues[task._id];
      const currentAssignedId = task.assignedTo?._id || task.assignedTo || "";
      
      // Use selected value if available, otherwise use current
      const assignedToId = selectedUserId !== undefined ? selectedUserId : currentAssignedId;
      
      if (!assignedToId) {
        toast.error("Please select a user to assign");
        setSavingTask(null);
        return;
      }

      console.log("💾 Saving assignment:", { 
        itemId: task._id, 
        assignedToId,
        itemName: task.name,
        isDeliverable: task.isDeliverable
      });
      
      // If it's a deliverable, update the deliverable instead of creating a task
      if (task.isDeliverable) {
        if (!quoteId) {
          toast.error("Quote ID is missing");
          setSavingTask(null);
          return;
        }
        
        // Extract spaceId from task (top level) or deliverableData
        let spaceIdToUse = task.spaceId;
        
        // If not found, try to get from deliverableData (original deliverable)
        if (!spaceIdToUse && task.deliverableData) {
          spaceIdToUse = task.deliverableData.spaceId;
        }
        
        // If spaceId is an object, extract the _id
        if (spaceIdToUse && typeof spaceIdToUse === 'object') {
          spaceIdToUse = spaceIdToUse._id || spaceIdToUse.toString();
        }
        
        // Convert to string if it's not already
        if (spaceIdToUse && typeof spaceIdToUse !== 'string') {
          spaceIdToUse = spaceIdToUse.toString();
        }
        
        if (!spaceIdToUse) {
          // Try to find spaceId from the original deliverables list
          const originalDeliverable = deliverables.find(d => d._id === task._id);
          if (originalDeliverable && originalDeliverable.spaceId) {
            spaceIdToUse = originalDeliverable.spaceId;
            if (typeof spaceIdToUse !== 'string') {
              spaceIdToUse = spaceIdToUse.toString();
            }
          }
        }
        
        if (!spaceIdToUse) {
          toast.error("Space ID is missing for this deliverable. Please refresh the page.");
          setSavingTask(null);
          console.error("Missing spaceId for deliverable:", {
            taskId: task._id,
            taskSpaceId: task.spaceId,
            deliverableDataSpaceId: task.deliverableData?.spaceId,
            originalDeliverable: deliverables.find(d => d._id === task._id),
            fullTask: task,
            allDeliverables: deliverables.map(d => ({ id: d._id, spaceId: d.spaceId }))
          });
          return;
        }
        
        const quoteIdString = typeof quoteId === 'string' ? quoteId : (quoteId?._id || quoteId?.toString());
        
        console.log("📦 Updating deliverable:", {
          quoteId: quoteIdString,
          spaceId: spaceIdToUse,
          itemId: task._id,
          assignedTo: assignedToId,
          spaceIdType: typeof spaceIdToUse
        });
        
        await updateDeliverable(
          quoteIdString,
          spaceIdToUse,
          task._id,
          { assignedTo: assignedToId }
        );
        toast.success("Deliverable assigned successfully");
        await fetchDeliverables(); // Refresh deliverables
      } else {
        // It's a regular task
        await patchTask(task._id, { assignedTo: assignedToId });
        toast.success("Task assigned successfully");
        await fetchTasks(); // Refresh tasks
      }
      
      // Clear the temporary value after successful save
      setTaskAssignmentValues(prev => {
        const newValues = { ...prev };
        delete newValues[task._id];
        return newValues;
      });
    } catch (error) {
      console.error("❌ Error assigning:", error);
      toast.error(error.response?.data?.message || "Failed to assign");
    } finally {
      setSavingTask(null);
    }
  };

  return (
    <div className="p-8 m-4 md:p-6 space-y-6 bg-white w-full rounded-xl shadow-sm">
      {/* Header Tools */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
          {/* View Mode Toggle */}
          <div className="flex gap-2 border rounded-md p-1">
            <button
              onClick={() => setViewMode("tasks")}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === "tasks"
                  ? "bg-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Tasks
            </button>
            {quoteId && (
              <button
                onClick={() => setViewMode("deliverables")}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === "deliverables"
                    ? "bg-red-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Deliverables
              </button>
            )}
          </div>
          <div className="w-60">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={viewMode === "tasks" ? "Search tasks" : "Search deliverables"}
            />
          </div>
          <Button
            className="text-red-600 text-sm flex items-center gap-1 hover:bg-red-200 cursor-pointer bg-red-100"
            onClick={() => setShowFilter(true)}
          >
            <FiFilter /> Filter
          </Button>
        </div>
        {viewMode === "tasks" && (
          <Button
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <FiPlus /> New Task
          </Button>
        )}
      </div>

      {/* Space Tabs (only for tasks view - to show space grouping) */}
      {viewMode === "tasks" && availableSpaces.length > 0 && (
        <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setSelectedSpace(null)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors ${
              !selectedSpace
                ? "bg-red-600 text-white border-b-2 border-red-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Spaces
          </button>
          {availableSpaces.map((space) => (
            <button
              key={space.id || space.name}
              onClick={() => setSelectedSpace(space.name)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors ${
                selectedSpace === space.name
                  ? "bg-red-600 text-white border-b-2 border-red-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {space.name}
            </button>
          ))}
        </div>
      )}


      {/* ✅ Table - Tasks or Deliverables */}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-gray-700 border-collapse">
          <thead className="bg-red-100 text-left">
            {viewMode === "tasks" ? (
              // Tasks tab uses Deliverables format
              <tr>
                <th className="px-2 py-2 text-center w-8">#</th>
                <th className="px-2 py-2 w-20">Code</th>
                <th className="px-2 py-2 w-24">Category</th>
                <th className="px-2 py-2 w-[30%]">Description</th>
                <th className="px-1 py-2 text-center w-14">Unit</th>
                <th className="px-2 py-2 text-right w-16">Qty</th>
                <th className="px-2 py-2 text-right w-24">Rate</th>
                <th className="px-2 py-2 text-right w-16">GST</th>
                <th className="px-2 py-2 w-32">Status</th>
                {isClient ? (
                  <>
                    <th className="px-2 py-2 w-40">Assigned To</th>
                    <th className="px-2 py-2 w-40">Action</th>
                  </>
                ) : (
                  <th className="px-2 py-2 w-40">Assigned To</th>
                )}
                <th className="px-2 py-2 w-32">Progress</th>
                <th className="px-2 py-2 text-center w-20">Photo</th>
              </tr>
            ) : (
              <tr>
                <th className="px-2 py-2 text-center w-8">#</th>
                <th className="px-2 py-2 w-20">Code</th>
                <th className="px-2 py-2 w-24">Category</th>
                <th className="px-2 py-2 w-[30%]">Description</th>
                <th className="px-1 py-2 text-center w-14">Unit</th>
                <th className="px-2 py-2 text-right w-16">Qty</th>
                <th className="px-2 py-2 text-right w-24">Rate</th>
                <th className="px-2 py-2 text-right w-16">GST</th>
                <th className="px-2 py-2 w-32">Status</th>
                {isClient ? (
                  <>
                    <th className="px-2 py-2 w-40">Assigned To</th>
                    <th className="px-2 py-2 w-40">Action</th>
                  </>
                ) : (
                  <th className="px-2 py-2 w-40">Assigned To</th>
                )}
                <th className="px-2 py-2 w-32">Progress</th>
                <th className="px-2 py-2 text-center w-20">Photo</th>
              </tr>
            )}
          </thead>

          <tbody>
            {viewMode === "tasks" ? (
              // Tasks Table - Group by space and show in Deliverables format
              (() => {
                // Group items by space
                const groupedBySpace = {};
                let itemIndex = 0;
                
                filteredItems.forEach((item) => {
                  // Use space name if available, otherwise "Other Tasks" for regular tasks
                  const spaceName = item.space || (item.isDeliverable ? "Unassigned Space" : "Other Tasks");
                  if (!groupedBySpace[spaceName]) {
                    groupedBySpace[spaceName] = [];
                  }
                  groupedBySpace[spaceName].push(item);
                });
                
                // Sort space names: put "Other Tasks" and "Unassigned Space" at the end
                const sortedSpaces = Object.keys(groupedBySpace).sort((a, b) => {
                  if (a === "Other Tasks" || a === "Unassigned Space") return 1;
                  if (b === "Other Tasks" || b === "Unassigned Space") return -1;
                  return a.localeCompare(b);
                });
                
                // Render grouped items
                const rows = [];
                sortedSpaces.forEach((spaceName) => {
                  // Add space header row - adjust colSpan based on client view
                  const colSpan = isClient ? 13 : 12; // 13 columns for clients (includes both Assigned To and Action)
                  rows.push(
                    <tr key={`space-${spaceName}`} className="bg-gray-200 border-t-2 border-gray-300">
                      <td colSpan={colSpan} className="px-4 py-3 font-semibold text-gray-800">
                        {spaceName}
                      </td>
                    </tr>
                  );
                  
                  // Add items for this space
                  groupedBySpace[spaceName].forEach((item) => {
                    itemIndex++;
                    const isDeliverable = item.isDeliverable;
                    
                    rows.push(
                      <tr
                        key={item._id}
                        className="border-t hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-2 py-2 text-center">{itemIndex}</td>
                    <td className="px-2 py-2 truncate">
                      {isDeliverable ? (item.code || "-") : (item.name || "-")}
                    </td>
                    <td className="px-2 py-2 truncate">
                      {isDeliverable ? (item.category || "-") : "Task"}
                    </td>
                    <td className="px-2 py-2 truncate max-w-[200px]">
                      {isDeliverable ? (item.description || item.spec || "-") : (item.description || item.name || "-")}
                    </td>
                    <td className="px-1 py-2 text-center">
                      {isDeliverable ? (item.unit || "-") : "-"}
                    </td>
                    <td className="px-2 py-2 text-right">
                      {isDeliverable ? (item.qty || 0) : "-"}
                    </td>
                    <td className="px-2 py-2 text-right">
                      {isDeliverable ? `₹${item.rate?.toLocaleString() || 0}` : `₹${item.value?.toLocaleString() || 0}`}
                    </td>
                    <td className="px-2 py-2 text-right">
                      {isDeliverable ? `${item.gst || 0}%` : "-"}
                    </td>
                    <td className="px-2 py-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        isDeliverable ? (
                          item.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                          item.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                          item.status === "ON_HOLD" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        ) : (
                          item.status === "DONE" ? "bg-green-100 text-green-800" :
                          item.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                          item.status === "REVIEW" ? "bg-yellow-100 text-yellow-800" :
                          item.status === "REJECTED" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        )
                      }`}>
                        {isDeliverable ? (item.status || "PENDING") : (item.status || "TODO")}
                      </span>
                    </td>
                    {isClient && isDeliverable ? (
                      // Client view: Show assigned to info and approve/cancel buttons in separate columns
                      <>
                        <td className="px-2 py-2">
                          <span className="text-xs">
                            {item.assignedTo?.name || "Unassigned"}
                            {item.assignedTo?.role && (
                              <span className="text-gray-500 ml-1">({item.assignedTo.role})</span>
                            )}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveDeliverable(item)}
                              disabled={approvingDeliverable === item._id || item.status === "APPROVED" || item.status === "COMPLETED"}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                              title="Approve request"
                            >
                              {approvingDeliverable === item._id ? "Processing..." : "Approve"}
                            </button>
                            <button
                              onClick={() => handleCancelDeliverable(item)}
                              disabled={approvingDeliverable === item._id || item.status === "CANCELLED" || item.status === "REJECTED"}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                              title="Cancel request"
                            >
                              {approvingDeliverable === item._id ? "Processing..." : "Cancel"}
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <td className="px-2 py-2">
                        {isProfessional ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={taskAssignmentValues[item._id] !== undefined 
                                ? taskAssignmentValues[item._id] 
                                : (item.assignedTo?._id || item.assignedTo || "")}
                              onChange={(e) => {
                                const selectedValue = e.target.value;
                                handleTaskAssignmentChange(item._id, selectedValue);
                              }}
                              className="border rounded px-2 py-1 text-sm flex-1 min-w-[150px]"
                              disabled={savingTask === item._id}
                            >
                              <option value="">Select User</option>
                              {assignableUsers.length > 0 ? (
                                assignableUsers.map((user) => (
                                  <option key={user._id} value={user._id}>
                                    {user.name} ({user.role})
                                  </option>
                                ))
                              ) : (
                                <option value="" disabled>Loading users...</option>
                              )}
                            </select>
                            <button
                              onClick={() => handleSaveTaskAssignment(item)}
                              disabled={savingTask === item._id || (taskAssignmentValues[item._id] === undefined && (item.assignedTo?._id || item.assignedTo || "") === "")}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                              title="Save assignment"
                            >
                              {savingTask === item._id ? "Saving..." : "Save"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs">
                            {item.assignedTo?.name || "Unassigned"}
                            {item.assignedTo?.role && (
                              <span className="text-gray-500 ml-1">({item.assignedTo.role})</span>
                            )}
                          </span>
                        )}
                      </td>
                    )}
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              (item.progress || 0) === 100 ? "bg-green-600" :
                              (item.progress || 0) >= 50 ? "bg-blue-600" :
                              (item.progress || 0) > 0 ? "bg-yellow-500" :
                              "bg-gray-300"
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, item.progress || 0))}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 w-10 text-right">
                          {item.progress || 0}%
                        </span>
                      </div>
                    </td>
                        <td className="px-2 py-2 text-center">
                          {isDeliverable && item.photo ? (
                            <img
                              src={item.photo}
                              alt="Deliverable"
                              className="w-10 h-10 object-cover rounded mx-auto"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">No Image</span>
                          )}
                        </td>
                      </tr>
                    );
                  });
                });
                
                return rows;
              })()
            ) : (
              // Deliverables Table (Read-only)
              filteredItems.map((d, index) => (
                <tr
                  key={d._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 py-2 text-center">{index + 1}</td>
                  <td className="px-2 py-2 truncate">{d.code || "-"}</td>
                  <td className="px-2 py-2 truncate">{d.category || "-"}</td>
                  <td className="px-2 py-2 truncate max-w-[200px]">
                    {d.description || "-"}
                  </td>
                  <td className="px-1 py-2 text-center">{d.unit || "-"}</td>
                  <td className="px-2 py-2 text-right">{d.qty || 0}</td>
                  <td className="px-2 py-2 text-right">
                    ₹{d.rate?.toLocaleString() || 0}
                  </td>
                  <td className="px-2 py-2 text-right">{d.gst || 0}%</td>
                  <td className="px-2 py-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      d.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                      d.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                      d.status === "ON_HOLD" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {d.status || "PENDING"}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <span className="text-xs">
                      {d.assignedTo?.name || "Unassigned"}
                      {d.assignedTo?.role && (
                        <span className="text-gray-500 ml-1">({d.assignedTo.role})</span>
                      )}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            (d.progress || 0) === 100 ? "bg-green-600" :
                            (d.progress || 0) >= 50 ? "bg-blue-600" :
                            (d.progress || 0) > 0 ? "bg-yellow-500" :
                            "bg-gray-300"
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, d.progress || 0))}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-10 text-right">
                        {d.progress || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center">
                    {d.photo ? (
                      <img
                        src={d.photo}
                        alt="Deliverable"
                        className="w-10 h-10 object-cover rounded mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filteredItems.length === 0 && !viewMode && (
          <div className="p-6 text-center text-gray-500">
            {viewMode === "tasks"
              ? "No tasks found. Create a new task to get started."
              : "No deliverables found. Items from signed quotations will appear here."}
          </div>
        )}
        {filteredItems.length === 0 && viewMode === "tasks" && (
          <div className="p-6 text-center text-gray-500">
            No tasks found. Create a new task to get started.
          </div>
        )}
        {filteredItems.length === 0 && viewMode === "deliverables" && (
          <div className="p-6 text-center text-gray-500">
            No deliverables found. Items from signed quotations will appear here.
          </div>
        )}
      </div>

      {/* Modals */}
      <TodoFilter
        show={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(filters) => {
          setFilteredItems(filters);
          setShowFilter(false);
        }}
      />

      <AddNewTodoModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onCreated={() => {
          if (viewMode === "tasks") {
            fetchTasks();
          } else {
            fetchDeliverables();
          }
        }}
        projectId={projectId}
      />
    </div>
  );
}

export default ProjectToDo;


// import React, { useState, useEffect } from "react";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { FiPlus, FiFilter } from "react-icons/fi";
// import Button from "../../../components/Button";
// import SearchBar from "../../../components/SearchBar";
// import DropDown from "../../../components/DropDown";
// import TodoFilter from "./TodoFilter";
// import AddNewTodoModal from "./AddNewTodoModal";
// import { toast } from "react-toastify";
// import {
//   getDeliverablesByQuoteId,
//   updateDeliverable,
//   deleteDeliverable,
// } from "../../../services/quoteServices";

// function ProjectToDo({ projectId, quoteId }) {
//   const [status, setStatus] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilter, setShowFilter] = useState(false);
//   const [deliverables, setDeliverables] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [actionMenuId, setActionMenuId] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({});

//   // ✅ Fetch deliverables from backend
//   const fetchDeliverables = async () => {
//     try {
//       if (!quoteId) {
//         console.warn("⚠️ Quote ID missing — cannot fetch deliverables");
//         return;
//       }

//       console.log("Fetching deliverables for quote:", quoteId);
//       const data = await getDeliverablesByQuoteId(quoteId);

//       if (!data || !Array.isArray(data.deliverables)) {
//         console.error("❌ Unexpected response format:", data);
//         toast.error("Invalid data format received from server");
//         return;
//       }

//       console.log("✅ Deliverables fetched:", data.deliverables);
//       setDeliverables(data.deliverables);
//       setFilteredItems(data.deliverables);
//     } catch (error) {
//       console.error("❌ Error fetching deliverables:", error);
//       toast.error("Failed to load deliverables");
//     }
//   };

//   useEffect(() => {
//     fetchDeliverables();
//   }, [quoteId]);

//   // ✅ Filter deliverables
//   useEffect(() => {
//     let filtered = deliverables;
//     if (searchTerm)
//       filtered = filtered.filter((item) =>
//         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     setFilteredItems(filtered);
//   }, [status, searchTerm, deliverables]);

//   // ✅ Edit / Save Deliverable
//   const handleEdit = (deliverable) => {
//     setEditingId(deliverable._id);
//     setEditData({ ...deliverable });
//     setActionMenuId(null);
//   };

//   const handleSave = async (deliverable) => {
//     try {
//       await updateDeliverable(
//         quoteId,
//         deliverable.spaceId,
//         deliverable._id,
//         editData
//       );
//       toast.success("Deliverable updated successfully");
//       setEditingId(null);
//       setEditData({});
//       fetchDeliverables();
//     } catch (error) {
//       console.error("❌ Error updating deliverable:", error);
//       toast.error("Failed to update deliverable");
//     }
//   };

//   // ✅ Delete Deliverable
//   const handleDelete = async (deliverable) => {
//     try {
//       await deleteDeliverable(quoteId, deliverable.spaceId, deliverable._id);
//       toast.success("Deliverable deleted successfully");
//       fetchDeliverables();
//       setActionMenuId(null);
//     } catch (error) {
//       console.error("❌ Error deleting deliverable:", error);
//       toast.error("Failed to delete deliverable");
//     }
//   };

//   return (
//     <div className="p-8 m-4 md:p-6 space-y-4 bg-white w-full rounded-xl">
//       {/* Filters */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
//           <div className="w-60">
//             <SearchBar
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search deliverables"
//             />
//           </div>
//           <Button
//             className="text-red-600 text-sm flex items-center gap-1 hover:bg-red-200 cursor-pointer bg-red-100"
//             onClick={() => setShowFilter(true)}
//           >
//             <FiFilter /> Filter
//           </Button>
//         </div>
//         <Button
//           className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2"
//           onClick={() => setIsModalOpen(true)}
//         >
//           <FiPlus /> New Deliverable
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto rounded-xl border border-gray-200">
//         <table className="min-w-full text-sm text-gray-700">
//           <thead className="bg-red-100 text-left">
//             <tr>
//               <th className="px-4 py-2">S.No</th>
//               <th className="px-4 py-2">Code</th>
//               <th className="px-4 py-2">Category</th>
//               <th className="px-4 py-2">Description</th>
//               <th className="px-4 py-2">Specification</th>
//               <th className="px-4 py-2">Unit</th>
//               <th className="px-4 py-2">Qty</th>
//               <th className="px-4 py-2">Rate</th>
//               <th className="px-4 py-2">GST</th>
//               <th className="px-4 py-2">Space</th>
//               <th className="px-4 py-2">Photo</th>
//               <th className="px-4 py-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredItems.map((d, index) => (
//               <tr key={d._id} className="border-t">
//                 <td className="px-4 py-3">{index + 1}</td>

//                 {/* Code */}
//                 <td className="px-4 py-3">{d.code || "-"}</td>

//                 {/* Category */}
//                 <td className="px-4 py-3">
//                   {editingId === d._id ? (
//                     <input
//                       type="text"
//                       value={editData.category || ""}
//                       onChange={(e) =>
//                         setEditData({ ...editData, category: e.target.value })
//                       }
//                       className="border rounded px-2 py-1 w-full"
//                     />
//                   ) : (
//                     d.category || "-"
//                   )}
//                 </td>

//                 {/* Description */}
//                 <td className="px-4 py-3 max-w-xs truncate">
//                   {editingId === d._id ? (
//                     <input
//                       type="text"
//                       value={editData.description || ""}
//                       onChange={(e) =>
//                         setEditData({
//                           ...editData,
//                           description: e.target.value,
//                         })
//                       }
//                       className="border rounded px-2 py-1 w-full"
//                     />
//                   ) : (
//                     d.description || "-"
//                   )}
//                 </td>

//                 {/* Spec */}
//                 <td className="px-4 py-3">{d.spec || "-"}</td>

//                 {/* Unit */}
//                 <td className="px-4 py-3">{d.unit || "-"}</td>

//                 {/* Qty */}
//                 <td className="px-4 py-3">{d.qty || 0}</td>

//                 {/* Rate */}
//                 <td className="px-4 py-3">₹{d.rate?.toLocaleString() || 0}</td>

//                 {/* GST */}
//                 <td className="px-4 py-3">{d.gst || 0}%</td>

//                 {/* Space */}
//                 <td className="px-4 py-3">{d.space || "-"}</td>

//                 {/* Photo */}
//                 <td className="px-4 py-3">
//                   {d.photo ? (
//                     <img
//                       src={d.photo}
//                       alt="deliverable"
//                       className="w-12 h-12 object-cover rounded"
//                     />
//                   ) : (
//                     "-"
//                   )}
//                 </td>

//                 {/* Actions */}
//                 <td className="px-4 py-3 relative">
//                   {editingId === d._id ? (
//                     <button
//                       className="text-green-600 hover:text-green-800"
//                       onClick={() => handleSave(d)}
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <>
//                       <button
//                         className="text-gray-500 hover:text-black"
//                         onClick={() =>
//                           setActionMenuId(
//                             actionMenuId === d._id ? null : d._id
//                           )
//                         }
//                       >
//                         <BsThreeDotsVertical />
//                       </button>
//                       {actionMenuId === d._id && (
//                         <div className="absolute right-0 mt-2 w-32 bg-white border shadow-md rounded-md z-10">
//                           <button
//                             className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                             onClick={() => handleEdit(d)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//                             onClick={() => handleDelete(d)}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {filteredItems.length === 0 && (
//           <div className="p-6 text-center text-gray-500">No deliverables found.</div>
//         )}
//       </div>

//       <TodoFilter
//         show={showFilter}
//         onClose={() => setShowFilter(false)}
//         onApply={(filters) => {
//           setFilteredItems(filters);
//           setShowFilter(false);
//         }}
//       />

//       <AddNewTodoModal
//         isOpen={isModalOpen}
//         setIsOpen={setIsModalOpen}
//         onCreated={fetchDeliverables}
//         projectId={projectId}
//       />
//     </div>
//   );
// }

// export default ProjectToDo;
