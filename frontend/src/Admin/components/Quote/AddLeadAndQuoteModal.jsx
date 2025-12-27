import { useState } from "react";
import { toast } from "react-toastify";
import { createLead } from "../../../services/leadServices";
import { createQuote } from "../../../services/quoteServices";

function AddLeadAndQuoteModal({ architects, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    // Lead fields
    propertyDetails: "",
    budget: "",
    style: "",
    requirements: "",
    address: "",
    name: "",
    contact: "",
    email: "",
    category: "",
    source: "",
    isHuelip: false,
    assigned: "",
    // Quote fields
    quoteAmount: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const filteredArchitects = architects.filter((arch) =>
    arch.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.propertyDetails || !formData.budget || !formData.address) {
      toast.error("Please fill in all required fields (Property Details, Budget, Address)");
      return;
    }

    if (!formData.assigned) {
      toast.error("Please select an architect");
      return;
    }

    if (!formData.quoteAmount) {
      toast.error("Please enter quote amount");
      return;
    }

    try {
      setLoading(true);

      // Create lead first
      const leadPayload = {
        propertyDetails: formData.propertyDetails,
        budget: formData.budget,
        style: formData.style || undefined,
        requirements: formData.requirements || undefined,
        address: formData.address,
        name: formData.name || undefined,
        contact: formData.contact || undefined,
        email: formData.email || undefined,
        category: formData.category || undefined,
        source: formData.source || undefined,
        isHuelip: formData.isHuelip,
        assigned: formData.assigned,
        status: "Assigned",
      };

      const createdLead = await createLead(leadPayload);
      toast.success("Lead created successfully!");

      // Create quote with the new lead
      const quotePayload = {
        leadId: createdLead._id,
        quoteAmount: formData.quoteAmount,
        city: formData.city || "N/A",
        assigned: [formData.assigned],
        status: "In Review",
      };

      await createQuote(quotePayload);
      toast.success("Quote created successfully!");

      // Reset form
      setFormData({
        propertyDetails: "",
        budget: "",
        style: "",
        requirements: "",
        address: "",
        name: "",
        contact: "",
        email: "",
        category: "",
        source: "",
        isHuelip: false,
        assigned: "",
        quoteAmount: "",
        city: "",
      });
      setSearchTerm("");

      onSuccess();
    } catch (error) {
      console.error("Error creating lead/quote:", error);
      toast.error(
        error.response?.data?.message || "Failed to create lead and quote"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">Add New Lead & Quote</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Property Details */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Property Details <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="propertyDetails"
                value={formData.propertyDetails}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Enter property details"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Budget <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Enter budget"
              />
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm font-medium mb-1">Style</label>
              <input
                type="text"
                name="style"
                value={formData.style}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter style"
              />
            </div>

            {/* Requirements */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Requirements
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter requirements"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Enter address"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter name"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium mb-1">Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter contact number"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter email"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select category</option>
                <option value="RESIDENTIAL">RESIDENTIAL</option>
                <option value="COMMERCIAL">COMMERCIAL</option>
                <option value="INDUSTRIAL">INDUSTRIAL</option>
                <option value="RETAIL">RETAIL</option>
              </select>
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium mb-1">Source</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter source"
              />
            </div>

            {/* Assigned Architect */}
            <div className="md:col-span-2 relative">
              <label className="block text-sm font-medium mb-1">
                Assign Architect <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Search architect..."
                className="w-full border rounded px-3 py-2"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
              <input
                type="hidden"
                name="assigned"
                value={formData.assigned}
              />

              {showDropdown && (
                <div
                  className="absolute left-0 mt-1 w-full bg-white border rounded shadow-lg z-20"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {filteredArchitects.length > 0 ? (
                    filteredArchitects.map((arch) => (
                      <div
                        key={arch._id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            assigned: arch._id,
                          }));
                          setSearchTerm(arch.name || "");
                          setShowDropdown(false);
                        }}
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold uppercase">
                          {(arch.name || "")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">
                            {arch.name || "Unnamed"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-3 text-gray-500">No results found</p>
                  )}
                </div>
              )}
            </div>

            {/* Is Huelip */}
            <div className="md:col-span-2 flex items-center space-x-2">
              <input
                type="checkbox"
                name="isHuelip"
                checked={formData.isHuelip}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Is Huelip</label>
            </div>

            {/* Quote Amount */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Quote Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quoteAmount"
                value={formData.quoteAmount}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Enter quote amount"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium mb-1">City/Area</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter city/area"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Lead & Quote"}
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default AddLeadAndQuoteModal;

