import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { FiUpload, FiX, FiSave } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function CreateNewTransactionModal({ open, onClose, onCreate }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);

  const [newTransaction, setNewTransaction] = useState({
    name: "",
    detail: "",
    amount: "",
    site: "",
    date: "",
    type: "Payment In", 
  });

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    const supported = files.filter((file) =>
      ["image/png", "image/jpeg", "application/pdf"].includes(file.type)
    );

    if (supported.length) {
      setUploading(true);
      await new Promise((res) => setTimeout(res, 1000));
      setUploadedDocs((prev) => [...prev, ...supported]);
      setUploading(false);
      toast.success("Files uploaded successfully");
    } else {
      toast.error("Unsupported file type");
    }
  };

  const handleSubmit = () => {
    if (
      !newTransaction.name ||
      !newTransaction.amount ||
      !newTransaction.date ||
      !newTransaction.site
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    onCreate({
      ...newTransaction,
      amount: `₹ ${newTransaction.amount}`,
      status: "-",
      uploadedDocs,
    });

    toast.success("Transaction created");
    onClose();
    setNewTransaction({
      name: "",
      detail: "",
      amount: "",
      site: "",
      date: "",
      type: "Payment In",
    });
    setUploadedDocs([]);
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-y-0 right-0 flex max-w-full">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="w-screen max-w-md bg-white shadow-xl overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b-4 border-red-600">
                <Dialog.Title className="text-lg font-semibold text-red-600">
                  Create New Transaction
                </Dialog.Title>
                <FiX
                  className="text-xl cursor-pointer hover:text-red-600"
                  onClick={onClose}
                />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 text-sm">
                {/* Fields */}
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Transaction Type</p>
                    <select
                      value={newTransaction.type}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          type: e.target.value,
                        })
                      }
                      className="w-full border rounded p-1 text-sm"
                    >
                      <option>Payment In</option>
                      <option>Payment Out</option>
                    </select>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Party Name</p>
                    <input
                      type="text"
                      value={newTransaction.name}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, name: e.target.value })
                      }
                      className="w-full border rounded p-1 text-sm"
                      placeholder="e.g., Vijay Stores"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Details</p>
                    <input
                      type="text"
                      value={newTransaction.detail}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, detail: e.target.value })
                      }
                      className="w-full border rounded p-1 text-sm"
                      placeholder="e.g., Jk Hardware"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <input
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, amount: e.target.value })
                      }
                      className="w-full border rounded p-1 text-sm"
                      placeholder="e.g., 20000"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Site</p>
                    <input
                      type="text"
                      value={newTransaction.site}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, site: e.target.value })
                      }
                      className="w-full border rounded p-1 text-sm"
                      placeholder="e.g., Radhika Pitampura"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Date & Time</p>
                    <input
                      type="datetime-local"
                      value={newTransaction.date}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, date: e.target.value })
                      }
                      className="w-full border rounded p-1 text-sm"
                    />
                  </div>
                </div>

                {/* Upload Section */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      Supporting Documents
                    </p>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center gap-1 text-sm px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                      disabled={uploading}
                    >
                      <FiUpload size={16} />
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                    />
                  </div>

                  {uploading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ClipLoader size={18} color="#dc2626" />
                      Uploading files...
                    </div>
                  ) : uploadedDocs.length > 0 ? (
                    <ul className="space-y-2">
                      {uploadedDocs.map((file, idx) => (
                        <li
                          key={idx}
                          className="border rounded px-3 py-2 text-sm flex justify-between items-center"
                        >
                          <span className="truncate w-40">{file.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400">
                      No supporting documents uploaded.
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full mt-6 flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded"
                >
                  <FiSave />
                  Save Transaction
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CreateNewTransactionModal;