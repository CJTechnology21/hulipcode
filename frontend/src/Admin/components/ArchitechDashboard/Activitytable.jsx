
import React from "react";

function Activitytable() {
  const data = [
    {
      name: "Project 1",
      budget: "$796",
      description: "Lorem Ipsum is....",
      date: "28 Jan 2024",
      status: "Completed",
    },
    {
      name: "Project 2",
      budget: "$1,200",
      description: "Dolor sit amet...",
      date: "29 Jan 2024",
      status: "Completed",
    },
    {
      name: "Project 3",
      budget: "$980",
      description: "Consectetur adipiscing...",
      date: "30 Jan 2024",
      status: "Completed",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full max-w-full overflow-x-auto">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Activity</h3>
      <table className="min-w-[600px] w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-500 border-b">
          <tr>
            <th className="px-4 py-2 whitespace-nowrap">Project name</th>
            <th className="px-4 py-2 whitespace-nowrap">Budgets</th>
            <th className="px-4 py-2 whitespace-nowrap">Description</th>
            <th className="px-4 py-2 whitespace-nowrap">Date</th>
            <th className="px-4 py-2 whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((project, index) => (
            <tr key={index} className="border-b last:border-none">
              <td className="px-4 py-2">{project.name}</td>
              <td className="px-4 py-2">{project.budget}</td>
              <td className="px-4 py-2">{project.description}</td>
              <td className="px-4 py-2">{project.date}</td>
              <td className="px-4 py-2 text-green-500 font-medium">
                {project.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Activitytable;

// import React from "react";

// function Activitytable() {
//   const data = [
//     {
//       name: "Project 1",
//       budget: "$796",
//       description: "Lorem Ipsum is....",
//       date: "28 Jan 2024",
//       status: "Completed",
//     },
//     // Repeat 4 more identical records
//     {
//       name: "Project 1",
//       budget: "$796",
//       description: "Lorem Ipsum is....",
//       date: "28 Jan 2024",
//       status: "Completed",
//     },
//     {
//       name: "Project 1",
//       budget: "$796",
//       description: "Lorem Ipsum is....",
//       date: "28 Jan 2024",
//       status: "Completed",
//     },
  
//   ];

//   return (
//     <div className="bg-white p-4 rounded-xl shadow w-[550px] h-[250px] flex flex-col overflow-auto">
//       <h3 className="text-base font-semibold text-gray-800 mb-4">Activity</h3>
//       <table className="w-full text-sm text-left text-gray-700">
//         <thead className="text-xs text-gray-500 border-b">
//           <tr>
//             <th className="px-4 py-2">Project name</th>
//             <th className="px-4 py-2">Budgets</th>
//             <th className="px-4 py-2">Description</th>
//             <th className="px-4 py-2">Date</th>
//             <th className="px-4 py-2">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((project, index) => (
//             <tr key={index} className="border-b last:border-none">
//               <td className="px-4 py-2">{project.name}</td>
//               <td className="px-4 py-2">{project.budget}</td>
//               <td className="px-4 py-2">{project.description}</td>
//               <td className="px-4 py-2">{project.date}</td>
//               <td className="px-4 py-2 text-green-500 font-medium">
//                 {project.status}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Activitytable;
