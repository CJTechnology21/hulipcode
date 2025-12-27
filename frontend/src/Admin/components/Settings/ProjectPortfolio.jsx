import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaTimes, FaChevronUp } from "react-icons/fa";
import { createPortfolio, getPortfolios, deletePortfolio } from "../../../services/portfolioServices";
import { generateUploadURL } from "../../../services/overViewServices";

function ProjectPortfolio() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    timeframe: "",
    type: "All Property Types",
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const propertyTypes = ["All Property Types", "HDB", "Commercial", "Condo", "Terrace", "Landed"];

  // Load portfolios on component mount
  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      setLoading(true);
      const data = await getPortfolios();
      setPortfolios(data || []);
    } catch (error) {
      console.error("Error loading portfolios:", error);
      // Don't show error toast for 401 - the axios interceptor will handle redirect
      if (error.response?.status !== 401) {
        toast.error("Failed to load portfolios");
      }
      // Set empty array on error to prevent UI issues
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding these files would exceed 10 images
    if (imageFiles.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    // Filter only image files
    const imageFilesOnly = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFilesOnly.length !== files.length) {
      toast.error("Please select only image files");
    }

    if (imageFilesOnly.length > 0) {
      setImageFiles((prev) => [...prev, ...imageFilesOnly]);
      
      // Create previews
      imageFilesOnly.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToS3 = async (files) => {
    const uploadedUrls = [];
    
    for (const file of files) {
      try {
        // Generate signed URL or local upload endpoint
        let uploadUrl, url, useLocalStorage, fileKey;
        try {
          const result = await generateUploadURL(file.name, file.type);
          uploadUrl = result.uploadUrl;
          url = result.url;
          useLocalStorage = result.useLocalStorage;
          fileKey = result.fileKey;
        } catch (urlError) {
          console.error("Error generating upload URL:", urlError);
          throw new Error(`Failed to generate upload URL for ${file.name}: ${urlError.response?.data?.error || urlError.message}`);
        }
        
        if (useLocalStorage) {
          // Upload to local storage endpoint
          const formData = new FormData();
          formData.append('file', file);
          if (fileKey) {
            formData.append('fileKey', fileKey);
          }
          
          const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({}));
            throw new Error(`Local upload failed: ${errorData.error || uploadResponse.statusText}`);
          }
          
          const result = await uploadResponse.json();
          uploadedUrls.push(result.url);
        } else {
          // Upload to S3
          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });
          
          if (!uploadResponse.ok) {
            throw new Error(`S3 upload failed with status ${uploadResponse.status}`);
          }
          
          uploadedUrls.push(url);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error(`Failed to upload ${file.name}: ${error.message || 'Unknown error'}`);
      }
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.budget || !formData.timeframe || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (imageFiles.length === 0) {
      toast.error("Please add at least one project image");
      return;
    }

    setUploadingImages(true);
    setLoading(true);

    try {
      // Upload all images to S3
      const imageUrls = await uploadImagesToS3(imageFiles);

      // Create portfolio project
      const portfolioData = {
        name: formData.name,
        budget: Number(formData.budget),
        timeframe: formData.timeframe,
        type: formData.type,
        images: imageUrls,
      };

      await createPortfolio(portfolioData);
      toast.success("Project added to portfolio successfully!");
      
      // Reset form
      setFormData({
        name: "",
        budget: "",
        timeframe: "",
        type: "All Property Types",
        images: []
      });
      setImageFiles([]);
      setImagePreviews([]);
      setIsModalOpen(false);
      
      // Reload portfolios
      await loadPortfolios();
    } catch (error) {
      console.error("Error creating portfolio:", error);
      toast.error(error.response?.data?.message || "Failed to add project to portfolio");
    } finally {
      setUploadingImages(false);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      await deletePortfolio(id);
      toast.success("Project deleted successfully");
      await loadPortfolios();
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleCloseModal = () => {
    if (!uploadingImages && !loading) {
      setIsModalOpen(false);
      setFormData({
        name: "",
        budget: "",
        timeframe: "",
        type: "All Property Types",
        images: []
      });
      setImageFiles([]);
      setImagePreviews([]);
    }
  };

  return (
    <div className="p-6">
      {/* Header with Add Project Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-fredoka">Portfolio Projects</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-fredoka"
        >
          <FaPlus size={16} />
          Add Project
        </button>
      </div>

      {/* Portfolio Projects Grid */}
      {loading && portfolios.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : portfolios.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No portfolio projects yet. Click "Add Project" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio._id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Project Image */}
              {portfolio.images && portfolio.images.length > 0 && (
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={portfolio.images[0]}
                    alt={portfolio.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {portfolio.images.length} {portfolio.images.length === 1 ? 'image' : 'images'}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Project Details */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 font-fredoka">{portfolio.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Budget:</span> ₹{portfolio.budget?.toLocaleString()}</p>
                  <p><span className="font-medium">Timeframe:</span> {portfolio.timeframe}</p>
                  <p><span className="font-medium">Type:</span> {portfolio.type}</p>
                </div>
                <button
                  onClick={() => handleDelete(portfolio._id)}
                  className="mt-3 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold font-fredoka">Add New Project</h3>
              <button
                onClick={handleCloseModal}
                disabled={uploadingImages || loading}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-fredoka">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Project Name"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Budget and Timeframe */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-fredoka">
                    Project Budget <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="Enter Budget"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-fredoka">
                    Project Timeframe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="timeframe"
                    value={formData.timeframe}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 months"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-fredoka">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    required
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <FaChevronUp className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none rotate-180" size={12} />
                </div>
              </div>

              {/* Project Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-fredoka">
                  Project Images <span className="text-red-500">*</span> (Max 10)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={imageFiles.length >= 10 || uploadingImages}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                {imageFiles.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {imageFiles.length} of 10 images selected
                  </p>
                )}

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={uploadingImages || loading}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-fredoka"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImages || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-fredoka"
                >
                  {uploadingImages || loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectPortfolio;
