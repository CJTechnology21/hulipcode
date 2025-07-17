import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";

function UserProfile() {
  const [user, setUser] = useState(null);
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/user/me`,
        { withCredentials: true }
      );
      console.log("✅ User data fetched:", res.data); // Make sure to check this
      setUser(res.data); // 👈 might need to change this to res.data.user
    } catch (error) {
      console.error("❌ Error fetching user:", error);
    }
  };
  fetchUser();
}, []);


  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await axios.get(
  //         `${process.env.REACT_APP_API_BASE}/api/user/me`,
  //         {
  //           withCredentials: true, // ✅ needed to send cookie for auth
  //         }
  //       );
  //       setUser(res.data);
  //       console.log("User data fetched:", res.data);
  //     } catch (error) {
  //       console.error("❌ Error fetching user:", error);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  if (!user) {
    return (
      <div>
        <Header />
        <div className="p-8 text-center text-gray-500">
          Loading user profile...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded mt-6">
        <h1 className="text-2xl font-semibold mb-4">User Profile</h1>
        <div className="space-y-4">
          <div>
            <strong className="block text-gray-600">Name:</strong>
            <p>{user.name || "N/A"}</p>
          </div>
          <div>
            <strong className="block text-gray-600">Email:</strong>
            <p>{user.email || "N/A"}</p>
          </div>
          <div>
            <strong className="block text-gray-600">Phone number:</strong>
            <p>{user.phoneNumber || "N/A"}</p>
          </div>
          <div>
            <strong className="block text-gray-600">Reward Points:</strong>
            <p>{user.rewardPoints || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
