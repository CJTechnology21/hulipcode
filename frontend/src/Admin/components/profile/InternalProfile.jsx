import React, { useState } from "react";
import SideBar from "../SideBar";
import Header from "../Header";

function InternalProfile() {
   const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    googleLocation: "",
    gstNumber: "",
    incomeTaxNumber: "",
    socialMedia: "",
    gstr: "",
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Submitted:", formData);
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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Dashboard"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6 overflow-y-auto">
          <div className="bg-white p-6 rounded-xl shadow space-y-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter name"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">
                    Phone Number
                  </label>
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">
                    Email
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter email"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter address"
                    required
                  />
                </div>

                {/* Google Location */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">
                    Google Location
                  </label>
                  <input
                    name="googleLocation"
                    value={formData.googleLocation}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter Google Location"
                    required
                  />
                </div>

                {/* GST Number */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">
                    GST Number
                  </label>
                  <input
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter GST Number"
                    required
                  />
                </div>

                {/* Income Tax Number */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">
                    Income Tax Number
                  </label>
                  <input
                    name="incomeTaxNumber"
                    value={formData.incomeTaxNumber}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter Income Tax Number"
                    required
                  />
                </div>

                {/* Social Media Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">
                    Social Media
                  </label>
                  <select
                    name="socialMedia"
                    value={formData.socialMedia}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  >
                    <option value="">Select Platform</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                </div>

                {/* GSTR */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">GSTR</label>
                  <input
                    name="gstr"
                    value={formData.gstr}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter GSTR"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-fredoka"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InternalProfile;
