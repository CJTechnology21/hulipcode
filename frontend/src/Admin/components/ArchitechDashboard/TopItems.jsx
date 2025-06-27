import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';

const cards = [
  { title: "Completed Projects", value: "120", bg: "bg-green-600", color: "text-green-600" },
  { title: "Pending Projects", value: "40", bg: "bg-blue-600", color: "text-blue-600" },
  { title: "Total Projects", value: "541", bg: "bg-red-600", color: "text-red-600" },
  { title: "Assigned Projects", value: "1500", bg: "bg-purple-600", color: "text-purple-600" },
];

const TopItems = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {cards.map((card, idx) => (
      <div
        key={idx}
        className={`p-4 text-white rounded shadow-md ${card.bg} flex items-center gap-4`}
      >
        <div className="bg-white p-2 rounded-full">
          <FiBarChart2 size={20} className={`${card.color}`} />
        </div>
        <div>
          <h4 className="text-sm">{card.title}</h4>
          <p className="text-xl font-bold">{card.value}</p>
        </div>
      </div>
    ))}
  </div>
);

export default TopItems;

// import React from 'react';

// const cards = [
//   { title: "Completed Projects", value: "120", bg: "bg-green-600" },
//   { title: "Pending Projects", value: "40", bg: "bg-blue-600" },
//   { title: "Total Projects", value: "541", bg: "bg-red-600" },
//   { title: "Assigned Projects", value: "1500", bg: "bg-purple-600" },
// ];

// const TopItems = () => (
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//     {cards.map((card, idx) => (
//       <div key={idx} className={`p-4 text-white rounded ${card.bg}`}>
//         <h4 className="text-sm">{card.title}</h4>
//         <p className="text-xl font-bold">{card.value}</p>
//       </div>
//     ))}
//   </div>
// );

// export default TopItems;
