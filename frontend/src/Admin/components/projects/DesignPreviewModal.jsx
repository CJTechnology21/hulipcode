import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { FiX } from "react-icons/fi";

function DesignPreviewModal({ isOpen, onClose, data, type = "2d" }) {
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    if (data?.versions?.length) {
      setSelectedVersion(data.versions[0]);
    }
  }, [data]);

  if (!data || !selectedVersion) return null;

  // Helper: get image URLs (duplicate if only one)
  const getImages = () => {
    const img = selectedVersion.image;
    return [img, data.versions.length === 1 ? img : selectedVersion.image];
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
                  Design &gt; {type === "2d" ? "2D Layout" : "3D Render"} &gt; {data.name}
                </div>
                <div className="flex items-center gap-3">
                  <FaPlusCircle className="cursor-pointer text-xl" />
                  <FaMinusCircle className="cursor-pointer text-xl" />
                  <button className="bg-green-500 text-white text-sm px-3 py-1 rounded">Approve</button>
                  <button className="text-red-600 font-bold text-sm">Reject</button>
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
                      onClick={() => setSelectedVersion(v)}
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
                <div className="flex-1 p-6 bg-gray-100 flex gap-4 justify-center items-center">
                  {getImages().map((imgSrc, idx) => (
                    <div
                      key={idx}
                      className="w-1/2 h-[70vh] bg-white border rounded-lg shadow-sm p-2 flex items-center justify-center overflow-hidden"
                    >
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={`Version-${selectedVersion.label}-${idx}`}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <p className="text-gray-500 text-sm">No image</p>
                      )}
                    </div>
                  ))}
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
// import { FiX } from "react-icons/fi";

// function DesignPreviewModal({ isOpen, onClose, data, type = "2d" }) {
//   const [selectedVersion, setSelectedVersion] = useState(null);

//   useEffect(() => {
//     if (data?.versions?.length) {
//       setSelectedVersion(data.versions[0]); // Select latest (first) version
//     }
//   }, [data]);

//   if (!data) return null;

//   return (
//     <Transition show={isOpen} as={Fragment}>
//       <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
//         <div className="flex items-center justify-center min-h-screen bg-black/50 px-4">
//           <Transition.Child as={Fragment} enter="ease-out duration-300" leave="ease-in duration-200">
//             <Dialog.Panel className="relative w-full max-w-6xl bg-white rounded-lg overflow-hidden">
//               {/* Header */}
//               <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
//                 <div className="text-sm font-semibold">
//                   Design &gt; {type === "2d" ? "2D Layout" : "3D Render"} &gt; {data.name}
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <FaPlusCircle className="cursor-pointer text-xl" />
//                   <FaMinusCircle className="cursor-pointer text-xl" />
//                   <button className="bg-green-500 text-white text-sm px-3 py-1 rounded">Approve</button>
//                   <button className="text-red-600 font-bold text-sm">Reject</button>
//                   <FiX onClick={onClose} className="cursor-pointer text-xl" />
//                 </div>
//               </div>

//               {/* Body */}
//               <div className="flex">
//                 {/* Version Sidebar */}
//                 <div className="w-[60px] bg-white border-r flex flex-col gap-2 p-3">
//                   {data.versions.map((v, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setSelectedVersion(v)}
//                       className={`text-xs font-bold px-2 py-1 rounded-md ${
//                         selectedVersion?.label === v.label
//                           ? "bg-red-600 text-white"
//                           : "bg-gray-200 text-black"
//                       }`}
//                     >
//                       {v.label}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Image Viewer */}
//                 <div className="flex-1 p-4 flex items-center justify-center bg-gray-100">
//                   {selectedVersion?.image ? (
//                     <img
//                       src={selectedVersion.image}
//                       alt={selectedVersion.label}
//                       className="max-w-full max-h-[75vh] object-contain"
//                     />
//                   ) : (
//                     <p className="text-gray-500">No image available</p>
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
