
import React from 'react';

const Ideas = () => {
  const sections = [
    {
      title: 'Room Ideas',
      images: [
        'https://picsum.photos/seed/room1/300/200',
        'https://picsum.photos/seed/room2/300/200',
        'https://picsum.photos/seed/room3/300/200',
        'https://picsum.photos/seed/room4/300/200',
      ],
    },
    {
      title: 'Home Tours',
      images: [
        'https://picsum.photos/seed/tour1/300/200',
        'https://picsum.photos/seed/tour2/300/200',
        'https://picsum.photos/seed/tour3/300/200',
        'https://picsum.photos/seed/tour4/300/200',
      ],
    },
    {
      title: 'Real Estate',
      images: [
        'https://picsum.photos/seed/estate1/300/200',
        'https://picsum.photos/seed/estate2/300/200',
        'https://picsum.photos/seed/estate3/300/200',
        'https://picsum.photos/seed/estate4/300/200',
      ],
    },
  ];

  return (
    <div className="bg-white px-4 py-10 font-figtree">
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-10">
        Lorem Ipsum is simply dummy text of the printing
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="border border-black p-4 rounded-lg space-y-6"
          >
            <h3 className="text-xl font-semibold text-center mb-4">{section.title}</h3>
            {section.images.map((src, i) => (
              <div
                key={i}
                className="flex items-center bg-gray-100 p-4 rounded-md shadow-sm gap-4"
              >
                <img
                  src={src}
                  alt={`${section.title} ${i + 1}`}
                  className="w-24 h-24 object-cover rounded"
                />
                <p className="text-sm font-medium">
                  Lorem Ipsum is simply dummy text of the printing
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ideas;
// import React from 'react';

// const Ideas = () => {
//   const sections = [
//     {
//       title: 'Room Ideas',
//       images: [
//         'https://picsum.photos/seed/room1/300/200',
//         'https://picsum.photos/seed/room2/300/200',
//         'https://picsum.photos/seed/room3/300/200',
//         'https://picsum.photos/seed/room4/300/200',
//       ],
//     },
//     {
//       title: 'Home Tours',
//       images: [
//         'https://picsum.photos/seed/tour1/300/200',
//         'https://picsum.photos/seed/tour2/300/200',
//         'https://picsum.photos/seed/tour3/300/200',
//         'https://picsum.photos/seed/tour4/300/200',
//       ],
//     },
//     {
//       title: 'Real Estate',
//       images: [
//         'https://picsum.photos/seed/estate1/300/200',
//         'https://picsum.photos/seed/estate2/300/200',
//         'https://picsum.photos/seed/estate3/300/200',
//         'https://picsum.photos/seed/estate4/300/200',
//       ],
//     },
//   ];

//   return (
//     <div className="px-4 py-10 bg-gray-100 font-figtree">
//       <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-10">
//         Lorem Ipsum is simply dummy text of the printing
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {sections.map((section, idx) => (
//           <div key={idx} className="space-y-6">
//             <h3 className="text-xl font-medium text-center">{section.title}</h3>
//             {section.images.map((src, i) => (
//               <div
//                 key={i}
//                 className="flex items-center bg-white p-3 rounded-lg shadow-sm gap-4"
//               >
//                 <img
//                   src={src}
//                   alt={`${section.title} ${i + 1}`}
//                   className="w-24 h-24 object-cover rounded-md"
//                 />
//                 <p className="text-sm font-medium">
//                   Lorem Ipsum is simply dummy text of the printing
//                 </p>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Ideas;
