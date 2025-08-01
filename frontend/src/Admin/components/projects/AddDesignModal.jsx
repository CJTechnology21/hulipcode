import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
 function AddDesignModal({ isOpen, onClose, onAdd }) {
  const [file, setFile] = useState(null);
  const [area, setArea] = useState("");
  const [assigned, setAssigned] = useState("");
  const [status, setStatus] = useState("Draft");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = () => {
    if (!file) return;

    const fileType = file.name.toLowerCase().endsWith(".pdf")
      ? "PDF"
      : "Image";

    const newEntry = {
      sno: Date.now(), // Replace with ID logic later
      name: file.name,
      area,
      fileTypes: [fileType],
      versions: ["V1"],
      assigned: {
        name: assigned || "Ravi",
        color: "bg-yellow-400",
      },
      uploaded: new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      status,
      previewUrl: fileType === "Image" ? URL.createObjectURL(file) : null,
    };

    onAdd(newEntry);
    setFile(null);
    setArea("");
    setAssigned("");
    setStatus("Draft");
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="bg-white rounded-md max-w-lg w-full z-50 p-6 shadow-lg space-y-4">
              <Dialog.Title className="text-lg font-bold text-gray-800">Upload New File</Dialog.Title>

              <input type="file" accept=".pdf,image/*" onChange={handleFileChange} className="block w-full text-sm" />

              {file && file.type.startsWith("image") && (
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-40 object-cover rounded border" />
              )}

              <input
                type="text"
                placeholder="Area"
                className="border rounded w-full px-3 py-2 text-sm"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />

              <input
                type="text"
                placeholder="Assigned to"
                className="border rounded w-full px-3 py-2 text-sm"
                value={assigned}
                onChange={(e) => setAssigned(e.target.value)}
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded w-full px-3 py-2 text-sm"
              >
                <option>Approved</option>
                <option>Rejected</option>
                <option>Draft</option>
                <option>Review</option>
              </select>

              <div className="flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-1 text-sm rounded border">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-1 text-sm rounded bg-red-600 text-white">Add File</button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default AddDesignModal;