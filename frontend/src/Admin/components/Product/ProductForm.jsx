import { useState } from 'react';
import SideBar from '../SideBar';
import Header from '../Header';

function ProductForm() {
 const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    prodcutname: "",
    productDetails: "",
    rate: "",
    unit: "",
    gst: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Reset form if needed
    // setFormData({ taskName: "", taskDetails: "", rate: "", unit: "", gst: "" });
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

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Quotation"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6 flex-1 flex flex-col gap-4">
          <div className="bg-white border rounded-xl shadow p-6 w-full">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 font-fredoka">Product name</label>
                <input
                  type="text"
                  name="taskName"
                  placeholder="Enter Task name"
                  value={formData.taskName}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 font-fredoka">Product details</label>
                <input
                  type="text"
                  name="taskDetails"
                  placeholder="Enter Details"
                  value={formData.taskDetails}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">Rate</label>
                  <input
                    type="text"
                    name="rate"
                    placeholder="Enter Price"
                    value={formData.rate}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    placeholder="Enter unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="sm:w-1/2">
                <label className="block text-sm font-medium mb-1 font-fredoka">GST</label>
                <input
                  type="text"
                  name="gst"
                  placeholder="Enter GST rate"
                  value={formData.gst}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded mt-4 w-full sm:w-fit font-fredoka"
              >
                ADD
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductForm