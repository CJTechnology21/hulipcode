import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaSave, FaTimes, FaPlus } from "react-icons/fa";
import { getPortfolioProfile, savePortfolioProfile } from "../../../services/portfolioProfileServices";
import { generateUploadURL } from "../../../services/overViewServices";

function Portfolio() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    portfolioName: "",
    completedProjects: 0,
    description: "",
    address: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: ""
    },
    accreditations: [""],
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Load portfolio profile on component mount
  useEffect(() => {
    loadPortfolioProfile();
  }, []);

  const loadPortfolioProfile = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioProfile();
      
      // Set form data with loaded data or defaults
      setFormData({
        portfolioName: data.portfolioName || "",
        completedProjects: data.completedProjects || 0,
        description: data.description || "",
        address: data.address || "",
        socialLinks: {
          facebook: data.socialLinks?.facebook || "",
          instagram: data.socialLinks?.instagram || "",
          linkedin: data.socialLinks?.linkedin || "",
          twitter: data.socialLinks?.twitter || ""
        },
        accreditations: data.accreditations && data.accreditations.length > 0 
          ? data.accreditations 
          : [""],
        images: data.images || []
      });
      setExistingImages(data.images || []);
      setImageFiles([]);
    } catch (error) {
      console.error("Error loading portfolio profile:", error);
      if (error.response?.status !== 401) {
        toast.error("Failed to load portfolio profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("socialLinks.")) {
      const socialKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAccreditationChange = (index, value) => {
    const newAccreditations = [...formData.accreditations];
    newAccreditations[index] = value;
    setFormData((prev) => ({
      ...prev,
      accreditations: newAccreditations
    }));
  };

  const addAccreditation = () => {
    setFormData((prev) => ({
      ...prev,
      accreditations: [...prev.accreditations, ""]
    }));
  };

  const removeAccreditation = (index) => {
    if (formData.accreditations.length > 1) {
      const newAccreditations = formData.accreditations.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        accreditations: newAccreditations
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + imageFiles.length + files.length;
    
    // Check if adding these files would exceed 5 images
    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    // Filter only image files
    const imageFilesOnly = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFilesOnly.length !== files.length) {
      toast.error("Please select only image files");
    }

    if (imageFilesOnly.length > 0) {
      setImageFiles((prev) => [...prev, ...imageFilesOnly]);
    }
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    }
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
    if (!formData.portfolioName.trim()) {
      toast.error("Portfolio name is required");
      return;
    }

    setSaving(true);
    setUploadingImages(true);

    try {
      // Upload new images to S3 if any
      let newImageUrls = [];
      if (imageFiles.length > 0) {
        newImageUrls = await uploadImagesToS3(imageFiles);
      }

      // Combine existing images (that weren't removed) with new uploaded images
      const allImages = [...existingImages, ...newImageUrls];

      // Prepare form data with images
      const profileData = {
        ...formData,
        images: allImages
      };

      await savePortfolioProfile(profileData);
      toast.success("Portfolio profile saved successfully!");
      setIsEditing(false);
      await loadPortfolioProfile(); // Reload to get updated data
    } catch (error) {
      console.error("Error saving portfolio profile:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to save portfolio profile");
    } finally {
      setSaving(false);
      setUploadingImages(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadPortfolioProfile(); // Reload original data
    setImageFiles([]); // Clear new image files
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8 text-gray-500">Loading portfolio profile...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-fredoka">Portfolio Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-fredoka"
          >
            <FaEdit size={16} />
            Edit
          </button>
        )}
      </div>

      {/* Portfolio Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Portfolio Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 font-fredoka">
            Portfolio Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="portfolioName"
            value={formData.portfolioName}
            onChange={handleInputChange}
            placeholder="Enter Portfolio Name"
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
        </div>

        {/* Completed Projects */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 font-fredoka">
            Completed Projects
          </label>
          <input
            type="number"
            name="completedProjects"
            value={formData.completedProjects}
            onChange={handleInputChange}
            placeholder="0"
            disabled={!isEditing}
            min="0"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 font-fredoka">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter description about your portfolio"
            disabled={!isEditing}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 font-fredoka">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your address"
            disabled={!isEditing}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
        </div>

        {/* Portfolio Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 font-fredoka">
            Portfolio Images <span className="text-gray-500 text-xs">(Max 5 images)</span>
          </label>
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              {existingImages.map((imageUrl, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-300"
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeImage(index, true)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <FaTimes size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* New Image Previews */}
          {imageFiles.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              {imageFiles.map((file, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-300"
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeImage(index, false)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <FaTimes size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {isEditing && (existingImages.length + imageFiles.length < 5) && (
            <div>
              <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <FaPlus size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Add Images ({existingImages.length + imageFiles.length}/5)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={uploadingImages}
                />
              </label>
            </div>
          )}

          {/* Display count when not editing */}
          {!isEditing && existingImages.length === 0 && (
            <p className="text-sm text-gray-500">No images uploaded</p>
          )}
        </div>

        {/* Social Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 font-fredoka">
            Social Links
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Facebook</label>
              <input
                type="url"
                name="socialLinks.facebook"
                value={formData.socialLinks.facebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/yourpage"
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Instagram</label>
              <input
                type="url"
                name="socialLinks.instagram"
                value={formData.socialLinks.instagram}
                onChange={handleInputChange}
                placeholder="https://instagram.com/yourprofile"
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">LinkedIn</label>
              <input
                type="url"
                name="socialLinks.linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourprofile"
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Twitter</label>
              <input
                type="url"
                name="socialLinks.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/yourhandle"
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Accreditations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 font-fredoka">
            Accreditations
          </label>
          <div className="space-y-2">
            {formData.accreditations.map((accreditation, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={accreditation}
                  onChange={(e) => handleAccreditationChange(index, e.target.value)}
                  placeholder="Enter accreditation"
                  disabled={!isEditing}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {isEditing && formData.accreditations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAccreditation(index)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <button
                type="button"
                onClick={addAccreditation}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded text-sm font-medium"
              >
                <FaPlus size={14} />
                Add Accreditation
              </button>
            )}
          </div>
        </div>

        {/* Submit/Cancel Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-fredoka"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImages}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-fredoka"
            >
              <FaSave size={16} />
              {uploadingImages ? "Uploading images..." : saving ? "Saving..." : "Submit"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default Portfolio;
