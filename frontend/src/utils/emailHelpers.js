// src/utils/emailHelpers.js
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_sjbla2w";
const TEMPLATE_ID = "template_0ydck1d";
const PUBLIC_KEY = "g679iwO06MoDUluAV";

export const sendRFQEmail = async ({
  to_email,
  project,
  deliveryLocation,
  biddingStartDate,
  biddingEndDate,
  deliveryDate,
  selectedMaterials,
  terms,
  rfqId,
}) => {
  console.log("📧 Preparing to send RFQ email to:", to_email);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "N/A");

  // Prepare materials list
  const mats = Array.isArray(selectedMaterials) ? selectedMaterials : [];
  const materialsText =
    mats.length > 0
      ? mats
          .map(
            (mat, i) =>
              `${i + 1}. ${mat.name || "Unnamed"} - ${mat.quantity || "N/A"} ${mat.unit || ""} (Delivery: ${
                mat.deliveryDate ? formatDate(mat.deliveryDate) : "N/A"
              })`
          )
          .join("\n")
      : "No materials listed";

  // Response link
  const responseLink = `https://first-task-alpha.vercel.app/responses/${rfqId}`;

  // Full RFQ message for text-only templates
  const rfqMessage = `
📄 Request for Quotation (RFQ)

📌 Project: ${project || "N/A"}
📍 Delivery Location: ${deliveryLocation || "N/A"}
📅 Bidding Start: ${formatDate(biddingStartDate)}
📅 Bidding End: ${formatDate(biddingEndDate)}
🚚 Delivery Date: ${formatDate(deliveryDate)}

📦 Materials Required:
${materialsText}

📝 Terms & Conditions:
${terms || "Standard site terms apply."}

💻 Respond here: ${responseLink}

Regards,
Procurement Team
`;

  // EmailJS template params
  const templateParams = {
    to_email,
    from_name: "Procurement Team",
    reply_to: "userusage04@gmail.com",
    project_name: project || "N/A",
    delivery_location: deliveryLocation || "N/A",
    bidding_start: formatDate(biddingStartDate),
    bidding_end: formatDate(biddingEndDate),
    delivery_date: formatDate(deliveryDate),
    materials: materialsText,
    terms: terms || "Standard site terms apply.",
    rfq_link: responseLink, // plain URL for text-only templates
    rfq_link_html: `<a href="${responseLink}" target="_blank">Click here to respond</a>`, // HTML clickable link
    message: rfqMessage, // full message for templates using a single variable
  };

  console.log("📦 Template Params being sent to EmailJS:", templateParams);

  try {
    return await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
  } catch (error) {
    console.error("Error sending RFQ email:", error);
    throw error;
  }
};

// import emailjs from "@emailjs/browser";

// const SERVICE_ID = "service_sjbla2w";
// const TEMPLATE_ID = "template_0ydck1d";
// const PUBLIC_KEY = "g679iwO06MoDUluAV";
// export const sendRFQEmail = async ({
//   to_email,
//   project,
//   deliveryLocation,
//   biddingStartDate,
//   biddingEndDate,
//   deliveryDate,
//   selectedMaterials,
//   materials: materialsFromPayload, 
//   terms,
// }) => {
//   console.log("📧 Preparing to send RFQ email to:", to_email);

//   const formatDate = (d) =>
//     d ? new Date(d).toLocaleDateString("en-IN") : "N/A";

//   //  always have an array
//   const mats = Array.isArray(selectedMaterials)
//     ? selectedMaterials
//     : Array.isArray(materialsFromPayload)
//       ? materialsFromPayload
//       : [];

//   const materialsText =
//     mats.length > 0
//       ? mats
//         .map(
//           (mat, i) =>
//             `${i + 1}. ${mat.name || "Unnamed"} - ${mat.quantity || "N/A"} ${mat.unit || ""
//             } (Delivery: ${mat.deliveryDate ? formatDate(mat.deliveryDate) : "N/A"
//             })`
//         )
//         .join("\n")
//       : "No materials listed";

//   const templateParams = {
//     to_email,
//     from_name: "Procurement Team",
//     reply_to: "userusage04@gmail.com",
//     project_name: project || "N/A",
//     delivery_location: deliveryLocation || "N/A",
//     bidding_start: formatDate(biddingStartDate),
//     bidding_end: formatDate(biddingEndDate),
//     delivery_date: formatDate(deliveryDate),
//     materials: materialsText,
//     terms: terms || "Standard site terms apply.",
//   };

//   console.log("📦 Template Params being sent to EmailJS:", templateParams);

//   try {
//     return await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
//   } catch (error) {
//     throw error;
//   }
// };

