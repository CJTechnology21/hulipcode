import React from "react";
import { MdEdit, MdClose } from "react-icons/md";

const formatDate = (date) => {
  if (!date) return "--";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function RFQInfoBanner({
  deliveryLocation = "",
  biddingStartDate,
  biddingEndDate,
  deliveryDate,
  onClose,
  openModal,
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      {/* RFQ Items */}
      <div className="flex flex-wrap gap-3">
        {[
          {
            label: "RFQ Date",
            value: <span className="font-semibold">{formatDate(new Date())}</span>,
          },
          {
            label: "Bidding Start Date",
            value: formatDate(biddingStartDate),
            onEdit: () => openModal("bidding_start_date"),
          },
          {
            label: "Bidding End Date",
            value: formatDate(biddingEndDate),
            onEdit: () => openModal("bidding_end_date"),
          },
          {
            label: "Delivery Location",
            value: (
              <span className="text-gray-800 font-medium">
                {deliveryLocation}
              </span>
            ),
          },
          {
            label: "Delivery Date",
            value: formatDate(deliveryDate),
            onEdit: () => openModal("delivery_date"),
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-md flex items-center gap-2 text-sm text-gray-700"
          >
            <span className="font-medium">{item.label}:</span>
            {item.value}
            {item.onEdit && (
              <MdEdit
                className="text-red-500 text-sm cursor-pointer"
                onClick={item.onEdit}
              />
            )}
          </div>
        ))}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="border border-gray-300 rounded-md p-2 hover:bg-red-50"
      >
        <MdClose className="text-red-600 text-lg" />
      </button>
    </div>
  );
}

// import React from "react";
// import { MdEdit, MdClose } from "react-icons/md";
// const formatDate = (date) => {
//   if (!date) return "--";
//   const d = new Date(date);
//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0"); // Correct
//   const year = d.getFullYear();
//   return `${day}-${month}-${year}`;
// };

// export default function RFQInfoBanner({
//   rfqNo = "#12–16",
//   rfqDate = "24–07–2025",
//   deliveryLocation = "",
//   biddingStartDate,
//   biddingEndDate,
//   deliveryDate,
//   onClose,
//   openModal,
// }) {
//   return (
//     <div className="flex flex-wrap items-start justify-between gap-4">
//       {/* RFQ Items */}
//       <div className="flex flex-wrap gap-3">
//         {[
//           {
//             label: "RFQ No.",
//             value: <span className="text-red-600 font-semibold">{rfqNo}</span>,
//           },
//           {
//             label: "RFQ Date",
//             value: <span className="font-semibold">{rfqDate}</span>,
//           },
//           {
//             label: "Bidding Start Date",
//             value: formatDate(biddingStartDate),
//             onEdit: () => openModal("bidding_start_date"),
//           },
//           {
//             label: "Bidding End Date",
//             value: formatDate(biddingEndDate),
//             onEdit: () => openModal("bidding_end_date"),
//           },
//           {
//             label: "Delivery Location",
//             value: (
//               <span className="text-gray-800 font-medium">
//                 {deliveryLocation}
//               </span>
//             ),
//           },
//           {
//             label: "Delivery Date",
//             value: formatDate(deliveryDate),
//             onEdit: () => openModal("delivery_date"),
//           },
//         ].map((item, idx) => (
//           <div
//             key={idx}
//             className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-md flex items-center gap-2 text-sm text-gray-700"
//           >
//             <span className="font-medium">{item.label}:</span>
//             {item.value}
//             {item.onEdit && (
//               <MdEdit
//                 className="text-red-500 text-sm cursor-pointer"
//                 onClick={item.onEdit}
//               />
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Close Button */}
//       <button
//         onClick={onClose}
//         className="border border-gray-300 rounded-md p-2 hover:bg-red-50"
//       >
//         <MdClose className="text-red-600 text-lg" />
//       </button>
//     </div>
//   );
// }
