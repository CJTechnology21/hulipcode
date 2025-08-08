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

  const materialList = selectedMaterials
    .map(
      (mat, i) =>
        `${i + 1}. ${mat.name} - ${mat.quantity || "N/A"} ${mat.unit || ""} (Delivery: ${
          mat.deliveryDate ? formatDate(mat.deliveryDate) : "N/A"
        })`
    )
    .join("\n");

  return `
📄 *Request for Quotation (RFQ)*

📌 *Project:* ${project}
📍 *Delivery Location:* ${deliveryLocation}
📅 *Bidding Start:* ${formatDate(biddingStartDate)}
📅 *Bidding End:* ${formatDate(biddingEndDate)}
🚚 *Delivery Date:* ${formatDate(deliveryDate)}

📦 *Materials Required:*
${materialList || "No materials listed"}

📝 *Terms & Conditions:*
${terms || "Standard site terms apply."}

Please send your best quotation by *${formatDate(biddingEndDate)}*.  
Include all applicable taxes, transport charges, and delivery timelines.

Regards,  
[Your Name]  
[Your Company]  
[Contact Info]
  `;
};
