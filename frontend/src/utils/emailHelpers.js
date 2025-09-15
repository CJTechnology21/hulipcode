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
  materials: materialsFromPayload, // optional fallback if called with rfqData.materials
  terms,
}) => {
  console.log("📧 Preparing to send RFQ email to:", to_email);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN") : "N/A";

  //  always have an array
  const mats = Array.isArray(selectedMaterials)
    ? selectedMaterials
    : Array.isArray(materialsFromPayload)
      ? materialsFromPayload
      : [];

  const materialsText =
    mats.length > 0
      ? mats
        .map(
          (mat, i) =>
            `${i + 1}. ${mat.name || "Unnamed"} - ${mat.quantity || "N/A"} ${mat.unit || ""
            } (Delivery: ${mat.deliveryDate ? formatDate(mat.deliveryDate) : "N/A"
            })`
        )
        .join("\n")
      : "No materials listed";

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
  };

  console.log("📦 Template Params being sent to EmailJS:", templateParams);

  try {
    return await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
  } catch (error) {
    throw error;
  }
};


// export const sendRFQEmail = async ({
//   to_email,
//   project,
//   deliveryLocation,
//   biddingStartDate,
//   biddingEndDate,
//   deliveryDate,
//   selectedMaterials,
//   terms,
// }) => {
//   console.log("📧 Preparing to send RFQ email to:", to_email);

//   const formatDate = (d) =>
//     d ? new Date(d).toLocaleDateString("en-IN") : "N/A";

//   const materials = selectedMaterials
//     .map(
//       (mat, i) =>
//         `${i + 1}. ${mat.name} - ${mat.quantity || "N/A"} ${mat.unit || ""} (Delivery: ${
//           mat.deliveryDate ? formatDate(mat.deliveryDate) : "N/A"
//         })`
//     )
//     .join("\n");

//   const templateParams = {
//     to_email,
//     from_name: "Procurement Team",
//     reply_to: "userusage04@gmail.com",
//     project_name: project,
//     delivery_location: deliveryLocation,
//     bidding_start: formatDate(biddingStartDate),
//     bidding_end: formatDate(biddingEndDate),
//     delivery_date: formatDate(deliveryDate),
//     materials,
//     terms: terms || "Standard site terms apply.",
//   };

//   console.log("📦 Template Params being sent to EmailJS:", templateParams);

//   try {
//     const response = await emailjs.send(
//       SERVICE_ID,
//       TEMPLATE_ID,
//       templateParams,
//       PUBLIC_KEY
//     );
//     // console.log(" Email sent successfully:", response);
//     return response;
//   } catch (error) {
//     // console.error(" Email send failed:", error);
//     throw error;
//   }
// };

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
//   terms,
// }) => {
//   const formatDate = (d) =>
//     d ? new Date(d).toLocaleDateString("en-IN") : "N/A";

//   const materials = selectedMaterials
//     .map(
//       (mat, i) =>
//         `${i + 1}. ${mat.name} - ${mat.quantity || "N/A"} ${mat.unit || ""} (Delivery: ${
//           mat.deliveryDate ? formatDate(mat.deliveryDate) : "N/A"
//         })`
//     )
//     .join("\n");

//   const templateParams = {
//     to_email,
//     from_name: "Procurement Team",
//     reply_to: "userusage04@gmail.com",
//     bcc: "",
//     cc: "",
//     project_name: project,
//     delivery_location: deliveryLocation,
//     bidding_start: formatDate(biddingStartDate),
//     bidding_end: formatDate(biddingEndDate),
//     delivery_date: formatDate(deliveryDate),
//     materials,
//     terms: terms || "Standard site terms apply.",
//   };

//   try {
//     const response = await emailjs.send(
//       SERVICE_ID,
//       TEMPLATE_ID,
//       templateParams,
//       PUBLIC_KEY
//     );
//     console.log("Email sent successfully:", response);
//     return response;
//   } catch (error) {
//     console.error("Email send failed:", error);
//     throw error;
//   }
// };

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
//   terms,
// }) => {
//   const formatDate = (d) =>
//     d ? new Date(d).toLocaleDateString("en-IN") : "N/A";

//   const materials = selectedMaterials
//     .map(
//       (mat, i) =>
//         `${i + 1}. ${mat.name} - ${mat.quantity || "N/A"} ${mat.unit || ""} (Delivery: ${
//           mat.deliveryDate ? formatDate(mat.deliveryDate) : "N/A"
//         })`
//     )
//     .join("\n");

//   const templateParams = {
//     to_email,
//     project_name: project,
//     delivery_location: deliveryLocation,
//     bidding_start: formatDate(biddingStartDate),
//     bidding_end: formatDate(biddingEndDate),
//     delivery_date: formatDate(deliveryDate),
//     materials,
//     terms: terms || "Standard site terms apply.",
//   };

//   try {
//     const response = await emailjs.send(
//       SERVICE_ID,
//       TEMPLATE_ID,
//       templateParams,
//       PUBLIC_KEY
//     );
//     console.log(" Email sent successfully:", response);
//     return response;
//   } catch (error) {
//     console.error("Email send failed:", error);
//     throw error;
//   }
// };
