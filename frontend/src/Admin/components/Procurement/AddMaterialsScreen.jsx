import React, { useState } from "react";
import Layout from "../Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdClose } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import RFQInfoBanner from "./RFQBanner";
import MaterialLibraryDrawer from "./MaterialLibraryDrawer";
// Custom UI Components
import Button from "../../../components/Button";
import Input from "../../../components/Input";

export default function AddMaterialsScreen() {
  const location = useLocation();
  const { project, date, taxType, deliveryLocation } = location.state || {};

  const [biddingStartDate, setBiddingStartDate] = useState(null);
  const [biddingEndDate, setBiddingEndDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [modalField, setModalField] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [terms, setTerms] = useState("");
  const [supplier, setSupplier] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    if (modalField === "delivery_date") setDeliveryDate(tempDate);
    closeModal();
  };

  return (
    <Layout title="NEW RFQ">
      <ToastContainer />
      <div className="p-6 bg-gray-100 min-h-screen space-y-6">
        {/* Reusable Info Banner */}
        <RFQInfoBanner
          biddingStartDate={biddingStartDate}
          biddingEndDate={biddingEndDate}
          deliveryDate={deliveryDate}
          openModal={openModal}
          onClose={() => console.log("Closed")}
          rfqNo="#12–16"
          rfqDate="24–07–2025"
          deliveryLocation={deliveryLocation}
        />

        {/* Material Request Table */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
          <div className="grid grid-cols-5 text-xs font-semibold text-gray-600 uppercase bg-gray-100 px-6 py-2 rounded-t-lg">
            <span>S.No.</span>
            <span>Item</span>
            <span>HSN Code</span>
            <span>Quantity</span>
            <span>Delivery Date</span>
          </div>
          <div className="grid grid-cols-5 items-center px-6 py-4 text-sm text-center text-red-600 font-medium">
            <span>—</span>
            <Button
              variant="outlined"
              color="red"
              borderStyle="dashed"
              size="sm"
            >
              Material Request (0)
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

        {/* Drawer */}
        <MaterialLibraryDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />

        {/* Terms and Supplier */}
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
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              SELECT SUPPLIER
            </label>
            <div className="relative">
              <Input
                type="text"
                name="supplier"
                placeholder="Search supplier..."
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-4.35-4.35M9 17a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4">
          <Button color="red" variant="outlined">
            Save Draft
          </Button>
          <Button
            color="red"
            variant="custom"
            className="bg-red-600 hover:bg-red-700 cursor-pointer text-white"
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
