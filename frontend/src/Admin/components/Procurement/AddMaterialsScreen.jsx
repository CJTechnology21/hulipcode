import React, { useState } from "react";
import Layout from "../Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdClose } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import RFQInfoBanner from "./RFQBanner";
import MaterialLibraryDrawer from "./MaterialLibraryDrawer";
import Button from "../../../components/Button";
import { FaTrash } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import SuppliersModal from "./SuppliersModal";
import AddPartyModal from "./AddPartyModal";

export default function AddMaterialsScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { project, date, taxType, deliveryLocation } = location.state || {};

  const [biddingStartDate, setBiddingStartDate] = useState(null);
  const [biddingEndDate, setBiddingEndDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [modalField, setModalField] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [terms, setTerms] = useState("");
  const [supplier, setSupplier] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [isAddPartyModalOpen, setIsAddPartyModalOpen] = useState(false);

  const openModal = (field) => {
    setModalField(field);
    setTempDate(
      field === "bidding_start_date"
        ? biddingStartDate || new Date()
        : field === "bidding_end_date"
        ? biddingEndDate || new Date()
        : deliveryDate || new Date()
    );
  };

  const closeModal = () => setModalField(null);

  const handleSaveDate = () => {
    if (
      (modalField === "bidding_start_date" &&
        tempDate.toDateString() === biddingEndDate?.toDateString()) ||
      (modalField === "bidding_end_date" &&
        tempDate.toDateString() === biddingStartDate?.toDateString()) ||
      (modalField === "delivery_date" &&
        (tempDate.toDateString() === biddingStartDate?.toDateString() ||
          tempDate.toDateString() === biddingEndDate?.toDateString()))
    ) {
      toast.error("Bidding Start, End, and Delivery Date must be different!");
      return;
    }

    if (modalField === "bidding_start_date") setBiddingStartDate(tempDate);
    if (modalField === "bidding_end_date") setBiddingEndDate(tempDate);
    if (modalField === "delivery_date") {
      setDeliveryDate(tempDate);
      setSelectedMaterials((prev) =>
        prev.map((mat) => ({ ...mat, deliveryDate: tempDate }))
      );
    }

    closeModal();
  };

  const handleSaveDraft = () => {
    if (!biddingStartDate || !biddingEndDate || !deliveryDate || !supplier) {
      toast.error("Please fill all fields before saving the draft.");
      return;
    }

    const draftData = {
      project,
      date,
      taxType,
      deliveryLocation,
      biddingStartDate,
      biddingEndDate,
      deliveryDate,
      materials: selectedMaterials,
      terms,
      supplier,
      createdAt: new Date().toISOString(),
      status: "draft",
    };

    const existingDrafts = JSON.parse(localStorage.getItem("rfqDrafts") || "[]");
    existingDrafts.push(draftData);
    localStorage.setItem("rfqDrafts", JSON.stringify(existingDrafts));

    toast.success("Draft saved successfully!");
    navigate("/procurement");
  };

  return (
    <Layout title="NEW RFQ">
      <ToastContainer />
      <div className="p-6 bg-gray-100 min-h-screen space-y-6">
        <RFQInfoBanner
          biddingStartDate={biddingStartDate}
          biddingEndDate={biddingEndDate}
          deliveryDate={deliveryDate}
          openModal={openModal}
          onClose={() => {}}
          rfqNo="#12–16"
          rfqDate="24–07–2025"
          deliveryLocation={deliveryLocation}
        />

        {/* Materials Table */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
          <div className="grid grid-cols-5 text-xs font-semibold text-gray-600 uppercase bg-gray-100 px-6 py-2 rounded-t-lg">
            <span>S.No.</span>
            <span>Item</span>
            <span>HSN Code</span>
            <span>Quantity</span>
            <span>Delivery Date</span>
          </div>

          <div className="divide-y divide-gray-200">
            {selectedMaterials.length > 0 ? (
              selectedMaterials.map((material, idx) => (
                <div
                  key={material._id}
                  className="grid grid-cols-5 gap-4 px-6 py-5 items-center"
                >
                  <div className="text-gray-700">{idx + 1}</div>
                  <div className="text-gray-800 font-medium">
                    {material.name}
                  </div>
                  <div className="text-gray-500">{material.hsn || "--"}</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
                      value={material.quantity}
                      onChange={(e) => {
                        const updated = [...selectedMaterials];
                        updated[idx].quantity = e.target.value;
                        setSelectedMaterials(updated);
                      }}
                    />
                    <span className="text-gray-500 text-xs">
                      {material.unit || "pcs"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DatePicker
                      selected={
                        material.deliveryDate
                          ? new Date(material.deliveryDate)
                          : null
                      }
                      onChange={(date) => {
                        const updated = [...selectedMaterials];
                        updated[idx].deliveryDate = date;
                        setSelectedMaterials(updated);
                      }}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="dd-MM-yyyy"
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    />
                    <Button
                      onClick={() =>
                        setSelectedMaterials((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                      variant="outline"
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={18} />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-center text-gray-500 py-4">
                No materials added.
              </div>
            )}

            <div className="grid grid-cols-5 items-center px-6 py-4 text-sm text-red-600 font-medium bg-gray-50 border-t border-gray-200">
              <span>—</span>
              <Button
                variant="outlined"
                color="red"
                borderStyle="dashed"
                size="sm"
              >
                Material Request ({selectedMaterials.length})
              </Button>
              <span>—</span>
              <Button
                variant="outlined"
                color="red"
                size="sm"
                borderStyle="dashed"
                onClick={() => setIsDrawerOpen(true)}
              >
                + Add Material
              </Button>
              <span>—</span>
            </div>
          </div>
        </div>

        <MaterialLibraryDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          selectedMaterials={selectedMaterials}
          setSelectedMaterials={setSelectedMaterials}
        />

        {/* Terms and Supplier Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              TERMS AND CONDITIONS
            </label>
            <textarea
              rows="4"
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </div>

          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm relative">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              SELECT SUPPLIER
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
              <input
                type="text"
                readOnly
                onClick={() => setSupplierModalOpen(true)}
                value={supplier ? supplier.name : ""}
                placeholder="Select Supplier..."
                className="flex-grow text-sm bg-white outline-none cursor-pointer"
              />
              <button
                onClick={() => setSupplierModalOpen(true)}
                className="ml-2 border border-gray-300 p-2 rounded-full hover:border-gray-400"
              >
                <FiSearch className="text-gray-600" />
              </button>
            </div>

            <SuppliersModal
              isOpen={supplierModalOpen}
              onClose={() => setSupplierModalOpen(false)}
              onSelect={(selected) => {
                setSupplier(selected);
                setSupplierModalOpen(false);
              }}
              onCreateParty={() => {
                setSupplierModalOpen(false);
                setIsAddPartyModalOpen(true);
              }}
            />

            <AddPartyModal
              isOpen={isAddPartyModalOpen}
              onClose={() => setIsAddPartyModalOpen(false)}
              onSave={(newSupplier) => {
                setSupplier(newSupplier);
                setIsAddPartyModalOpen(false);
              }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button color="red" variant="outlined" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button
            color="red"
            variant="custom"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Save & Publish
          </Button>
        </div>

        {/* Date Picker Modal */}
        {modalField && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold capitalize">
                  {modalField.replaceAll("_", " ")} Date
                </h3>
                <MdClose
                  className="text-red-500 text-xl cursor-pointer"
                  onClick={closeModal}
                />
              </div>
              <DatePicker
                selected={tempDate}
                onChange={(date) => setTempDate(date)}
                inline
                dateFormat="dd/MM/yyyy"
              />
              <Button
                fullWidth
                color="red"
                className="mt-4"
                onClick={handleSaveDate}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// import React, { useState } from "react";
// import Layout from "../Layout";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { MdClose } from "react-icons/md";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useLocation } from "react-router-dom";
// import RFQInfoBanner from "./RFQBanner";
// import MaterialLibraryDrawer from "./MaterialLibraryDrawer";
// import Button from "../../../components/Button";
// import { FaTrash } from "react-icons/fa";
// import { FiSearch } from "react-icons/fi";
// import SuppliersModal from "./SuppliersModal";
// import AddPartyModal from "./AddPartyModal";

// export default function AddMaterialsScreen() {
//   const location = useLocation();
//   const { project, date, taxType, deliveryLocation } = location.state || {};

//   const [biddingStartDate, setBiddingStartDate] = useState(null);
//   const [biddingEndDate, setBiddingEndDate] = useState(null);
//   const [deliveryDate, setDeliveryDate] = useState(null);
//   const [modalField, setModalField] = useState(null);
//   const [tempDate, setTempDate] = useState(new Date());
//   const [terms, setTerms] = useState("");
//   const [supplier, setSupplier] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [selectedMaterials, setSelectedMaterials] = useState([]);
//   const [supplierModalOpen, setSupplierModalOpen] = useState(false);
//   const [isAddPartyModalOpen, setIsAddPartyModalOpen] = useState(false);

//   const openModal = (field) => {
//     setModalField(field);
//     setTempDate(
//       field === "bidding_start_date"
//         ? biddingStartDate || new Date()
//         : field === "bidding_end_date"
//         ? biddingEndDate || new Date()
//         : deliveryDate || new Date()
//     );
//   };

//   const closeModal = () => setModalField(null);

//   const handleSaveDate = () => {
//     if (
//       (modalField === "bidding_start_date" &&
//         tempDate.toDateString() === biddingEndDate?.toDateString()) ||
//       (modalField === "bidding_end_date" &&
//         tempDate.toDateString() === biddingStartDate?.toDateString()) ||
//       (modalField === "delivery_date" &&
//         (tempDate.toDateString() === biddingStartDate?.toDateString() ||
//           tempDate.toDateString() === biddingEndDate?.toDateString()))
//     ) {
//       toast.error("Bidding Start, End, and Delivery Date must be different!");
//       return;
//     }

//     if (modalField === "bidding_start_date") setBiddingStartDate(tempDate);
//     if (modalField === "bidding_end_date") setBiddingEndDate(tempDate);
//     if (modalField === "delivery_date") {
//       setDeliveryDate(tempDate);
//       setSelectedMaterials((prev) =>
//         prev.map((mat) => ({ ...mat, deliveryDate: tempDate }))
//       );
//     }

//     closeModal();
//   };

//   return (
//     <Layout title="NEW RFQ">
//       <ToastContainer />
//       <div className="p-6 bg-gray-100 min-h-screen space-y-6">
//         <RFQInfoBanner
//           biddingStartDate={biddingStartDate}
//           biddingEndDate={biddingEndDate}
//           deliveryDate={deliveryDate}
//           openModal={openModal}
//           onClose={() => {}}
//           rfqNo="#12–16"
//           rfqDate="24–07–2025"
//           deliveryLocation={deliveryLocation}
//         />

//         {/* Materials Table */}
//         <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
//           <div className="grid grid-cols-5 text-xs font-semibold text-gray-600 uppercase bg-gray-100 px-6 py-2 rounded-t-lg">
//             <span>S.No.</span>
//             <span>Item</span>
//             <span>HSN Code</span>
//             <span>Quantity</span>
//             <span>Delivery Date</span>
//           </div>

//           <div className="divide-y divide-gray-200">
//             {selectedMaterials.length > 0 ? (
//               selectedMaterials.map((material, idx) => (
//                 <div
//                   key={material._id}
//                   className="grid grid-cols-5 gap-4 px-6 py-5 items-center"
//                 >
//                   <div className="text-gray-700">{idx + 1}</div>
//                   <div className="text-gray-800 font-medium">
//                     {material.name}
//                   </div>
//                   <div className="text-gray-500">{material.hsn || "--"}</div>
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="number"
//                       placeholder="Qty"
//                       className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
//                       value={material.quantity}
//                       onChange={(e) => {
//                         const updated = [...selectedMaterials];
//                         updated[idx].quantity = e.target.value;
//                         setSelectedMaterials(updated);
//                       }}
//                     />
//                     <span className="text-gray-500 text-xs">
//                       {material.unit || "pcs"}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <DatePicker
//                       selected={
//                         material.deliveryDate
//                           ? new Date(material.deliveryDate)
//                           : null
//                       }
//                       onChange={(date) => {
//                         const updated = [...selectedMaterials];
//                         updated[idx].deliveryDate = date;
//                         setSelectedMaterials(updated);
//                       }}
//                       dateFormat="dd/MM/yyyy"
//                       placeholderText="dd-MM-yyyy"
//                       className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
//                     />
//                     <Button
//                       onClick={() =>
//                         setSelectedMaterials((prev) =>
//                           prev.filter((_, i) => i !== idx)
//                         )
//                       }
//                       variant="outline"
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <FaTrash size={18} />
//                     </Button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-sm text-center text-gray-500 py-4">
//                 No materials added.
//               </div>
//             )}

//             <div className="grid grid-cols-5 items-center px-6 py-4 text-sm text-red-600 font-medium bg-gray-50 border-t border-gray-200">
//               <span>—</span>
//               <Button
//                 variant="outlined"
//                 color="red"
//                 borderStyle="dashed"
//                 size="sm"
//               >
//                 Material Request ({selectedMaterials.length})
//               </Button>
//               <span>—</span>
//               <Button
//                 variant="outlined"
//                 color="red"
//                 size="sm"
//                 borderStyle="dashed"
//                 onClick={() => setIsDrawerOpen(true)}
//               >
//                 + Add Material
//               </Button>
//               <span>—</span>
//             </div>
//           </div>
//         </div>

//         <MaterialLibraryDrawer
//           isOpen={isDrawerOpen}
//           onClose={() => setIsDrawerOpen(false)}
//           selectedMaterials={selectedMaterials}
//           setSelectedMaterials={setSelectedMaterials}
//         />

//         {/* Terms and Search Supplier */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
//             <label className="text-sm font-semibold text-gray-700 mb-1 block">
//               TERMS AND CONDITIONS
//             </label>
//             <textarea
//               rows="4"
//               className="w-full border border-gray-300 rounded-md p-2 text-sm"
//               value={terms}
//               onChange={(e) => setTerms(e.target.value)}
//             />
//           </div>

//           <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm relative">
//             <label className="text-sm font-semibold text-gray-700 mb-1 block">
//               SELECT SUPPLIER
//             </label>
//             <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
//               <input
//                 type="text"
//                 readOnly
//                 onClick={() => setSupplierModalOpen(true)}
//                 value={supplier ? supplier.name : ""}
//                 placeholder="Select Supplier..."
//                 className="flex-grow text-sm bg-white outline-none cursor-pointer"
//               />
//               <button
//                 onClick={() => setSupplierModalOpen(true)}
//                 className="ml-2 border border-gray-300 p-2 rounded-full hover:border-gray-400"
//               >
//                 <FiSearch className="text-gray-600" />
//               </button>
//             </div>

//             <SuppliersModal
//               isOpen={supplierModalOpen}
//               onClose={() => setSupplierModalOpen(false)}
//               onSelect={(selected) => {
//                 setSupplier(selected);
//                 setSupplierModalOpen(false);
//               }}
//               onCreateParty={() => {
//                 setSupplierModalOpen(false);
//                 setIsAddPartyModalOpen(true);
//               }}
//             />

//             <AddPartyModal
//               isOpen={isAddPartyModalOpen}
//               onClose={() => setIsAddPartyModalOpen(false)}
//               onSave={(newSupplier) => {
//                 setSupplier(newSupplier);
//                 setIsAddPartyModalOpen(false);
//               }}
//             />
//           </div>
//         </div>

//         <div className="flex justify-end gap-4">
//           <Button color="red" variant="outlined">
//             Save Draft
//           </Button>
//           <Button
//             color="red"
//             variant="custom"
//             className="bg-red-600 hover:bg-red-700 text-white"
//           >
//             Save & Publish
//           </Button>
//         </div>

//         {modalField && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold capitalize">
//                   {modalField.replaceAll("_", " ")} Date
//                 </h3>
//                 <MdClose
//                   className="text-red-500 text-xl cursor-pointer"
//                   onClick={closeModal}
//                 />
//               </div>
//               <DatePicker
//                 selected={tempDate}
//                 onChange={(date) => setTempDate(date)}
//                 inline
//                 dateFormat="dd/MM/yyyy"
//               />
//               <Button
//                 fullWidth
//                 color="red"
//                 className="mt-4"
//                 onClick={handleSaveDate}
//               >
//                 Save
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// }
