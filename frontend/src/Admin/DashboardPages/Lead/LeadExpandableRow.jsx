import React from "react";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";

export default function LeadExpandableRow({ lead, expandedRow }) {
  const navigate = useNavigate();

  // ✅ Match against MongoDB _id instead of id
  if (expandedRow !== lead._id) return null;

  const rooms = [
    {
      name: "Bedroom 1",
      length: "15ft",
      breadth: "12ft",
      height: "9ft",
      images: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgLITjr8hsJKugu9L1AWXL6dNCivvJkyBBng&s",
        "https://www.bocadolobo.com/en/inspiration-and-ideas/wp-content/uploads/2023/09/Indulge-In-Opulence-50-Luxurious-Bedroom-Decor-Ideas-1-1024x788.jpg",
        "https://blog.displate.com/wp-content/uploads/2022/02/Aesthetic-Bedroom-Ideas_65.jpg",
      ],
    },
    {
      name: "Bedroom 2",
      length: "15ft",
      breadth: "12ft",
      height: "9ft",
      images: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgLITjr8hsJKugu9L1AWXL6dNCivvJkyBBng&s",
        "https://www.bocadolobo.com/en/inspiration-and-ideas/wp-content/uploads/2023/09/Indulge-In-Opulence-50-Luxurious-Bedroom-Decor-Ideas-1-1024x788.jpg",
        "https://blog.displate.com/wp-content/uploads/2022/02/Aesthetic-Bedroom-Ideas_65.jpg",
      ],
    },
    {
      name: "Toilet",
      length: "6ft",
      breadth: "8ft",
      height: "9ft",
      images: [
        "https://assets-news.housing.com/news/wp-content/uploads/2022/06/06030504/bidet-toilets-feature-compressed.jpg",
        "https://www.health.com/thmb/MnccL5eKVNvGuk5l32Gq9zcACqI=/723x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1052952224-08aeddea3bae4dce835bc3a48d14d676.jpg",
      ],
    },
  ];

  return (
    <tr>
      <td colSpan="12" className="bg-white p-4">
        <div id={`expandable-row-${lead._id}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Site Details */}
            <div className="text-sm font-semibold text-black">
              <h2 className="bg-red-600 text-white px-3 py-1 rounded-full inline-block mb-3">
                Site Details
              </h2>
              <ul className="space-y-1">
                <li><strong>Location</strong>: South Ex Part 2, Delhi</li>
                <li><strong>Pincode</strong>: 110066</li>
                <li><strong>Project Type</strong>: 1BHK Floor</li>
                <li><strong>Project Floor</strong>: 3rd Floor</li>
                <li>
                  <strong>Current Condition</strong>: Needs renovation, Pipes are all damaged, Electrical Failures, Client feels Old
                </li>
                <li>
                  <strong>Requirements</strong>: Old but new, kids room, fancy toilet, modular kitchen
                </li>
                <li><strong>Duration of Project</strong>: 6 months</li>
              </ul>

              <div className="mt-14">
                <Button
                  className="bg-red-700 hover:bg-red-800 text-white"
                  variant="custom"
                  onClick={() =>
                    navigate("/quotedetails", {
                      state: {
                        qid: lead._id,
                        clientName: lead.name,
                        isHuelip: lead.isHuelip,
                      },
                    })
                  }
                >
                  See Quote Details
                </Button>
              </div>
            </div>

            {/* Room Details */}
            <div className="space-y-6">
              {rooms.map((room, i) => (
                <div key={i}>
                  <h3 className="bg-red-700 text-white text-xs px-3 py-1 rounded-full inline-block mb-2">
                    {room.name}
                  </h3>
                  <div className="flex justify-between text-xs font-bold text-black mb-2">
                    <span>Length</span>
                    <span>{room.length}</span>
                    <span>Breadth</span>
                    <span>{room.breadth}</span>
                    <span>Height</span>
                    <span>{room.height}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {room.images.map((img, j) => (
                      <img
                        key={j}
                        src={img}
                        alt={`${room.name} ${j + 1}`}
                        className="w-24 h-24 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

// import React from "react";
// import  Button  from "../../../components/Button";
// import { useNavigate } from "react-router-dom";

// export default function LeadExpandableRow({ lead, expandedRow }) {
//   const navigate = useNavigate();

//   if (expandedRow !== lead.id) return null;

//   const rooms = [
//     {
//       name: "Bedroom 1",
//       length: "15ft",
//       breadth: "12ft",
//       height: "9ft",
//       images: [
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgLITjr8hsJKugu9L1AWXL6dNCivvJkyBBng&s",
//         "https://www.bocadolobo.com/en/inspiration-and-ideas/wp-content/uploads/2023/09/Indulge-In-Opulence-50-Luxurious-Bedroom-Decor-Ideas-1-1024x788.jpg",
//         "https://blog.displate.com/wp-content/uploads/2022/02/Aesthetic-Bedroom-Ideas_65.jpg",
//       ],
//     },
//     {
//       name: "Bedroom 2",
//       length: "15ft",
//       breadth: "12ft",
//       height: "9ft",
//       images: [
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgLITjr8hsJKugu9L1AWXL6dNCivvJkyBBng&s",
//         "https://www.bocadolobo.com/en/inspiration-and-ideas/wp-content/uploads/2023/09/Indulge-In-Opulence-50-Luxurious-Bedroom-Decor-Ideas-1-1024x788.jpg",
//         "https://blog.displate.com/wp-content/uploads/2022/02/Aesthetic-Bedroom-Ideas_65.jpg",
//       ],
//     },
//     {
//       name: "Toilet",
//       length: "6ft",
//       breadth: "8ft",
//       height: "9ft",
//       images: [
//         "https://assets-news.housing.com/news/wp-content/uploads/2022/06/06030504/bidet-toilets-feature-compressed.jpg",
//         "https://www.health.com/thmb/MnccL5eKVNvGuk5l32Gq9zcACqI=/723x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1052952224-08aeddea3bae4dce835bc3a48d14d676.jpg",
//       ],
//     },
//   ];

//   return (
//     <tr>
//       <td colSpan="12" className="bg-white p-4">
//         <div id={`expandable-row-${lead.id}`}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* Site Details */}
//             <div className="text-sm font-semibold text-black">
//               <h2 className="bg-red-600 text-white px-3 py-1 rounded-full inline-block mb-3">
//                 Site Details
//               </h2>
//               <ul className="space-y-1">
//                 <li><strong>Location</strong>: South Ex Part 2, Delhi</li>
//                 <li><strong>Pincode</strong>: 110066</li>
//                 <li><strong>Project Type</strong>: 1BHK Floor</li>
//                 <li><strong>Project Floor</strong>: 3rd Floor</li>
//                 <li>
//                   <strong>Current Condition</strong>: Needs renovation, Pipes are all damaged, Electrical Failures, Client feels Old
//                 </li>
//                 <li>
//                   <strong>Requirements</strong>: Old but new, kids room, fancy toilet, modular kitchen
//                 </li>
//                 <li><strong>Duration of Project</strong>: 6 months</li>
//               </ul>

//               <div className="mt-14">
//                 <Button
//                   className="bg-red-700 hover:bg-red-800 text-white"
//                   variant="custom"
//                   onClick={() =>
//                     navigate("/quotedetails", {
//                       state: {
//                         qid: lead.id,
//                         clientName: lead.name,
//                         isHuelip: lead.isHuelip,
//                       },
//                     })
//                   }
//                 >
//                   See Quote Details
//                 </Button>
//               </div>
//             </div>

//             {/* Room Details */}
//             <div className="space-y-6">
//               {rooms.map((room, i) => (
//                 <div key={i}>
//                   <h3 className="bg-red-700 text-white text-xs px-3 py-1 rounded-full inline-block mb-2">
//                     {room.name}
//                   </h3>
//                   <div className="flex justify-between text-xs font-bold text-black mb-2">
//                     <span>Length</span>
//                     <span>{room.length}</span>
//                     <span>Breadth</span>
//                     <span>{room.breadth}</span>
//                     <span>Height</span>
//                     <span>{room.height}</span>
//                   </div>
//                   <div className="grid grid-cols-3 gap-2">
//                     {room.images.map((img, j) => (
//                       <img
//                         key={j}
//                         src={img}
//                         alt={`${room.name} ${j + 1}`}
//                         className="w-24 h-24 object-cover rounded-md border"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </td>
//     </tr>
//   );
// }
