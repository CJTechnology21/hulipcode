
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const roleFromStorage = localStorage.getItem("crm_role");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE}/api/user/me`,
          { withCredentials: true }
        );
        console.log("✅ User data fetched:", res.data);
        setUser(res.data);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Header />
        <ClipLoader color="#1f2937" size={50} />
        <p className="mt-4 text-gray-500">Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Header />
        <div className="p-8 text-center text-red-500 font-semibold">
          ❌ Failed to load user profile.
        </div>
      </div>
    );
  }

  const displayRole = user.role || roleFromStorage;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">👤 User Profile</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div>
            <p className="text-sm font-semibold text-gray-500">Name</p>
            <p className="text-lg">{user.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Email</p>
            <p className="text-lg">{user.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Phone Number</p>
            <p className="text-lg">{user.phoneNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Role</p>
            <p className="text-lg capitalize">{displayRole || "N/A"}</p>
          </div>

          {displayRole === "architect" && (
            <div className="sm:col-span-2">
              <p className="text-sm font-semibold text-gray-500">Reward Points</p>
              <p className="text-lg text-green-600 font-bold">{user.rewardPoints ?? 0}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

// import React, { useEffect, useState } from "react";
// import Header from "../components/Header";
// import axios from "axios";
// import ClipLoader from "react-spinners/ClipLoader";

// function UserProfile() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // track loading state

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.REACT_APP_API_BASE}/api/user/me`,
//           { withCredentials: true }
//         );
//         console.log("✅ User data fetched:", res.data);
//         setUser(res.data);
//       } catch (error) {
//         console.error(" Error fetching user:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <Header />
//         <ClipLoader color="#1f2937" size={50} />
//         <p className="mt-4 text-gray-500">Loading user profile...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div>
//         <Header />
//         <div className="p-8 text-center text-gray-500">
//           Failed to load user profile.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Header />
//       <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded mt-6">
//         <h1 className="text-2xl font-semibold mb-4">User Profile</h1>
//         <div className="space-y-4">
//           <div>
//             <strong className="block text-gray-600">Name:</strong>
//             <p>{user.name || "N/A"}</p>
//           </div>
//           <div>
//             <strong className="block text-gray-600">Email:</strong>
//             <p>{user.email || "N/A"}</p>
//           </div>
//           <div>
//             <strong className="block text-gray-600">Phone number:</strong>
//             <p>{user.phoneNumber || "N/A"}</p>
//           </div>

//           {user.role === "architect" && (
//             <div>
//               <strong className="block text-gray-600">Reward Points:</strong>
//               <p>{user.rewardPoints || 0}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserProfile;