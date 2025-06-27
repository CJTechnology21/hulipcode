
import React from "react";
import yellow_sofa from "../../images/yellowsofa.png";

const Suggest = () => {
  const suggestions = [
    {
      img: "https://picsum.photos/seed/item1/100/100",
      text: "Lorem Ipsum is simply dummy text of the printing",
    },
    {
      img: "https://picsum.photos/seed/item2/100/100",
      text: "Lorem Ipsum is simply dummy text of the printing",
    },
    {
      img: "https://picsum.photos/seed/item3/100/100",
      text: "Lorem Ipsum is simply dummy text of the printing",
    },
    {
      img: "https://picsum.photos/seed/item4/100/100",
      text: "Lorem Ipsum is simply dummy text of the printing",
    },
  ];

  return (
    <div className="bg-white p-4 md:p-10 font-figtree">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 p-2">
        Lorem Ipsum is simply dummy text of the printing
      </h2>

      <div className="grid md:grid-cols-3 gap-4 p-10">
        {/* Left side with yellow sofa and caption */}
        <div className="md:col-span-2 flex flex-col items-center">
          {/* Image section */}
          <div className="bg-blue-500 w-full flex justify-center items-center rounded-t-xl p-6">
            <img
              src={yellow_sofa}
              alt="Featured"
              className="max-h-[300px] object-contain"
            />
          </div>

          {/* Caption below image */}
          <div className="bg-gray-100 w-full text-center py-6 border border-dashed border-gray-300 rounded-b-xl text-lg md:text-xl font-semibold">
            Lorem Ipsum is simply dummy text of the printing
          </div>
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="flex rounded shadow border overflow-hidden"
            >
              {/* Left: Image with blue background */}
              <div className="bg-blue-500 p-2 flex items-center justify-center">
                <img
                  src={item.img}
                  alt={`suggestion-${index}`}
                  className="w-16 h-16 object-cover"
                />
              </div>

              {/* Right: Text with gray background */}
              <div className="bg-gray-200 flex-1 px-4 py-2 flex items-center">
                <p className="text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suggest;
// import React from "react";
// import yellow_sofa from "../../images/yellowsofa.png";

// const Suggest = () => {
//   const suggestions = [
//     {
//       img: "https://picsum.photos/seed/item1/100/100",
//       text: "Lorem Ipsum is simply dummy text of the printing",
//     },
//     {
//       img: "https://picsum.photos/seed/item2/100/100",
//       text: "Lorem Ipsum is simply dummy text of the printing",
//     },
//     {
//       img: "https://picsum.photos/seed/item3/100/100",
//       text: "Lorem Ipsum is simply dummy text of the printing",
//     },
//     {
//       img: "https://picsum.photos/seed/item4/100/100",
//       text: "Lorem Ipsum is simply dummy text of the printing",
//     },
//   ];

//   return (
//     <div className="bg-white p-4 md:p-10 font-figtree">
//       <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 p-2">
//         Lorem Ipsum is simply dummy text of the printing
//       </h2>

//       <div className="grid md:grid-cols-3 gap-4 p-10">
//         {/* Left side with yellow sofa and caption */}
//         <div className="md:col-span-2 flex flex-col items-center">
//           {/* Image section */}
//           <div className="bg-blue-500 w-full flex justify-center items-center rounded-t-xl p-6">
//             <img
//               src={yellow_sofa}
//               alt="Featured"
//               className="max-h-[300px] object-contain"
//             />
//           </div>

//           {/* Caption below image */}
//           <div className="bg-gray-100 w-full text-center py-6 border border-dashed border-gray-300 rounded-b-xl text-lg md:text-xl font-semibold">
//             Lorem Ipsum is simply dummy text of the printing
//           </div>
//         </div>
// {/* 
//         Suggestions List */}
//         <div className="space-y-4">
//           {suggestions.map((item, index) => (
//             <div
//               key={index}
//               className="flex items-center bg-white rounded shadow border"
//             >
//               <div className="flex rounded shadow  overflow-hidden">
//                 {/* Left: Image with blue background */}
//                 <div className="bg-blue-500 p-2 flex items-center justify-center">
//                   <img
//                     src={item.img}
//                     alt={`suggestion-${index}`}
//                     className="w-16 h-16 object-cover"
//                   />
//                 </div>

//                 {/* Right: Text with gray background */}
//                 <div className="bg-gray-200 flex-1 px-4 py-2 flex items-center">
//                   <p className="text-sm">{item.text}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Suggest;
