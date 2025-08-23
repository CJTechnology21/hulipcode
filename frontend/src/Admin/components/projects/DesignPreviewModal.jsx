import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { FiDownload, FiMessageSquare, FiShare2, FiX } from "react-icons/fi";
import Button from "../../../components/Button";
import { useAuth } from "../../../context/AuthContext";
import {
  fetchCommentsByProject,
  addComment,
  updateLayout,
} from "../../../services/twoDServices";
import { formatDateTime } from "../../../utils/dateFormatter";
import { toast } from "react-toastify";

function DesignPreviewModal({ isOpen, onClose, data, type = "2d", projectId }) {
  const { user } = useAuth();
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (data?.versions?.length) {
      setSelectedVersion(data.versions[0]);
      setZoomLevel(1);
    }
  }, [data]);

  // Fetch comments when drawer opens
  useEffect(() => {
    if (showComments && projectId) {
      loadComments();
    }
    // eslint-disable-next-line
  }, [showComments, projectId]);

  const loadComments = async () => {
    try {
      setLoadingComments(true);
      const fetched = await fetchCommentsByProject(projectId);
      setComments(fetched);
    } catch (err) {
      console.error("Error fetching comments:", err);
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    if (!user) {
      toast.warning("You must be logged in to add a comment.");
      return;
    }

    try {
      setSubmitting(true);
      // ✅ pass layoutId = data._id
      const created = await addComment(data._id, newComment);
      setComments((prev) => [created, ...prev]);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!data?._id) return;
    try {
      setUpdatingStatus(true);
      const updated = await updateLayout(data._id, { status });
      data.status = updated.status; // update local copy
      toast.success(`Design ${status}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!data || !selectedVersion) return null;

  const isPDF = (url) => url?.toLowerCase().endsWith(".pdf");

  const getFile = () => {
    if (!selectedVersion) return null;
    return selectedVersion.file || selectedVersion.image;
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    link.click();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen bg-black/50 px-2 sm:px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            leave="ease-in duration-200"
          >
            <Dialog.Panel className="relative w-full max-w-full sm:max-w-6xl bg-white rounded-lg overflow-hidden">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-3 border-b bg-gray-50 gap-2 sm:gap-0">
                <div className="text-sm font-semibold">
                  Design &gt; {type === "2d" ? "2D Layout" : "3D Render"} &gt;{" "}
                  {data.name}
                  {data.status && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700">
                      {data.status}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <FaPlusCircle
                    className="cursor-pointer text-xl"
                    onClick={handleZoomIn}
                  />
                  <FaMinusCircle
                    className="cursor-pointer text-xl"
                    onClick={handleZoomOut}
                  />
                  <Button
                    className="bg-green-500 text-white text-sm px-3 py-1 rounded"
                    variant="custom"
                    disabled={updatingStatus || data.status === "Approved"} // ✅ disable if already approved
                    onClick={() => handleStatusUpdate("Approved")}
                  >
                    {updatingStatus && data.status !== "Approved"
                      ? "Updating..."
                      : "Approve"}
                  </Button>

                  <Button
                    className="text-red-600 font-bold text-sm"
                    variant="custom"
                    disabled={updatingStatus || data.status === "Rejected"} // ✅ disable if already rejected
                    onClick={() => handleStatusUpdate("Rejected")}
                  >
                    {updatingStatus && data.status !== "Rejected"
                      ? "Updating..."
                      : "Reject"}
                  </Button>

                  <FiDownload
                    className="cursor-pointer text-lg"
                    title="Download"
                    onClick={() => handleDownload(getFile())}
                  />
                  <FiMessageSquare
                    className={`cursor-pointer text-lg ${
                      showComments ? "text-red-500" : ""
                    }`}
                    title="Comments"
                    onClick={() => setShowComments(!showComments)}
                  />
                  <FiShare2 className="cursor-pointer text-lg" title="Share" />
                  <FiX onClick={onClose} className="cursor-pointer text-xl" />
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col sm:flex-row">
                {/* Version Sidebar */}
                <div className="w-full sm:w-[60px] bg-white border-r flex sm:flex-col flex-row gap-2 p-2 sm:p-3 overflow-x-auto sm:overflow-x-visible">
                  {data.versions.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedVersion(v);
                        setZoomLevel(1);
                      }}
                      className={`text-xs font-bold px-2 py-1 rounded-md flex-shrink-0 ${
                        selectedVersion?.label === v.label
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>

                {/* File Container */}
                <div className="flex-1 p-4 sm:p-6 bg-gray-100 flex justify-center items-center relative">
                  <div className="w-full sm:w-2/3 h-[60vh] sm:h-[70vh] bg-white border rounded-lg shadow-sm p-2 flex items-center justify-center overflow-hidden">
                    {(() => {
                      const fileSrc = getFile();
                      if (!fileSrc)
                        return <p className="text-gray-500 text-sm">No file</p>;

                      return isPDF(fileSrc) ? (
                        <embed
                          src={fileSrc}
                          type="application/pdf"
                          className="w-full h-full"
                        />
                      ) : (
                        <img
                          src={fileSrc}
                          alt={`Version-${selectedVersion.label}`}
                          className="max-h-full max-w-full object-contain transition-transform duration-300"
                          style={{ transform: `scale(${zoomLevel})` }}
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      );
                    })()}
                  </div>

                  {/* Comments Drawer */}
                  {showComments && (
                    <div className="absolute top-0 right-0 w-full sm:w-[300px] h-full bg-white border-l shadow-lg flex flex-col z-10">
                      <div className="p-3 border-b font-semibold text-sm flex justify-between items-center">
                        Comments
                        <button
                          onClick={() => setShowComments(false)}
                          className="text-gray-600 hover:text-black"
                        >
                          ×
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-3">
                        {loadingComments ? (
                          <p className="text-gray-500 text-xs">
                            Loading comments...
                          </p>
                        ) : comments.length === 0 ? (
                          <p className="text-gray-500 text-xs">
                            No comments yet.
                          </p>
                        ) : (
                          comments.map((comment, idx) => (
                            <div
                              key={idx}
                              className="mb-4 flex items-start gap-3"
                            >
                              <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                                {comment.author?.name
                                  ? comment.author.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                  : "U"}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold">
                                    {comment.author?.name ?? "Unknown"}
                                  </span>
                                  <span className="text-xs text-red-700">
                                    {formatDateTime(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                  {comment.text}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-3 border-t">
                        {user ? (
                          <>
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add comment..."
                              className="w-full border rounded p-2 text-xs"
                              rows={2}
                            />
                            <Button
                              onClick={handleAddComment}
                              disabled={submitting}
                              className="w-full mt-2 bg-red-500 text-white hover:bg-red-600 cursor-pointer text-xs py-1"
                              variant="custom"
                            >
                              {submitting ? "Submitting..." : "Submit"}
                            </Button>
                          </>
                        ) : (
                          <p className="text-xs text-gray-500 text-center">
                            Please log in to add comments.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default DesignPreviewModal;

// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment, useEffect, useState } from "react";
// import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
// import { FiDownload, FiMessageSquare, FiShare2, FiX } from "react-icons/fi";
// import Button from "../../../components/Button";
// import { useAuth } from "../../../context/AuthContext";
// import { fetchCommentsByProject, addComment } from "../../../services/twoDServices";
// import { formatDateTime } from "../../../utils/dateFormatter";

// function DesignPreviewModal({ isOpen, onClose, data, type = "2d", projectId }) {
//   const { user, loading: authLoading } = useAuth();
//   const [selectedVersion, setSelectedVersion] = useState(null);
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [showComments, setShowComments] = useState(false);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     if (data?.versions?.length) {
//       setSelectedVersion(data.versions[0]);
//       setZoomLevel(1);
//     }
//   }, [data]);

//   // Fetch comments when drawer opens
//   useEffect(() => {
//     if (showComments && projectId) {
//       loadComments();
//     }
//     // eslint-disable-next-line
//   }, [showComments, projectId]);

//   const loadComments = async () => {
//     try {
//       setLoadingComments(true);
//       const fetched = await fetchCommentsByProject(projectId);
//       setComments(fetched);
//     } catch (err) {
//       console.error("Error fetching comments:", err);
//     } finally {
//       setLoadingComments(false);
//     }
//   };

//   const handleAddComment = async () => {
//     if (!newComment.trim()) return;

//     if (!user) {
//       alert("You must be logged in to add a comment.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       // ✅ pass layoutId = data._id
//       const created = await addComment(data._id, newComment);
//       setComments((prev) => [created, ...prev]);
//       setNewComment("");
//     } catch (err) {
//       console.error("Error adding comment:", err);
//       alert("Failed to add comment.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!data || !selectedVersion) return null;

//   const isPDF = (url) => url?.toLowerCase().endsWith(".pdf");

//   const getFile = () => {
//     if (!selectedVersion) return null;
//     return selectedVersion.file || selectedVersion.image;
//   };

//   const handleZoomIn = () => {
//     setZoomLevel((prev) => Math.min(prev + 0.2, 3));
//   };

//   const handleZoomOut = () => {
//     setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
//   };

//   const handleDownload = (url) => {
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = url.split("/").pop();
//     link.click();
//   };

//   return (
//     <Transition show={isOpen} as={Fragment}>
//       <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
//         <div className="flex items-center justify-center min-h-screen bg-black/50 px-2 sm:px-4">
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             leave="ease-in duration-200"
//           >
//             <Dialog.Panel className="relative w-full max-w-full sm:max-w-6xl bg-white rounded-lg overflow-hidden">
//               {/* Header */}
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-3 border-b bg-gray-50 gap-2 sm:gap-0">
//                 <div className="text-sm font-semibold">
//                   Design &gt; {type === "2d" ? "2D Layout" : "3D Render"} &gt; {data.name}
//                 </div>
//                 <div className="flex flex-wrap items-center gap-2 sm:gap-3">
//                   <FaPlusCircle className="cursor-pointer text-xl" onClick={handleZoomIn} />
//                   <FaMinusCircle className="cursor-pointer text-xl" onClick={handleZoomOut} />
//                   <Button className="bg-green-500 text-white text-sm px-3 py-1 rounded" variant="custom">
//                     Approve
//                   </Button>
//                   <Button className="text-red-600 font-bold text-sm" variant="custom">
//                     Reject
//                   </Button>
//                   <FiDownload
//                     className="cursor-pointer text-lg"
//                     title="Download"
//                     onClick={() => handleDownload(getFile())}
//                   />
//                   <FiMessageSquare
//                     className={`cursor-pointer text-lg ${showComments ? "text-red-500" : ""}`}
//                     title="Comments"
//                     onClick={() => setShowComments(!showComments)}
//                   />
//                   <FiShare2 className="cursor-pointer text-lg" title="Share" />
//                   <FiX onClick={onClose} className="cursor-pointer text-xl" />
//                 </div>
//               </div>

//               {/* Body */}
//               <div className="flex flex-col sm:flex-row">
//                 {/* Version Sidebar */}
//                 <div className="w-full sm:w-[60px] bg-white border-r flex sm:flex-col flex-row gap-2 p-2 sm:p-3 overflow-x-auto sm:overflow-x-visible">
//                   {data.versions.map((v, i) => (
//                     <button
//                       key={i}
//                       onClick={() => {
//                         setSelectedVersion(v);
//                         setZoomLevel(1);
//                       }}
//                       className={`text-xs font-bold px-2 py-1 rounded-md flex-shrink-0 ${
//                         selectedVersion?.label === v.label
//                           ? "bg-red-600 text-white"
//                           : "bg-gray-200 text-black"
//                       }`}
//                     >
//                       {v.label}
//                     </button>
//                   ))}
//                 </div>

//                 {/* File Container */}
//                 <div className="flex-1 p-4 sm:p-6 bg-gray-100 flex justify-center items-center relative">
//                   <div className="w-full sm:w-2/3 h-[60vh] sm:h-[70vh] bg-white border rounded-lg shadow-sm p-2 flex items-center justify-center overflow-hidden">
//                     {(() => {
//                       const fileSrc = getFile();
//                       if (!fileSrc) return <p className="text-gray-500 text-sm">No file</p>;

//                       return isPDF(fileSrc) ? (
//                         <embed src={fileSrc} type="application/pdf" className="w-full h-full" />
//                       ) : (
//                         <img
//                           src={fileSrc}
//                           alt={`Version-${selectedVersion.label}`}
//                           className="max-h-full max-w-full object-contain transition-transform duration-300"
//                           style={{ transform: `scale(${zoomLevel})` }}
//                           onError={(e) => (e.target.style.display = "none")}
//                         />
//                       );
//                     })()}
//                   </div>

//                   {/* Comments Drawer */}
//                   {showComments && (
//                     <div className="absolute top-0 right-0 w-full sm:w-[300px] h-full bg-white border-l shadow-lg flex flex-col z-10">
//                       <div className="p-3 border-b font-semibold text-sm flex justify-between items-center">
//                         Comments
//                         <button
//                           onClick={() => setShowComments(false)}
//                           className="text-gray-600 hover:text-black"
//                         >
//                           ×
//                         </button>
//                       </div>

//                       <div className="flex-1 overflow-y-auto p-3">
//                         {loadingComments ? (
//                           <p className="text-gray-500 text-xs">Loading comments...</p>
//                         ) : comments.length === 0 ? (
//                           <p className="text-gray-500 text-xs">No comments yet.</p>
//                         ) : (
//                           comments.map((comment, idx) => (
//                             <div key={idx} className="mb-4 flex items-start gap-3">
//                               <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold uppercase">
//                                 {comment.author?.name
//                                   ? comment.author.name
//                                       .split(" ")
//                                       .map((n) => n[0])
//                                       .join("")
//                                   : "U"}
//                               </div>
//                               <div>
//                                 <div className="flex items-center gap-2">
//                                   <span className="text-sm font-semibold">
//                                     {comment.author?.name ?? "Unknown"}
//                                   </span>
//                                   <span className="text-xs text-red-700">
//                                     {formatDateTime(comment.createdAt)}
//                                   </span>
//                                 </div>
//                                 <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
//                               </div>
//                             </div>
//                           ))
//                         )}
//                       </div>

//                       <div className="p-3 border-t">
//                         {user ? (
//                           <>
//                             <textarea
//                               value={newComment}
//                               onChange={(e) => setNewComment(e.target.value)}
//                               placeholder="Add comment..."
//                               className="w-full border rounded p-2 text-xs"
//                               rows={2}
//                             />
//                             <Button
//                               onClick={handleAddComment}
//                               disabled={submitting}
//                               className="w-full mt-2 bg-red-500 text-white hover:bg-red-600 cursor-pointer text-xs py-1"
//                               variant="custom"
//                             >
//                               {submitting ? "Submitting..." : "Submit"}
//                             </Button>
//                           </>
//                         ) : (
//                           <p className="text-xs text-gray-500 text-center">
//                             Please log in to add comments.
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </Dialog.Panel>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }

// export default DesignPreviewModal;
