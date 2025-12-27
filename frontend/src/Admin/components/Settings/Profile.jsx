import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { getUserProfile, updateUser, fetchAddresses, fetchBankDetails, addAddress, updateAddress, addBankDetail, updateBankDetail } from "../../../services/userServices";
import Button from "../../../components/Button";

function Profile() {
  const { user, refreshUser } = useAuth() || {};
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    fatherName: "",
    phoneNumber: "",
    email: "",
  });
  const [addressData, setAddressData] = useState({
    addressLine1: "",
    area: "",
    city: "",
    zip: "",
    state: "",
    country: "India",
  });
  const [bankData, setBankData] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
  });
  const [addressId, setAddressId] = useState(null);
  const [bankId, setBankId] = useState(null);

  // Load user data on mount
  useEffect(() => {
    if (user?._id) {
      loadUserData();
    }
  }, [user?._id]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      let userId = user?._id;
      let profileData = null;

      // Fetch full user profile
      try {
        profileData = await getUserProfile();
        userId = profileData?._id || userId;
      } catch (err) {
        console.error("Error fetching user profile:", err);
        // Fallback to user object from context
        if (user) {
          profileData = user;
        }
      }

      if (!userId && !profileData) {
        setLoading(false);
        return;
      }

      // Load user basic info
      setUserData({
        name: profileData?.name || user?.name || "",
        fatherName: profileData?.fatherName || user?.fatherName || "",
        phoneNumber: profileData?.phoneNumber || user?.phoneNumber || "",
        email: profileData?.email || user?.email || "",
      });

      // Use userId from profileData or user object (already set above)
      if (!userId) {
        setLoading(false);
        return;
      }

      // Load addresses
      try {
        const addresses = await fetchAddresses(userId);
        if (addresses && addresses.length > 0) {
          const primaryAddress = addresses[0]; // Use first address as primary
          setAddressData({
            addressLine1: primaryAddress.addressLine1 || primaryAddress.address || "",
            area: primaryAddress.area || "",
            city: primaryAddress.city || "",
            zip: primaryAddress.zip || "",
            state: primaryAddress.state || "",
            country: primaryAddress.country || "India",
          });
          setAddressId(primaryAddress._id);
        }
      } catch (err) {
        console.error("Error loading addresses:", err);
      }

      // Load bank details
      try {
        const bankDetails = await fetchBankDetails(userId);
        if (bankDetails && bankDetails.length > 0) {
          const primaryBank = bankDetails[0]; // Use first bank detail as primary
          setBankData({
            accountHolderName: primaryBank.accountHolderName || "",
            accountNumber: primaryBank.accountNumber || "",
            ifscCode: primaryBank.ifscCode || "",
          });
          setBankId(primaryBank._id);
        }
      } catch (err) {
        console.error("Error loading bank details:", err);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Get userId
      let userId = user?._id;
      if (!userId) {
        try {
          const profileData = await getUserProfile();
          userId = profileData?._id;
        } catch (err) {
          toast.error("User ID missing. Please refresh the page.");
          return;
        }
      }

      if (!userId) {
        toast.error("User ID missing");
        return;
      }

      setLoading(true);

      // Update user basic info
      await updateUser(userId, {
        name: userData.name,
        fatherName: userData.fatherName,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
      });

      // Update or add address
      if (addressId) {
        await updateAddress(userId, addressId, addressData);
      } else {
        const newAddress = await addAddress(userId, addressData);
        if (newAddress?.addresses && newAddress.addresses.length > 0) {
          setAddressId(newAddress.addresses[newAddress.addresses.length - 1]._id);
        }
      }

      // Update or add bank details
      if (bankId) {
        await updateBankDetail(userId, bankId, bankData);
      } else {
        const newBank = await addBankDetail(userId, bankData);
        if (newBank?.bankDetails && newBank.bankDetails.length > 0) {
          setBankId(newBank.bankDetails[newBank.bankDetails.length - 1]._id);
        }
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      // Reload user data to reflect changes
      await loadUserData();
      // Refresh AuthContext to update header
      if (refreshUser) {
        await refreshUser();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadUserData(); // Reset to original values
  };

  if (loading && !userData.name) {
    return <div className="p-6 text-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        {!isEditing ? (
          <Button
            variant="custom"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => setIsEditing(true)}
          >
            <FaEdit /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="custom"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              onClick={handleSave}
              disabled={loading}
            >
              <FaSave /> {loading ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="custom"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              onClick={handleCancel}
              disabled={loading}
            >
              <FaTimes /> Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Personal Information Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            ) : (
              <p className="text-gray-900 py-2">{userData.name || "Not provided"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Father Name / Husband Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={userData.fatherName}
                onChange={(e) => setUserData({ ...userData, fatherName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter father/husband name"
              />
            ) : (
              <p className="text-gray-900 py-2">{userData.fatherName || "Not provided"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={userData.phoneNumber}
                onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                pattern="[0-9]{10,15}"
                required
              />
            ) : (
              <p className="text-gray-900 py-2">{userData.phoneNumber || "Not provided"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            ) : (
              <p className="text-gray-900 py-2">{userData.email || "Not provided"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Address Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Address
            </label>
            {isEditing ? (
              <textarea
                value={addressData.addressLine1}
                onChange={(e) => setAddressData({ ...addressData, addressLine1: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Enter full address"
              />
            ) : (
              <p className="text-gray-900 py-2">{addressData.addressLine1 || "Not provided"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area
            </label>
            {isEditing ? (
              <input
                type="text"
                value={addressData.area}
                onChange={(e) => setAddressData({ ...addressData, area: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter area"
              />
            ) : (
              <p className="text-gray-900 py-2">{addressData.area || "Not provided"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            {isEditing ? (
              <input
                type="text"
                value={addressData.city}
                onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter city"
              />
            ) : (
              <p className="text-gray-900 py-2">{addressData.city || "Not provided"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            {isEditing ? (
              <input
                type="text"
                value={addressData.state}
                onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter state"
              />
            ) : (
              <p className="text-gray-900 py-2">{addressData.state || "Not provided"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode
            </label>
            {isEditing ? (
              <input
                type="text"
                value={addressData.zip}
                onChange={(e) => setAddressData({ ...addressData, zip: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter pincode"
                pattern="[0-9]{6}"
              />
            ) : (
              <p className="text-gray-900 py-2">{addressData.zip || "Not provided"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            {isEditing ? (
              <input
                type="text"
                value={addressData.country}
                onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{addressData.country || "Not provided"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Bank Details Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Bank Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Holder Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={bankData.accountHolderName}
                onChange={(e) => setBankData({ ...bankData, accountHolderName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter account holder name"
              />
            ) : (
              <p className="text-gray-900 py-2">{bankData.accountHolderName || "Not provided"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            {isEditing ? (
              <input
                type="text"
                value={bankData.accountNumber}
                onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter account number"
              />
            ) : (
              <p className="text-gray-900 py-2">{bankData.accountNumber || "Not provided"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IFSC Code
            </label>
            {isEditing ? (
              <input
                type="text"
                value={bankData.ifscCode}
                onChange={(e) => setBankData({ ...bankData, ifscCode: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter IFSC code"
                maxLength="11"
              />
            ) : (
              <p className="text-gray-900 py-2">{bankData.ifscCode || "Not provided"}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

