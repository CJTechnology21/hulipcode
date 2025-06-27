import { useState } from "react";
import Header from "../Header";
import SideBar from "../SideBar";

function ContactVendor() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [formData, setFormData] = useState({
    itemType: "",
    vendor: "",
    category: [],
    details: "",
    qty: "",
    rate: "",
    gst: "",
    total: "",
    image: null,
  });

  const itemTypes = ["Interior", "Construction Material"];
  const vendors = ["Vendor A", "Vendor B", "Vendor C"];

  const categoryOptions = {
    Interior: ["Dining Table", "Sofa", "Bed", "Chair", "Lighting"],
    "Construction Material": ["Sand", "Bricks", "Tiles", "Cement", "Steel"],
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

const handleCategoryToggle = (value) => {
  const selected = [...formData.category];
  let updated;

  if (selected.includes(value)) {
    updated = selected.filter((item) => item !== value);
  } else {
    updated = [...selected, value];
  }

  setFormData({ ...formData, category: updated });
  setShowCategoryDropdown(false); 
};

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // Backend API call goes here
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <SideBar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Contact Vendor"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6">
          <div className="bg-white border rounded-xl shadow p-6 w-full">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Item Type */}
              <div>
                <label className="block text-sm font-medium mb-1">Item Type</label>
                <select
                  name="itemType"
                  value={formData.itemType}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData((prev) => ({ ...prev, category: [] }));
                  }}
                  required
                  className="w-full border rounded px-4 py-2 text-sm"
                >
                  <option value="">Select Type</option>
                  {itemTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category - styled like QuoteForm */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Category</label>
                <div
                  className="w-full border rounded px-4 py-2 text-sm cursor-pointer bg-white"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  {formData.category.length > 0
                    ? formData.category.join(", ")
                    : "Select Category"}
                </div>

                {showCategoryDropdown && formData.itemType && (
                  <div className="absolute z-10 bg-white border rounded shadow mt-1 w-full max-h-40 overflow-auto">
                    {categoryOptions[formData.itemType].map((option) => (
                      <label
                        key={option}
                        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={formData.category.includes(option)}
                          onChange={() => handleCategoryToggle(option)}
                          className="mr-2"
                          required
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Vendor Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">Vendor</label>
                <select
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-4 py-2 text-sm"
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  name="qty"
                  value={formData.qty}
                  onChange={handleChange}
                  placeholder="Enter Quantity"
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
                  onChange={handleChange}
                  placeholder="Enter Rate"
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
                  onChange={handleChange}
                  placeholder="Enter GST"
                  className="w-full border rounded px-4 py-2 text-sm"
                  required
                />
              </div>

              {/* Details */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Details</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="Item details, notes etc."
                  className="w-full border rounded px-4 py-2 text-sm"
                  rows={3}
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 text-sm"
                  required            />
              </div>

              {/* Total */}
              <div>
                <label className="block text-sm font-medium mb-1">Total Amount</label>
                <input
                  type="number"
                  name="total"
                  value={formData.total}
                  onChange={handleChange}
                  placeholder="Auto or manual total"
                  className="w-full border rounded px-4 py-2 text-sm"
                  required
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded w-full sm:w-fit"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactVendor;
