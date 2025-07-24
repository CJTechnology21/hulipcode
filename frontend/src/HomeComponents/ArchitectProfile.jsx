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







// const architects = [
//   {
//     id: 1,
//     name: "Ar. Neha Sharma",
//     username: "neha_sharma",
//     location: "Delhi",
//     experience: "8 Years",
//     rate: 20,
//     score: "8.5",
//     successRate: "96",
//     rating: 4.0,
//     reviews: 120,
//     tagline: "Creative Interior Design & Artistic Painting",
//     bio: "Experienced interior designer and painter delivering elegant living spaces.",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
//     flagUrl: "https://flagcdn.com/w40/in.png",
//     skills: ["Interior Designer", "Painter"],
//   },
//   {
//     id: 2,
//     name: "Ar. Raj Mehta",
//     username: "raj_mehta",
//     location: "Mumbai",
//     experience: "5 Years",
//     rate: 25,
//     score: "7.9",
//     successRate: "89",
//     rating: 3.0,
//     reviews: 85,
//     tagline: "Expert Plumbing & Detailed Painting",
//     bio: "Dedicated to quality plumbing solutions and detailed paint finishes.",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
//     flagUrl: "https://flagcdn.com/w40/in.png",
//     skills: ["Plumber", "Painter"],
//   },
//   {
//     id: 3,
//     name: "Ar. Krishna Mehta",
//     username: "krishna_mehta",
//     location: "Hyderabad",
//     experience: "6 Years",
//     rate: 15,
//     score: "9.3",
//     successRate: "98",
//     rating: 5.0,
//     reviews: 150,
//     tagline: "Modern Interiors & Custom Carpentry",
//     bio: "Specialized in modern interior designs and high-quality woodwork.",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
//     flagUrl: "https://flagcdn.com/w40/in.png",
//     skills: ["Interior Designer", "Carpenter"],
//   },
//   {
//     id: 4,
//     name: "Sanjay Saahu",
//     username: "sanjay_saahu",
//     location: "Bangalore",
//     experience: "6 Years",
//     rate: 15,
//     score: "9.0",
//     successRate: "97",
//     rating: 5.0,
//     reviews: 150,
//     tagline: "Elegant Design & Skilled Carpentry",
//     bio: "Creating functional interiors and lasting wooden structures.",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
//     flagUrl: "https://flagcdn.com/w40/in.png",
//     skills: ["Interior Designer", "Carpenter"],
//   },
//   {
//     id: 5,
//     name: "Balu",
//     username: "balu_chennai",
//     location: "Chennai",
//     experience: "6 Years",
//     rate: 15,
//     score: "8.8",
//     successRate: "94",
//     rating: 4.0,
//     reviews: 150,
//     tagline: "Versatile Interior Work & Woodcraft",
//     bio: "Passionate about turning concepts into beautiful living environments.",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
//     flagUrl: "https://flagcdn.com/w40/in.png",
//     skills: ["Interior Designer", "Carpenter"],
//   },
// ];

// const mockProjects = [
//   {
//     id: 1,
//     title: "Modern Home Renovation",
//     location: "Mumbai",
//     budget: "₹8,00,000",
//     postedBy: "Rajeev Sharma",
//     description:
//       "Need a designer for 3BHK apartment revamp with modern interior theme.",
//   },
//   {
//     id: 2,
//     title: "Cafe Interior Design",
//     location: "Delhi",
//     budget: "₹5,00,000",
//     postedBy: "Ankita Verma",
//     description:
//       "Seeking aesthetic designer for a new café layout and ambience design.",
//   },
// ];
