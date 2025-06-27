import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import SideBar from "../SideBar";
import Header from "../Header";

const defaultMilestones = [
  "Electrical - Conducting",
  "Fire and Smoke Work",
  "Snag Completion",
];

const defaultTasks = [
  {
    id: 1,
    taskName: "Inspect site",
    dueDate: "2025-02-15",
    status: "Created",
    priority: "Medium",
    assignedTo: "Amrita",
  },
  {
    id: 2,
    taskName: "Order materials",
    dueDate: "2025-02-20",
    status: "Started",
    priority: "High",
    assignedTo: "Vivek Rai",
  },
];

function ProjectManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Milestone states
  const [searchMilestone, setSearchMilestone] = useState("");
  const [milestones, setMilestones] = useState(
    defaultMilestones.map((name) => ({
      name,
      progress: 0,
      startDate: "2025-02-03",
      endDate: "2025-02-14",
      assignedTo: "",
      clientVisible: false,
      lastUpdate: "",
    }))
  );

  // Task states
  const [activeTab, setActiveTab] = useState("milestones");
  const [tasks, setTasks] = useState(defaultTasks);
  const [taskSearch, setTaskSearch] = useState("");
  const [taskFilterPriority, setTaskFilterPriority] = useState("");
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [isMilestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    taskName: "",
    dueDate: "",
    status: "Created",
    priority: "Low",
    assignedTo: "",
  });
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);

  // Filtering
  const filteredMilestones = milestones.filter((m) =>
    m.name.toLowerCase().includes(searchMilestone.toLowerCase())
  );
  const filteredTasks = tasks.filter((task) => {
    return (
      task.taskName.toLowerCase().includes(taskSearch.toLowerCase()) &&
      (!taskFilterPriority || task.priority === taskFilterPriority)
    );
  });

  // Update functions
  const updateMilestone = (i, key, value) => {
    const arr = [...milestones];
    arr[i][key] = value;
    setMilestones(arr);
  };
  const updateTask = (id, key, value) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, [key]: value } : t)));
  };

  // Add new entries
  const addMilestone = () => {
    if (!newMilestoneName.trim()) return;
    setMilestones([
      ...milestones,
      {
        name: newMilestoneName.trim(),
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        clientVisible: false,
        lastUpdate: "",
      },
    ]);
    setNewMilestoneName("");
    setMilestoneModalOpen(false);
  };
  const addTask = () => {
    if (!newTask.taskName.trim()) return;
    const taskEntry = { id: Date.now(), ...newTask };
    setTasks([...tasks, taskEntry]);
    setNewTask({
      taskName: "",
      dueDate: "",
      status: "Created",
      priority: "Low",
      assignedTo: "",
    });
    setTaskModalOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <SideBar />
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Project Management"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-4 sm:p-6 bg-white m-4 rounded-xl shadow overflow-auto">
          {/* Tab Buttons */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Project Planning</h2>
  

            {/* Tabs */}
            <div className="border-b border-gray-300 mb-4">
              <nav className="flex space-x-6">
                <button
                  onClick={() => setActiveTab("milestones")}
                  className={`pb-2 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === "milestones"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-blue-600"
                  }`}
                >
                  Milestones
                </button>
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`pb-2 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === "tasks"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-blue-600"
                  }`}
                >
                  Tasks
                </button>
              </nav>
            </div>
          </div>

          {/* Milestones Tab */}
          {activeTab === "milestones" && (
            <>
              <div className="flex mb-4 gap-2">
                <input
                  type="text"
                  placeholder="Search milestones..."
                  value={searchMilestone}
                  onChange={(e) => setSearchMilestone(e.target.value)}
                  className="border rounded px-3 py-2 flex-1 sm:w-64"
                />
                <button
                  onClick={() => setMilestoneModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                  Add Milestone
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border rounded-lg">
                  <thead className="bg-gray-50 uppercase text-gray-600">
                    <tr>
                      <th className="p-3">
                        <input type="checkbox" />
                      </th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Progress</th>
                      <th className="p-3">Start</th>
                      <th className="p-3">End</th>
                      <th className="p-3">Assigned To</th>
                      <th className="p-3">Client Visible</th>
                      <th className="p-3">Last Update</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMilestones.map((m, i) => (
                      <tr
                        key={i}
                        className={`border-t ${
                          i % 2 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="p-3">
                          <input type="checkbox" />
                        </td>
                        <td className="p-3">{m.name}</td>
                        <td className="p-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={m.progress}
                            onChange={(e) =>
                              updateMilestone(i, "progress", +e.target.value)
                            }
                            className="w-24 sm:w-32 inline-block"
                          />
                          <span className="ml-2">{m.progress}%</span>
                        </td>
                        <td className="p-3">
                          <input
                            type="date"
                            value={m.startDate}
                            onChange={(e) =>
                              updateMilestone(i, "startDate", e.target.value)
                            }
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="date"
                            value={m.endDate}
                            onChange={(e) =>
                              updateMilestone(i, "endDate", e.target.value)
                            }
                          />
                        </td>
                        <td className="p-3">
                          <select
                            value={m.assignedTo}
                            onChange={(e) =>
                              updateMilestone(i, "assignedTo", e.target.value)
                            }
                          >
                            <option value="">Select User</option>
                            <option>Amrita</option>
                            <option>Vivek Rai</option>
                          </select>
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={m.clientVisible}
                            onChange={(e) =>
                              updateMilestone(
                                i,
                                "clientVisible",
                                e.target.checked
                              )
                            }
                          />
                        </td>
                        <td className="p-3">
                          <textarea
                            value={m.lastUpdate}
                            placeholder="Optional..."
                            onChange={(e) =>
                              updateMilestone(i, "lastUpdate", e.target.value)
                            }
                          />
                        </td>
                        <td className="p-3">
                          <FaEllipsisV />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                  className="border rounded px-3 py-2 flex-1 sm:w-64"
                />
                <select
                  value={taskFilterPriority}
                  onChange={(e) => setTaskFilterPriority(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button
                  onClick={() => setTaskModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                  Add Task
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border rounded-lg">
                  <thead className="bg-gray-50 uppercase text-gray-600">
                    <tr>
                      <th className="p-3">Task Name</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Assigned To</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => (
                      <tr key={task.id} className="border-t">
                        <td className="p-3">{task.taskName}</td>
                        <td className="p-3">
                          <input
                            type="date"
                            value={task.dueDate}
                            onChange={(e) =>
                              updateTask(task.id, "dueDate", e.target.value)
                            }
                          />
                        </td>
                        <td className="p-3">
                          <select
                            value={task.status}
                            onChange={(e) =>
                              updateTask(task.id, "status", e.target.value)
                            }
                          >
                            <option>Created</option>
                            <option>Visited</option>
                            <option>Started</option>
                            <option>Completed</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <select
                            value={task.priority}
                            onChange={(e) =>
                              updateTask(task.id, "priority", e.target.value)
                            }
                          >
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <input
                            value={task.assignedTo}
                            placeholder="Assignee"
                            onChange={(e) =>
                              updateTask(task.id, "assignedTo", e.target.value)
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="p-3">
                          <FaEllipsisV />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Milestone Modal */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h3 className="font-semibold mb-4">New Milestone</h3>
            <input
              value={newMilestoneName}
              onChange={(e) => setNewMilestoneName(e.target.value)}
              placeholder="Name"
              className="border rounded px-3 py-2 w-full mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMilestoneModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={addMilestone}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h3 className="font-semibold mb-4">New Task</h3>
            <input
              placeholder="Task name"
              value={newTask.taskName}
              onChange={(e) =>
                setNewTask({ ...newTask, taskName: e.target.value })
              }
              className="border rounded px-3 py-2 w-full mb-3"
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              className="border rounded px-3 py-2 w-full mb-3"
            />
            <select
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value })
              }
              className="border rounded px-3 py-2 w-full mb-3"
            >
              <option>Created</option>
              <option>Visited</option>
              <option>Started</option>
              <option>Completed</option>
            </select>
            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
              className="border rounded px-3 py-2 w-full mb-3"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <input
              placeholder="Assigned To"
              value={newTask.assignedTo}
              onChange={(e) =>
                setNewTask({ ...newTask, assignedTo: e.target.value })
              }
              className="border rounded px-3 py-2 w-full mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setTaskModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectManagement;

// import { useState } from "react";
// import { FaEllipsisV } from "react-icons/fa";
// import SideBar from "../SideBar";
// import Header from "../Header";

// const defaultMilestones = [
//   "Electrical - Conducting",
//   "Fire and Smoke Work",
//   "Snag Completion",
// ];

// const defaultTasks = [
//   {
//     taskName: "Material to be ordered for wood work",
//     dueDate: "2025-02-12",
//     status: "Created",
//     priority: "Low",
//     assignedTo: "Amrita",
//   },
//   {
//     taskName: "Follow Up - Aman (+91 9958974674)",
//     dueDate: "2025-02-28",
//     status: "Created",
//     priority: "Low",
//     assignedTo: "Vivek Rai",
//   },
// ];

// function ProjectManagement() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [milestones, setMilestones] = useState(
//     defaultMilestones.map((name) => ({
//       name,
//       progress: 0,
//       startDate: "2025-02-03",
//       endDate: "2025-02-14",
//       assignedTo: "",
//       clientVisible: false,
//       lastUpdate: "",
//     }))
//   );

//   const [activeTab, setActiveTab] = useState("Milestones");

//   const [tasks, setTasks] = useState(defaultTasks);
//   const [taskModalOpen, setTaskModalOpen] = useState(false);
//   const [newTask, setNewTask] = useState({
//     taskName: "",
//     dueDate: "",
//     status: "Created",
//     priority: "Low",
//     assignedTo: "",
//   });

//   const [taskSearch, setTaskSearch] = useState("");
//   const [taskFilterPriority, setTaskFilterPriority] = useState("");
//   const [taskFilterUser, setTaskFilterUser] = useState("");

//   const updateMilestone = (i, key, value) => {
//     const arr = [...milestones];
//     arr[i][key] = value;
//     setMilestones(arr);
//   };

//   const updateTask = (i, key, value) => {
//     const updated = tasks.map((t) =>
//       t.id === id ? { ...t, [key]: value } : t
//     );
//     setTasks(updated);
//   };

//   const addTask = () => {
//     if (!newTask.taskName.trim()) return;
//     setTasks([...tasks, newTask]);
//     setNewTask({
//       taskName: "",
//       dueDate: "",
//       status: "Created",
//       priority: "Low",
//       assignedTo: "",
//     });
//     setTaskModalOpen(false);
//   };

//   const filteredMilestones = milestones.filter((m) =>
//     m.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
//   );

//   const filteredTasks = tasks.filter((task) => {
//     return (
//       task.taskName.toLowerCase().includes(taskSearch.toLowerCase()) &&
//       (!taskFilterPriority || task.priority === taskFilterPriority) &&
//       (!taskFilterUser || task.assignedTo === taskFilterUser)
//     );
//   });

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:block`}
//       >
//         <SideBar />
//       </div>

//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Project Management"
//           toggleSidebar={() => setSidebarOpen((p) => !p)}
//         />

//         <div className="p-4 sm:p-6 bg-white m-4 rounded-xl shadow overflow-auto">
//           {/* Tabs */}
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold mb-2">Project Planning</h2>
//             <div className="flex gap-4 border-b">
//               {["Milestones", "Tasks"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`py-2 px-4 border-b-2 transition-colors duration-200 ${
//                     activeTab === tab
//                       ? "border-blue-500 text-blue-600 font-semibold"
//                       : "border-transparent text-gray-600"
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Milestones Tab */}
//           {activeTab === "Milestones" && (
//             <>
//               <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
//                 <input
//                   type="text"
//                   placeholder="Search milestones..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="border rounded px-3 py-2 w-full sm:w-64"
//                 />
//                 {/* <button
//                   onClick={() => setModalOpen(true)}
//                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
//                 >
//                   Add Milestones
//                 </button> */}
//               </div>

//               {/* Milestone Table */}
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm text-left border border-gray-200 rounded">
//                   <thead className="bg-gray-50 text-gray-600 uppercase">
//                     <tr>
//                       <th className="p-3">
//                         <input type="checkbox" />
//                       </th>
//                       <th className="p-3">Milestone</th>
//                       <th className="p-3">Progress</th>
//                       <th className="p-3">Start Date</th>
//                       <th className="p-3">End Date</th>
//                       <th className="p-3">Assigned To</th>
//                       <th className="p-3">Client Visible</th>
//                       <th className="p-3">Last Update</th>
//                       <th className="p-3">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredMilestones.map((m, idx) => (
//                       <tr
//                         key={idx}
//                         className={`border-t ${
//                           idx % 2 ? "bg-gray-50" : "bg-white"
//                         }`}
//                       >
//                         <td className="p-3">
//                           <input type="checkbox" />
//                         </td>
//                         <td className="p-3">{m.name}</td>
//                         <td className="p-3">
//                           <input
//                             type="range"
//                             min="0"
//                             max="100"
//                             value={m.progress}
//                             onChange={(e) =>
//                               updateMilestone(idx, "progress", +e.target.value)
//                             }
//                           />
//                           <span className="ml-2">{m.progress}%</span>
//                         </td>
//                         <td className="p-3">
//                           <input
//                             type="date"
//                             value={m.startDate}
//                             onChange={(e) =>
//                               updateMilestone(idx, "startDate", e.target.value)
//                             }
//                             className="border rounded px-2 py-1 w-full"
//                           />
//                         </td>
//                         <td className="p-3">
//                           <input
//                             type="date"
//                             value={m.endDate}
//                             onChange={(e) =>
//                               updateMilestone(idx, "endDate", e.target.value)
//                             }
//                             className="border rounded px-2 py-1 w-full"
//                           />
//                         </td>
//                         <td className="p-3">
//                           <select
//                             value={m.assignedTo}
//                             onChange={(e) =>
//                               updateMilestone(idx, "assignedTo", e.target.value)
//                             }
//                             className="border rounded px-2 py-1 w-full"
//                           >
//                             <option value="">Select Users</option>
//                             <option>Amrita</option>
//                             <option>Vivek Rai</option>
//                           </select>
//                         </td>
//                         <td className="p-3 text-center">
//                           <input
//                             type="checkbox"
//                             checked={m.clientVisible}
//                             onChange={(e) =>
//                               updateMilestone(
//                                 idx,
//                                 "clientVisible",
//                                 e.target.checked
//                               )
//                             }
//                           />
//                         </td>
//                         <td className="p-3">
//                           <textarea
//                             value={m.lastUpdate}
//                             onChange={(e) =>
//                               updateMilestone(idx, "lastUpdate", e.target.value)
//                             }
//                             className="border rounded px-2 py-1 w-full"
//                           />
//                         </td>
//                         <td className="p-3 text-gray-500">
//                           <FaEllipsisV />
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}

//           {/* Tasks Tab */}
//           {activeTab === "Tasks" && (
//             <>
//               <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
//                 <input
//                   type="text"
//                   placeholder="Search tasks..."
//                   value={taskSearch}
//                   onChange={(e) => setTaskSearch(e.target.value)}
//                   className="border rounded px-3 py-2 w-full md:w-64"
//                 />
//                 <select
//                   className="border rounded px-3 py-2"
//                   value={taskFilterPriority}
//                   onChange={(e) => setTaskFilterPriority(e.target.value)}
//                 >
//                   <option value="">All Priorities</option>
//                   <option value="Low">Low</option>
//                   <option value="Medium">Medium</option>
//                   <option value="High">High</option>
//                 </select>
//                 <select
//                   className="border rounded px-3 py-2"
//                   value={taskFilterUser}
//                   onChange={(e) => setTaskFilterUser(e.target.value)}
//                 >
//                   <option value="">All Users</option>
//                   <option>Amrita</option>
//                   <option>Vivek Rai</option>
//                 </select>
//                 <button
//                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//                   onClick={() => setTaskModalOpen(true)}
//                 >
//                   Add Task
//                 </button>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm text-left border border-gray-200 rounded">
//                   <thead className="bg-gray-50 text-gray-600 uppercase">
//                     <tr>
//                       <th className="p-3">Task Name</th>
//                       <th className="p-3">Due Date</th>
//                       <th className="p-3">Status</th>
//                       <th className="p-3">Priority</th>
//                       <th className="p-3">Assigned To</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredTasks.map((task, idx) => (
//                       <tr
//                         key={idx}
//                         className={`border-t ${
//                           idx % 2 ? "bg-gray-50" : "bg-white"
//                         }`}
//                       >
//                         <td className="p-3">{task.taskName}</td>
//                         <td className="p-3">{task.dueDate}</td>
//                         {/* <td className="p-3">{task.status}</td> */}
//                         <td className="p-3">
//                           <select
//                             className="border rounded px-2 py-1 w-full"
//                             value={task.status}
//                             onChange={(e) =>
//                               updateTask(task.id, "status", e.target.value)
//                             }
//                           >
//                             <option value="Created">Created</option>
//                             <option value="Visited">Visited</option>
//                             <option value="Started">Started</option>
//                             <option value="Completed">Completed</option>
//                           </select>
//                         </td>

//                         <td className="p-3">
//                           <select
//                             value={task.priority}
//                             onChange={(e) =>
//                               updateTask(idx, "priority", e.target.value)
//                             }
//                             className="border rounded px-2 py-1"
//                           >
//                             <option>Low</option>
//                             <option>Medium</option>
//                             <option>High</option>
//                           </select>
//                         </td>
//                         <td className="p-3">{task.assignedTo}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Add Task Modal */}
//       {taskModalOpen && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
//             <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
//             <input
//               type="text"
//               placeholder="Task name"
//               value={newTask.taskName}
//               onChange={(e) =>
//                 setNewTask({ ...newTask, taskName: e.target.value })
//               }
//               className="border rounded px-3 py-2 w-full mb-3"
//             />
//             <input
//               type="date"
//               value={newTask.dueDate}
//               onChange={(e) =>
//                 setNewTask({ ...newTask, dueDate: e.target.value })
//               }
//               className="border rounded px-3 py-2 w-full mb-3"
//             />
//             <select
//               value={newTask.priority}
//               onChange={(e) =>
//                 setNewTask({ ...newTask, priority: e.target.value })
//               }
//               className="border rounded px-3 py-2 w-full mb-3"
//             >
//               <option>Low</option>
//               <option>Medium</option>
//               <option>High</option>
//             </select>
//             <input
//               type="text"
//               placeholder="Assigned to"
//               value={newTask.assignedTo}
//               onChange={(e) =>
//                 setNewTask({ ...newTask, assignedTo: e.target.value })
//               }
//               className="border rounded px-3 py-2 w-full mb-3"
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setTaskModalOpen(false)}
//                 className="border px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={addTask}
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//               >
//                 Add
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ProjectManagement;
