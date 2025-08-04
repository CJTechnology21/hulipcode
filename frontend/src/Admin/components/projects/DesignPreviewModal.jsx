import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { FiDownload, FiMessageSquare, FiShare2, FiX } from "react-icons/fi";
import Button from "../../../components/Button";

function DesignPreviewModal({ isOpen, onClose, data, type = "2d" }) {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [zoomLevels, setZoomLevels] = useState([1, 1]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Comments panel
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Example current user (replace with your auth user)
  const currentUser = { name: "John Doe" };

  useEffect(() => {
    if (data?.versions?.length) {
      setSelectedVersion(data.versions[0]);
      setZoomLevels([1, 1]);
      setSelectedImageIndex(0);
    }
  }, [data]);

  if (!data || !selectedVersion) return null;

  const getImages = () => {
    const img = selectedVersion.image;
    return [img, data.versions.length === 1 ? img : selectedVersion.image];
  };

  const handleZoomIn = () => {
    setZoomLevels((prev) =>
      prev.map((z, i) => (i === selectedImageIndex ? Math.min(z + 0.2, 3) : z))
    );
  };

  const handleZoomOut = () => {
    setZoomLevels((prev) =>
      prev.map((z, i) =>
        i === selectedImageIndex ? Math.max(z - 0.2, 0.5) : z
      )
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newEntry = {
      user: currentUser,
      text: newComment,
      date: new Date().toLocaleString(),
    };
    setComments((prev) => [newEntry, ...prev]);
    setNewComment("");
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen bg-black/50 px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            leave="ease-in duration-200"
          >
            <Dialog.Panel className="relative w-full max-w-6xl bg-white rounded-lg overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                <div className="text-sm font-semibold">
                  Design &gt; {type === "2d" ? "2D Layout" : "3D Render"} &gt;{" "}
                  {data.name}
                </div>
                <div className="flex items-center gap-3">
                  <FaPlusCircle className="cursor-pointer text-xl" onClick={handleZoomIn} />
                  <FaMinusCircle className="cursor-pointer text-xl" onClick={handleZoomOut} />
                  <Button className="bg-green-500 text-white text-sm px-3 py-1 rounded" variant="custom">
                    Approve
                  </Button>
                  <Button className="text-red-600 font-bold text-sm" variant="custom">
                    Reject
                  </Button>
                  <FiDownload className="cursor-pointer text-lg" title="Download" />
                  <FiMessageSquare 
                    className={`cursor-pointer text-lg ${showComments ? 'text-red-500' : ''}`} 
                    title="Comments"
                    onClick={() => setShowComments(!showComments)}
                  />
                  <FiShare2 className="cursor-pointer text-lg" title="Share" />
                  <FiX onClick={onClose} className="cursor-pointer text-xl" />
                </div>
              </div>

              {/* Body */}
              <div className="flex">
                {/* Version Sidebar */}
                <div className="w-[60px] bg-white border-r flex flex-col gap-2 p-3">
                  {data.versions.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedVersion(v);
                        setZoomLevels([1, 1]);
                        setSelectedImageIndex(0);
                      }}
                      className={`text-xs font-bold px-2 py-1 rounded-md ${
                        selectedVersion?.label === v.label
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>

                {/* Image Containers */}
                <div className="flex-1 p-6 bg-gray-100 flex gap-4 justify-center items-center relative">
                  {getImages().map((imgSrc, idx) => (
                    <div
                      key={idx}
                      className={`w-1/2 h-[70vh] bg-white border rounded-lg shadow-sm p-2 flex items-center justify-center overflow-hidden cursor-pointer ${
                        selectedImageIndex === idx ? "ring-2 ring-red-500" : ""
                      }`}
                      onClick={() => setSelectedImageIndex(idx)}
                    >
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={`Version-${selectedVersion.label}-${idx}`}
                          className="max-h-full max-w-full object-contain transition-transform duration-300"
                          style={{ transform: `scale(${zoomLevels[idx]})` }}
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <p className="text-gray-500 text-sm">No image</p>
                      )}
                    </div>
                  ))}

                  {/* Comments Drawer */}
                  {showComments && (
                    <div className="absolute top-0 right-0 w-[300px] h-full bg-white border-l shadow-lg flex flex-col">
                      <div className="p-3 border-b font-semibold text-sm flex justify-between items-center">
                        Comments
                        <button onClick={() => setShowComments(false)} className="text-gray-600 hover:text-black">×</button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-3">
                        {comments.length === 0 ? (
                          <p className="text-gray-500 text-xs">No comments yet.</p>
                        ) : (
                          comments.map((comment, idx) => (
                            <div key={idx} className="mb-4 flex items-start gap-3">
                              {/* Avatar */}
                              <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                                {comment.user?.name
                                  ? comment.user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                  : "U"}
                              </div>

                              {/* Comment content */}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold">
                                    {comment.user?.name ?? "Unknown"}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {comment.date}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-3 border-t">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add comment..."
                          className="w-full border rounded p-2 text-xs"
                          rows={2}
                        />
                        <Button
                          onClick={handleAddComment}
                          className="w-full mt-2 bg-red-500 text-white hover:bg-red-600 cursor-pointer text-xs py-1"
                          variant="custom"
                        >
                          Submit
                        </Button>
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
