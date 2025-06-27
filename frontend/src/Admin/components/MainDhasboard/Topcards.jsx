import React from 'react';

const cards = [
  { title: "Total Earning", value: "$21,472", bg: "bg-green-600" },
  { title: "Total Services", value: "134", bg: "bg-blue-600" },
  { title: "Total Booking", value: "720", bg: "bg-yellow-600" },
  { title: "Total Products", value: "56", bg: "bg-red-600" },
  { title: "Client Count", value: "248", bg: "bg-purple-600" },
];

const TopCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {cards.map((card, idx) => (
      <div key={idx} className={`p-4 text-white rounded ${card.bg}`}>
        <h4 className="text-sm">{card.title}</h4>
        <p className="text-xl font-bold">{card.value}</p>
      </div>
    ))}
  </div>
);

export default TopCards;

// import React from 'react';

  // const cards = [
  //   { title: "Total Earning", value: "$21,472", bg: "bg-green-600" },
  //   { title: "Total Services", value: "134", bg: "bg-blue-600" },
  //   { title: "Total Booking", value: "720", bg: "bg-yellow-600" },
  //   { title: "Total Products", value: "56", bg: "bg-red-600" },
  //   { title: "Client Count", value: "248", bg: "bg-purple-600" },
  // ];

  // const TopCards = () => (
  //   <div className="grid grid-cols-5 gap-4">
  //     {cards.map((card, idx) => (
  //       <div key={idx} className={`p-4 text-white rounded ${card.bg}`}>
  //         <h4 className="text-sm">{card.title}</h4>
  //         <p className="text-xl font-bold">{card.value}</p>
  //       </div>
  //     ))}
  //   </div>
  // );

  // export default TopCards;
