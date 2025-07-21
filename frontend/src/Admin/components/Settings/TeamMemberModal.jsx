import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import TaskTimelineModal from "./TaskTimeLineModal";

export default function TeamMemberModal({ isOpen, onClose, member }) {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design Entrance",
      status: "In Progress",
      progress: 60,
      history: [
        { date: "2025-07-01", status: "Assigned" },
        { date: "2025-07-04", status: "In Progress" },
      ],
    },
    {
      id: 2,
      title: "Meeting with Client",
      status: "Pending",
      progress: 30,
      history: [
        { date: "2025-07-02", status: "Assigned" },
        { date: "2025-07-05", status: "Pending" },
      ],
    },
  ]);

  const [newTask, setNewTask] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hey, have you reviewed the design?", sender: "other" },
    { text: "Yes, almost done!", sender: "self" },
  ]);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: newTask,
        status: "Pending",
        progress: 0,
        history: [{ date: new Date().toISOString().slice(0, 10), status: "Assigned" }],
      },
    ]);
    setNewTask("");
  };

  const handleRemoveTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, { text: chatInput, sender: "self" }]);
    setChatInput("");
  };

  const statusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all flex gap-6 relative">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>

                  {/* Left - Tasks */}
                  <div className="w-1/2 border-r pr-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Assigned Tasks</h2>
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="border p-3 rounded-lg shadow-sm bg-gray-50 cursor-pointer relative"
                          onClick={() => setSelectedTask(task)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{task.title}</p>
                              <span
                                className={`text-xs px-2 py-1 mt-1 inline-block rounded ${statusColor(task.status)}`}
                              >
                                {task.status}
                              </span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTask(task.id);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="w-full mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-green-500 h-2"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="New Task"
                        className="flex-1 border px-3 py-2 rounded text-sm"
                      />
                      <button
                        onClick={handleAddTask}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-1"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Right - Chat */}
                  <div className="w-1/2 pl-6 flex flex-col">
                    <h2 className="text-xl font-bold mb-4">Communication</h2>
                    <div className="flex-1 overflow-y-auto border rounded p-3 space-y-2 bg-gray-50 max-h-[380px]">
                      {messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`text-sm p-2 rounded max-w-[80%] ${
                            msg.sender === "self"
                              ? "bg-green-100 self-end text-right"
                              : "bg-blue-100 self-start"
                          }`}
                        >
                          {msg.text}
                        </div>
                      ))}
                    </div>
                    <form
                      onSubmit={handleSendMessage}
                      className="mt-3 flex gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border px-3 py-2 rounded text-sm"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Timeline Modal */}
      {selectedTask && (
        <TaskTimelineModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
        />
      )}
    </>
  );
}

// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment, useState } from "react";
// import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

// export default function TeamMemberModal({ isOpen, onClose, member }) {
//   const [tasks, setTasks] = useState([
//     {
//       id: 1,
//       title: "Design Entrance",
//       status: "In Progress",
//       progress: 60,
//     },
//     {
//       id: 2,
//       title: "Meeting with Client",
//       status: "Pending",
//       progress: 30,
//     },
//   ]);

//   const [newTask, setNewTask] = useState("");
//   const [messages, setMessages] = useState([
//     { text: "Hey, have you reviewed the design?", sender: "other" },
//     { text: "Yes, almost done!", sender: "self" },
//   ]);
//   const [chatInput, setChatInput] = useState("");

//   const handleAddTask = () => {
//     if (!newTask.trim()) return;
//     setTasks([
//       ...tasks,
//       {
//         id: Date.now(),
//         title: newTask,
//         status: "Pending",
//         progress: 0,
//       },
//     ]);
//     setNewTask("");
//   };

//   const handleRemoveTask = (id) => {
//     setTasks(tasks.filter((task) => task.id !== id));
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!chatInput.trim()) return;
//     setMessages([...messages, { text: chatInput, sender: "self" }]);
//     setChatInput("");
//   };

//   const statusColor = (status) => {
//     switch (status) {
//       case "In Progress":
//         return "bg-green-100 text-green-700";
//       case "Pending":
//         return "bg-yellow-100 text-yellow-700";
//       case "Completed":
//         return "bg-blue-100 text-blue-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all flex gap-6">
//                 {/* Close Button */}
//                 <button
//                   onClick={onClose}
//                   className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
//                 >
//                   <XMarkIcon className="w-6 h-6" />
//                 </button>

//                 {/* Left Side - Tasks */}
//                 <div className="w-1/2 border-r pr-6 flex flex-col">
//                   <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-bold">Assigned Tasks</h2>
//                   </div>

//                   <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
//                     {tasks.map((task) => (
//                       <div key={task.id} className="border p-3 rounded-lg shadow-sm relative bg-gray-50">
//                         <div className="flex justify-between items-center mb-1">
//                           <span className="font-medium">{task.title}</span>
//                           <span className={`text-xs px-2 py-1 rounded ${statusColor(task.status)}`}>
//                             {task.status}
//                           </span>
//                         </div>
//                         <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
//                           <div
//                             className="bg-green-500 h-2"
//                             style={{ width: `${task.progress}%` }}
//                           ></div>
//                         </div>
//                         <button
//                           onClick={() => handleRemoveTask(task.id)}
//                           className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                         >
//                           <TrashIcon className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-4 flex gap-2">
//                     <input
//                       type="text"
//                       value={newTask}
//                       onChange={(e) => setNewTask(e.target.value)}
//                       placeholder="New Task"
//                       className="flex-1 border px-3 py-2 rounded text-sm"
//                     />
//                     <button
//                       onClick={handleAddTask}
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-1"
//                     >
//                       <PlusIcon className="w-4 h-4" />
//                       Add
//                     </button>
//                   </div>
//                 </div>

//                 {/* Right Side - Communication */}
//                 <div className="w-1/2 pl-6 flex flex-col">
//                   <h2 className="text-xl font-bold mb-4">Communication</h2>
//                   <div className="flex-1 overflow-y-auto border rounded p-3 space-y-2 bg-gray-50 max-h-[380px]">
//                     {messages.map((msg, idx) => (
//                       <div
//                         key={idx}
//                         className={`text-sm p-2 rounded max-w-[80%] ${
//                           msg.sender === "self"
//                             ? "bg-green-100 self-end text-right"
//                             : "bg-blue-100 self-start"
//                         }`}
//                       >
//                         {msg.text}
//                       </div>
//                     ))}
//                   </div>
//                   <form
//                     onSubmit={handleSendMessage}
//                     className="mt-3 flex gap-2 items-center"
//                   >
//                     <input
//                       type="text"
//                       value={chatInput}
//                       onChange={(e) => setChatInput(e.target.value)}
//                       placeholder="Type a message..."
//                       className="flex-1 border px-3 py-2 rounded text-sm"
//                     />
//                     <button
//                       type="submit"
//                       className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
//                     >
//                       Send
//                     </button>
//                   </form>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }
