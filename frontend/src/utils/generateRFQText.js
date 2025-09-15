// src/utils/generateRFQText.js
export const generateRFQText = ({
  project,
  deliveryLocation,
  biddingStartDate,
  biddingEndDate,
  deliveryDate,
  selectedMaterials,
  terms,
}) => {
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN") : "N/A";

  // make sure we always have an array
  const materialsArray = Array.isArray(selectedMaterials)
    ? selectedMaterials
    : [];

  const materialList =
    materialsArray.length > 0
      ? materialsArray
          .map(
            (mat, i) =>
              `${i + 1}. ${mat.name || "Unnamed"} - ${
                mat.quantity || "N/A"
              } ${mat.unit || ""} (Delivery: ${
                mat.deliveryDate ? formatDate(mat.deliveryDate) : "N/A"
              })`
          )
          .join("\n")
      : "No materials listed";

  return `
📄 *Request for Quotation (RFQ)*

📌 *Project:* ${project || "N/A"}
📍 *Delivery Location:* ${deliveryLocation || "N/A"}
📅 *Bidding Start:* ${formatDate(biddingStartDate)}
📅 *Bidding End:* ${formatDate(biddingEndDate)}
🚚 *Delivery Date:* ${formatDate(deliveryDate)}

📦 *Materials Required:*
${materialList}

📝 *Terms & Conditions:*
${terms || "Standard site terms apply."}

Please send your best quotation by *${formatDate(biddingEndDate)}*.  
Include all applicable taxes, transport charges, and delivery timelines.

Regards,  
Huelip  
[Your Company]  
[Contact Info]
  `;
};

// // src/utils/generateRFQText.js

// export const generateRFQText = ({
//   project,
//   deliveryLocation,
//   biddingStartDate,
//   biddingEndDate,
//   deliveryDate,
//   selectedMaterials,
//   terms,
// }) => {
//   const formatDate = (d) =>
//     d ? new Date(d).toLocaleDateString("en-IN") : "N/A";

//   const materialList = selectedMaterials
//     .map(
//       (mat, i) =>
//         `${i + 1}. ${mat.name} - ${mat.quantity || "N/A"} ${mat.unit || ""} (Delivery: ${
//           mat.deliveryDate ? formatDate(mat.deliveryDate) : "N/A"
//         })`
//     )
//     .join("\n");

//   return `
// 📄 *Request for Quotation (RFQ)*

// 📌 *Project:* ${project}
// 📍 *Delivery Location:* ${deliveryLocation}
// 📅 *Bidding Start:* ${formatDate(biddingStartDate)}
// 📅 *Bidding End:* ${formatDate(biddingEndDate)}
// 🚚 *Delivery Date:* ${formatDate(deliveryDate)}

// 📦 *Materials Required:*
// ${materialList || "No materials listed"}

// 📝 *Terms & Conditions:*
// ${terms || "Standard site terms apply."}

// Please send your best quotation by *${formatDate(biddingEndDate)}*.  
// Include all applicable taxes, transport charges, and delivery timelines.

// Regards,  
// Huelip 
// [Your Company]  
// [Contact Info]
//   `;
// };
