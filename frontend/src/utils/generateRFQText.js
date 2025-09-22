export const generateRFQText = ({
  project,
  deliveryLocation,
  biddingStartDate,
  biddingEndDate,
  deliveryDate,
  selectedMaterials,
  terms,
  rfqId,
}) => {
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "N/A");

  const materialsArray = Array.isArray(selectedMaterials) ? selectedMaterials : [];

  const materialList =
    materialsArray.length > 0
      ? materialsArray
          .map(
            (mat, i) =>
              `${i + 1}. ${mat.name || "Unnamed"} - ${mat.quantity || "N/A"} ${mat.unit || ""} (Delivery: ${
                mat.deliveryDate ? formatDate(mat.deliveryDate) : "N/A"
              })`
          )
          .join("\n")
      : "No materials listed";

  const responseLink = `https://first-task-alpha.vercel.app/responses/${rfqId}`;

  return `
📄 *Request for Quotation (RFQ)*

📌 *Project:* ${project || "N/A"}
📍 *Delivery Location:* ${deliveryLocation || "N/A"}
📅 *Bidding Start:* ${formatDate(biddingStartDate)}
📅 *Bidding End:* ${formatDate(biddingEndDate)}
🚚 *Delivery Date:* ${formatDate(deliveryDate)}

📦 *Materials Required:*
${materialList}

📝 *Terms & Conditions:* ${terms || "Standard site terms apply."}

Please send your best quotation by *${formatDate(biddingEndDate)}*.  
Include all applicable taxes, transport charges, and delivery timelines.

💻 Respond here: ${responseLink}

Regards,  
Huelip  
[Your Company]  
[Contact Info]
  `;
};

//old one which was working for one supplier
// // src/utils/generateRFQText.js
// export const generateRFQText = ({
//   project,
//   deliveryLocation,
//   biddingStartDate,
//   biddingEndDate,
//   deliveryDate,
//   selectedMaterials,
//   terms,
//   rfqId, // add this
// }) => {
//   const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "N/A");

//   const materialsArray = Array.isArray(selectedMaterials) ? selectedMaterials : [];

//   const materialList =
//     materialsArray.length > 0
//       ? materialsArray
//           .map(
//             (mat, i) =>
//               `${i + 1}. ${mat.name || "Unnamed"} - ${mat.quantity || "N/A"} ${mat.unit || ""} (Delivery: ${mat.deliveryDate ? formatDate(mat.deliveryDate) : "N/A"})`
//           )
//           .join("\n")
//       : "No materials listed";

//   const responseLink = `https://first-task-alpha.vercel.app/responses/${rfqId}`;

//   return `
// 📄 *Request for Quotation (RFQ)*

// 📌 *Project:* ${project || "N/A"}
// 📍 *Delivery Location:* ${deliveryLocation || "N/A"}
// 📅 *Bidding Start:* ${formatDate(biddingStartDate)}
// 📅 *Bidding End:* ${formatDate(biddingEndDate)}
// 🚚 *Delivery Date:* ${formatDate(deliveryDate)}

// 📦 *Materials Required:*
// ${materialList}

// 📝 *Terms & Conditions:* ${terms || "Standard site terms apply."}

// Please send your best quotation by *${formatDate(biddingEndDate)}*.  
// Include all applicable taxes, transport charges, and delivery timelines.

// 💻 Respond here: ${responseLink}

// Regards,  
// Huelip  
// [Your Company]  
// [Contact Info]
//   `;
// };
