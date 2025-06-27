
import { useState } from "react";
import Header from "../Header";
import SideBar from "../SideBar";

const designAreas = ["Bedroom", "Toilet", "Living Room"];
const sectionOptions = ["Interior", "Painting", "Tilework", "Floorwork"];

function QuoteForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    designArea: "",
    section: [],
    image: null,
    taskDetails: "",
    qty: "",
    unit: "",
    rate: "",
    discount: "",
    gst: "",
    amount: "",
  });

  const [showSectionDropdown, setShowSectionDropdown] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };

    if (["qty", "rate", "discount", "gst"].includes(name)) {
      const qty = parseFloat(updatedForm.qty) || 0;
      const rate = parseFloat(updatedForm.rate) || 0;
      const discount = parseFloat(updatedForm.discount) || 0;
      const gst = parseFloat(updatedForm.gst) || 0;

      const base = qty * rate;
      const discounted = base - discount;
      const gstAmount = (discounted * gst) / 100;
      updatedForm.amount = (discounted + gstAmount).toFixed(2);
    }

    setFormData(updatedForm);
  };

  const toggleSectionOption = (option) => {
    let updatedSections = [...formData.section];
    if (updatedSections.includes(option)) {
      updatedSections = updatedSections.filter((item) => item !== option);
    } else {
      updatedSections.push(option);
    }
    setFormData({ ...formData, section: updatedSections });
    setShowSectionDropdown(false);
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
    // Clear form or add to table as needed
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
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
          title="Quotation"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6 flex-1 flex flex-col gap-4">
          <div className="bg-white border rounded-xl shadow p-6 w-full">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Design Area */}
              <div>
                <label className="block text-sm font-medium mb-1">Design Area</label>
                <select
                  name="designArea"
                  value={formData.designArea}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-4 py-2 text-sm"
                >
                  <option value="">Select Area</option>
                  {designAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Multi-Select */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Section</label>
                <div
                  className="w-full border rounded px-4 py-2 text-sm cursor-pointer"
                  onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                >
                  {formData.section.length > 0
                    ? formData.section.join(", ")
                    : "Select Section(s)"}
                </div>
                {showSectionDropdown && (
                  <div className="absolute z-10 bg-white border rounded shadow mt-1 w-full max-h-40 overflow-auto">
                    {sectionOptions.map((option) => (
                      <label
                        key={option}
                        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.section.includes(option)}
                          onChange={() => toggleSectionOption(option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border rounded px-4 py-2 text-sm"
                  required
                />
                {formData.image && (
                  <div className="mt-2 text-blue-600 text-sm flex items-center gap-2">
                    <span>📷</span> <span>{formData.image.name}</span>
                  </div>
                )}
              </div>

              {/* Task Details */}
              <div>
                <label className="block text-sm font-medium mb-1">Task Details</label>
                <input
                  type="text"
                  name="taskDetails"
                  placeholder="Enter Details"
                  value={formData.taskDetails}
                  onChange={handleInputChange}
                  className="w-full border rounded px-4 py-2 text-sm"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  name="qty"
                  value={formData.qty}
                  onChange={handleInputChange}
                  className="w-full border rounded px-4 py-2 text-sm"
                  required
                />
              </div>

              {/* UOM */}
              <div>
                <label className="block text-sm font-medium mb-1">UOM</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  placeholder="e.g. Sq Ft"
                  className="w-full border rounded px-4 py-2 text-sm"
                  required
                />
              </div>

              {/* Rate */}
              <div>
                <label className="block text-sm font-medium mb-1">Rate</label>
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  className="w-full border rounded px-4 py-2 text-sm"
                  required
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium mb-1">Discount</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full border rounded px-4 py-2 text-sm"
                  required
                />
              </div>

              {/* GST */}
              <div>
                <label className="block text-sm font-medium mb-1">GST (%)</label>
                <input
                  type="number"
                  name="gst"
                  value={formData.gst}
                  onChange={handleInputChange}
                  className="w-full border rounded px-4 py-2 text-sm"
                  required
                />
              </div>

              {/* Amount (auto-calculated) */}
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  readOnly
                  className="w-full border bg-gray-100 rounded px-4 py-2 text-sm"
                />
              </div>

              <div className="col-span-full">
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded mt-4 w-full sm:w-fit"
                >
                  ADD
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuoteForm;
