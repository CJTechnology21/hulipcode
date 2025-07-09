import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const downloadExpandedRowPDF = async ({
  elementId,
  filename = "Huelip_Report.pdf",
  firmDetails = {
    name: "Huelip Agencies",
    address: "South Ex Part 2, New Delhi - 110066",
    contact: "+91 98765 43210",
    email: "info@redbricks.com",
  },
}) => {
  const node = document.getElementById(elementId);
  if (!node) return;

  const clonedNode = node.cloneNode(true);

  // ====================
  // 🧾 Add Custom Header
  // ====================
  const now = new Date();
  const dateTime = now.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const header = document.createElement("div");
  header.innerHTML = `
    <div style="
      display: flex;
      justify-content: space-between;
      padding: 16px 24px;
      font-family: 'Segoe UI', sans-serif;
      background-color: #F9FAFB;
      border-bottom: 2px solid #B91C1C;
    ">
      <div>
        <h1 style="margin: 0; color: #B91C1C; font-size: 20px;">${firmDetails.name}</h1>
        <p style="margin: 2px 0; font-size: 13px; color: #1F2937;">${firmDetails.address}</p>
        <p style="margin: 2px 0; font-size: 13px; color: #1F2937;">Contact: ${firmDetails.contact} | Email: ${firmDetails.email}</p>
      </div>
      <div style="font-size: 12px; color: #555;">${dateTime}</div>
    </div>
  `;
  clonedNode.prepend(header);

  // ======================
  // 🎨 Apply Styling
  // ======================
  clonedNode.style.fontFamily = "'Segoe UI', sans-serif";
  clonedNode.style.fontSize = "13px";
  clonedNode.style.padding = "24px";
  clonedNode.style.background = "#ffffff";
  clonedNode.style.color = "#1F2937";
  clonedNode.style.boxSizing = "border-box";
  clonedNode.style.width = "900px";

  // Room Headers
  clonedNode.querySelectorAll("h3").forEach((h) => {
    h.style.backgroundColor = "#B91C1C";
    h.style.fontSize = "13px";
    h.style.color = "white";
    h.style.padding = "4px 10px";
    h.style.borderRadius = "8px";
    h.style.marginBottom = "6px";
    h.style.display = "inline-block";
  });

  // Section Title
  const sectionTitle = clonedNode.querySelector("h2");
  if (sectionTitle) {
    sectionTitle.style.backgroundColor = "#B91C1C";
    sectionTitle.style.color = "#fff";
    sectionTitle.style.padding = "6px 16px";
    sectionTitle.style.fontSize = "16px";
    sectionTitle.style.borderRadius = "999px";
    sectionTitle.style.marginBottom = "20px";
    sectionTitle.style.display = "inline-block";
  }

  // Underline the ul section
  const ul = clonedNode.querySelector("ul");
  if (ul) {
    ul.style.borderBottom = "1px solid #E5E7EB";
    ul.style.paddingBottom = "12px";
    ul.style.marginBottom = "20px";
  }

  // ============================
  // 📸 Canvas + PDF Preparation
  // ============================
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.style.background = "#fff";
  container.style.padding = "30px";
  container.appendChild(clonedNode);
  document.body.appendChild(container);

  const canvas = await html2canvas(clonedNode, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "pt", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pageWidth - 60; // Left-right padding
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let position = 30;
  let heightLeft = imgHeight;
  let pageCount = 0;

  // ==========================
  // 🖨️ Render Pages
  // ==========================
  while (heightLeft > 0) {
    pageCount++;
    if (pageCount > 1) pdf.addPage();

    drawPageBorder(pdf);
    pdf.addImage(imgData, "PNG", 30, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;
  }

  // =====================
  // 📌 Add Page Numbers
  // =====================
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.setTextColor("#999999");
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 60, pageHeight - 20);
  }

  pdf.save(filename);
  document.body.removeChild(container);
};

// ✅ Elegant Page Border
function drawPageBorder(pdf) {
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  pdf.setDrawColor("#B91C1C");
  pdf.setLineWidth(1);
  pdf.rect(15, 15, w - 30, h - 30, "S");
}
// // components/PDFExporter.js
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export const downloadExpandedRowPDF = async ({
//   elementId,
//   filename = "Huelip_Report.pdf",
//   firmDetails = {
//     name: " Huelip Agencies",
//     address: "South Ex Part 2, New Delhi - 110066",
//     contact: "+91 98765 43210",
//     email: "info@redbricks.com",
//   },
// }) => {
//   const node = document.getElementById(elementId);
//   if (!node) return;

//   // Clone node and add firm details
//   const clonedNode = node.cloneNode(true);

//   // Firm Header
//   const header = document.createElement("div");
//   header.innerHTML = `
//     <div style="
//       padding: 16px;
//       margin-bottom: 20px;
//       border-bottom: 2px solid #e3342f;
//       text-align: center;
//     ">
//       <h1 style="color: #e3342f; font-size: 20px; margin: 0;">${firmDetails.name}</h1>
//       <p style="font-size: 12px; color: #555;">${firmDetails.address}</p>
//       <p style="font-size: 12px; color: #555;">Contact: ${firmDetails.contact} | Email: ${firmDetails.email}</p>
//     </div>
//   `;
//   clonedNode.prepend(header);

//   // Add some padding and width
//   clonedNode.style.padding = "40px";
//   clonedNode.style.backgroundColor = "#ffffff";
//   clonedNode.style.width = "800px";

//   // Place off-screen for render
//   const container = document.createElement("div");
//   container.style.position = "absolute";
//   container.style.top = "-10000px";
//   container.appendChild(clonedNode);
//   document.body.appendChild(container);

//   // Convert to canvas
//   const canvas = await html2canvas(clonedNode, { scale: 2, useCORS: true });
//   const imgData = canvas.toDataURL("image/png");

//   const pdf = new jsPDF("p", "pt", "a4");
//   const pageWidth = pdf.internal.pageSize.getWidth();
//   const pageHeight = pdf.internal.pageSize.getHeight();
//   const imgProps = pdf.getImageProperties(imgData);
//   const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

//   let y = 40;

//   if (imgHeight < pageHeight) {
//     // Single page
//     pdf.addImage(imgData, "PNG", 40, y, pageWidth - 80, imgHeight);
//   } else {
//     // Multi-page
//     let position = 0;
//     while (position < imgHeight) {
//       pdf.addImage(imgData, "PNG", 40, y, pageWidth - 80, imgHeight, undefined, "FAST");
//       position += pageHeight - 80;
//       if (position < imgHeight) {
//         pdf.addPage();
//         y = 40;
//       }
//     }
//   }

//   pdf.save(filename);
//   document.body.removeChild(container);
// };
