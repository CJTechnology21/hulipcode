import React, { useState } from "react";
import SideBar from "../SideBar";
import Header from "../Header";

function InvoiceForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copyDetails, setCopyDetails] = useState(false);

  const [billing, setBilling] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gst: "",
  });

  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gst: "",
  });

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceDate: "",
    dueDate: "",
    invoiceType: "",
  });

  const subtotal = 120000;
  const gstAmount = 1000;
  const totalAmount = subtotal + gstAmount;

  const handleCopy = () => {
    setCopyDetails(!copyDetails);
    if (!copyDetails) {
      setShipping({ ...billing });
    } else {
      setShipping({
        name: "",
        email: "",
        phone: "",
        address: "",
        gst: "",
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <SideBar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Add New Invoice"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6 flex flex-col gap-6 font-fredoka">
          <form className="bg-white p-6 rounded-xl shadow-md w-full">
            {/* Bill to User Details */}
            <h2 className="text-lg font-semibold mb-2">Bill to User Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Enter name"
                value={billing.name}
                onChange={(e) =>
                  setBilling({ ...billing, name: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="email"
                placeholder="Enter email"
                value={billing.email}
                onChange={(e) =>
                  setBilling({ ...billing, email: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Enter phone number"
                value={billing.phone}
                onChange={(e) =>
                  setBilling({ ...billing, phone: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Enter address"
                value={billing.address}
                onChange={(e) =>
                  setBilling({ ...billing, address: e.target.value })
                }
                className="border rounded px-3 py-2 col-span-1 sm:col-span-2"
                required
              />
              <input
                type="text"
                placeholder="Enter GST number"
                value={billing.gst}
                onChange={(e) =>
                  setBilling({ ...billing, gst: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
            </div>

            {/* Copy Checkbox */}
            <div className="flex items-center gap-2 my-4">
              <input
                type="checkbox"
                checked={copyDetails}
                onChange={handleCopy}
              />
              <label>Apply some detail to Ship to</label>
            </div>

            {/* Ship to User Details */}
            <h2 className="text-lg font-semibold mb-2">Ship to User Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Enter name"
                value={shipping.name}
                onChange={(e) =>
                  setShipping({ ...shipping, name: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="email"
                placeholder="Enter email"
                value={shipping.email}
                onChange={(e) =>
                  setShipping({ ...shipping, email: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Enter phone number"
                value={shipping.phone}
                onChange={(e) =>
                  setShipping({ ...shipping, phone: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Enter address"
                value={shipping.address}
                onChange={(e) =>
                  setShipping({ ...shipping, address: e.target.value })
                }
                className="border rounded px-3 py-2 col-span-1 sm:col-span-2"
                required
              />
              <input
                type="text"
                placeholder="Enter GST number"
                value={shipping.gst}
                onChange={(e) =>
                  setShipping({ ...shipping, gst: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
            </div>

            {/* Invoice Details */}
            <h2 className="text-lg font-semibold mt-6 mb-2">Invoice Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="date"
                value={invoiceDetails.invoiceDate}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    invoiceDate: e.target.value,
                  })
                }
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="date"
                value={invoiceDetails.dueDate}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    dueDate: e.target.value,
                  })
                }
                className="border rounded px-3 py-2"
                required
              />
              <select
                value={invoiceDetails.invoiceType}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    invoiceType: e.target.value,
                  })
                }
                className="border rounded px-3 py-2"
                required
              >
                <option value="">Select</option>
                <option value="Product">Product</option>
                <option value="Service">Service</option>
              </select>
            </div>

            {/* Amount Summary */}
            <div className="flex justify-start mt-6 gap-8 font-medium text-sm sm:text-base">
              <p>Sub Total: {subtotal.toLocaleString()}</p>
              <p>GST Amount: {gstAmount.toLocaleString()}</p>
              <p>Total Amount: {totalAmount.toLocaleString()}</p>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InvoiceForm;

// import React from "react";
// import SideBar from "../SideBar";
// import Header from "../Header";
// import { useState } from "react";
// function InvoiceForm() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:block`}
//       >
//         <SideBar />
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main content */}
//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Add New Invoice"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />
//       </div>
//     </div>
//   );
// }

// export default InvoiceForm;
