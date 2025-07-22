// // pages/ArchitectProfile.jsx
// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";

// const dummyArchitects = [
//   // same as your architects array
// ];

// function ArchitectProfile() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const architect = dummyArchitects.find((a) => a.id === Number(id));

//   if (!architect) {
//     return <div className="text-center mt-10 text-red-500">Architect not found</div>;
//   }

//   const handleHire = () => {
//     toast.success("Hire request sent to " + architect.name);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="max-w-5xl mx-auto px-6 py-10"
//     >
//       <button onClick={() => navigate(-1)} className="text-blue-600 mb-4 underline">
//         ← Back
//       </button>

//       <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col sm:flex-row gap-6">
//         <img
//           src={architect.image}
//           alt={architect.name}
//           className="w-48 h-48 rounded-full object-cover"
//         />
//         <div>
//           <h2 className="text-2xl font-bold text-[#0b1c38]">{architect.name}</h2>
//           <p className="text-gray-600 mt-1">{architect.location}</p>
//           <p className="text-gray-500 mt-1">Experience: {architect.experience}</p>
//           <p className="text-gray-500 mt-1">Charges: {architect.charges}</p>

//           <button
//             onClick={handleHire}
//             className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
//           >
//             Hire Now
//           </button>
//         </div>
//       </div>

//       {/* You can add tabs like Portfolio, Reviews etc. */}
//     </motion.div>
//   );
// }

// export default ArchitectProfile;
