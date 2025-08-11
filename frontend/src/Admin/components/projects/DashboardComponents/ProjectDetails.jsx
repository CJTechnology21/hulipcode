import React, { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import DashboardCard from "./DashboardCard";

function ProjectDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [details, setDetails] = useState({
    projectName: "Amartya’s Appartment",
    clientName: "Brijesh Kohli",
    clientContact: "+91-9810422343",
    address: "34d rishtedar colony, Ashok Nagar\nDelhi - 110019",
    category: "Residential",
    scope: "Turnkey Project",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Optionally trigger API save here
    console.log("Saved details:", details);
  };

  return (
    <DashboardCard
      title="Project Details"
      extraHeader={
        <div className="flex gap-2 items-center">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-green-600"
            >
              Save
            </button>
          ) : null}
          <PencilSquareIcon
            className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={() => setIsEditing(!isEditing)}
          />
        </div>
      }
    >
      {Object.entries({
        "Project Name": isEditing ? (
          <input
            type="text"
            name="projectName"
            value={details.projectName}
            onChange={handleChange}
            className="border rounded p-1 w-full text-sm sm:text-base"
          />
        ) : (
          <p className="font-bold text-black break-words">{details.projectName}</p>
        ),
        "Client Name & Contact Details": isEditing ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              name="clientName"
              value={details.clientName}
              onChange={handleChange}
              className="border rounded p-1 flex-1 text-sm sm:text-base"
            />
            <input
              type="text"
              name="clientContact"
              value={details.clientContact}
              onChange={handleChange}
              className="border rounded p-1 flex-1 text-sm sm:text-base"
            />
          </div>
        ) : (
          <p className="font-bold text-black break-words">
            {details.clientName}{" "}
            <span className="block sm:inline sm:ml-4">{details.clientContact}</span>
          </p>
        ),
        Address: isEditing ? (
          <textarea
            name="address"
            value={details.address}
            onChange={handleChange}
            className="border rounded p-1 w-full text-sm sm:text-base"
            rows={2}
          />
        ) : (
          <p className="font-bold text-black whitespace-pre-line break-words">{details.address}</p>
        ),
        "Project Category": isEditing ? (
          <input
            type="text"
            name="category"
            value={details.category}
            onChange={handleChange}
            className="border rounded p-1 w-full text-sm sm:text-base"
          />
        ) : (
          <p className="font-bold text-black break-words">{details.category}</p>
        ),
        "Project Scope": isEditing ? (
          <input
            type="text"
            name="scope"
            value={details.scope}
            onChange={handleChange}
            className="border rounded p-1 w-full text-sm sm:text-base"
          />
        ) : (
          <p className="font-bold text-black break-words">{details.scope}</p>
        ),
      }).map(([label, field], idx) => (
        <div key={idx} className="mb-2">
          <p className="text-red-600 font-semibold text-xs sm:text-sm">{label}</p>
          {field}
        </div>
      ))}
    </DashboardCard>
  );
}

export default ProjectDetails;

// import React, { useState } from "react";
// import { PencilSquareIcon } from "@heroicons/react/24/outline";
// import DashboardCard from "./DashboardCard";

// function ProjectDetails() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [details, setDetails] = useState({
//     projectName: "Amartya’s Appartment",
//     clientName: "Brijesh Kohli",
//     clientContact: "+91-9810422343",
//     address: "34d rishtedar colony, Ashok Nagar\nDelhi - 110019",
//     category: "Residential",
//     scope: "Turnkey Project",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setDetails({ ...details, [name]: value });
//   };

//   return (
//     <DashboardCard
//       title="Project Details"
//       extraHeader={
//         <PencilSquareIcon
//           className="w-5 h-5 text-gray-600 cursor-pointer"
//           onClick={() => setIsEditing(!isEditing)}
//         />
//       }
//     >
//       {Object.entries({
//         "Project Name": (
//           isEditing ? (
//             <input
//               type="text"
//               name="projectName"
//               value={details.projectName}
//               onChange={handleChange}
//               className="border rounded p-1 w-full"
//             />
//           ) : (
//             <p className="font-bold text-black">{details.projectName}</p>
//           )
//         ),
//         "Client Name & Contact Details": (
//           isEditing ? (
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 name="clientName"
//                 value={details.clientName}
//                 onChange={handleChange}
//                 className="border rounded p-1 w-1/2"
//               />
//               <input
//                 type="text"
//                 name="clientContact"
//                 value={details.clientContact}
//                 onChange={handleChange}
//                 className="border rounded p-1 w-1/2"
//               />
//             </div>
//           ) : (
//             <p className="font-bold text-black">
//               {details.clientName} <span className="ml-4">{details.clientContact}</span>
//             </p>
//           )
//         ),
//         "Address": (
//           isEditing ? (
//             <textarea
//               name="address"
//               value={details.address}
//               onChange={handleChange}
//               className="border rounded p-1 w-full"
//               rows={2}
//             />
//           ) : (
//             <p className="font-bold text-black whitespace-pre-line">{details.address}</p>
//           )
//         ),
//         "Project Category": (
//           isEditing ? (
//             <input
//               type="text"
//               name="category"
//               value={details.category}
//               onChange={handleChange}
//               className="border rounded p-1 w-full"
//             />
//           ) : (
//             <p className="font-bold text-black">{details.category}</p>
//           )
//         ),
//         "Project Scope": (
//           isEditing ? (
//             <input
//               type="text"
//               name="scope"
//               value={details.scope}
//               onChange={handleChange}
//               className="border rounded p-1 w-full"
//             />
//           ) : (
//             <p className="font-bold text-black">{details.scope}</p>
//           )
//         ),
//       }).map(([label, field], idx) => (
//         <div key={idx} className="mb-2">
//           <p className="text-red-600 font-semibold text-sm">{label}</p>
//           {field}
//         </div>
//       ))}
//     </DashboardCard>
//   );
// }

// export default ProjectDetails;
