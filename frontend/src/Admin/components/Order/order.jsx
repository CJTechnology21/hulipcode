import { useState } from "react";
import Header from "../Header";
import SideBar from "../SideBar";
import { FaFilePdf, FaPlus, FaSearch } from "react-icons/fa";
import { FaCircleChevronDown } from "react-icons/fa6";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const dummyQuotes = [
  {
    id: "P-100/Q-10",
    status: "DRAFT",
    amount: "2,00,000 RS",
    items: Array(8).fill({
      name: "Furniture",
      image: "📷",
      detail: "Lorem Ipsum is simply dummy text of the printing",
      section: "Furniture",
      qty: "123",
      uom: "Sq Ft",
      price: "10,000",
      discount: "2025",
      gst: "18%",
      amount: "17,500",
    }),
  },
  {
    id: "P-101/Q-10",
    status: "APPROVED",
    amount: "2,00,000 RS",
    items: [],
  },
  {
    id: "P-102/Q-10",
    status: "DRAFT",
    amount: "2,00,000 RS",
    items: [],
  },
];

function Order() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openQuote, setOpenQuote] = useState("P-100/Q-10");
  const navigate = useNavigate(); 

  const handleToggleQuote = (id) => {
    setOpenQuote((prev) => (prev === id ? null : id));
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
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100 font-fredoka">
        <Header
          title="Orders"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-4 sm:p-6 flex-1 flex flex-col gap-4">
          {/* Top bar: Search + Add Quote */}
          <div className="flex justify-end items-center flex-wrap gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="border rounded-xl pl-3 pr-9 py-2 text-sm w-64"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-500 text-sm" />
            </div>

            <button
              className="flex items-center gap-2 border border-gray-400 text-gray-600 px-3 py-2 rounded-xl text-sm"
              onClick={() => navigate("/addorder")}
            >
              Add Order <FaPlus />
            </button>
          </div>

          {/* Quotes list */}
          {dummyQuotes.map((quote) => (
            <div key={quote.id} className="bg-white rounded-xl shadow">
              <div
                onClick={() => handleToggleQuote(quote.id)}
                className="cursor-pointer border-b px-4 py-3 flex items-center justify-between bg-gray-50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <FaFilePdf className="text-yellow-500 text-xl" />
                    <span className="font-medium">{quote.id}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold w-max ${
                      quote.status === "APPROVED"
                        ? "bg-green-200 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>{quote.amount}</span>
                  <FaCircleChevronDown className="text-gray-500" />
                </div>
              </div>

              {/* Expanded quote details */}
              {openQuote === quote.id && (
                <div className="overflow-x-auto p-4">
                  <table className="min-w-[800px] w-full text-sm">
                    <thead className="text-left text-xs text-gray-500 uppercase">
                      <tr className="border-b">
                        <th className="p-2">Item Name</th>
                        <th className="p-2">Image</th>
                        <th className="p-2">Detail</th>
                        <th className="p-2">Section</th>
                        <th className="p-2">Qty</th>
                        <th className="p-2">UOM</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Discount</th>
                        <th className="p-2">GST</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quote.items.map((item, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="p-2">{item.name}</td>
                          <td className="p-2">{item.image}</td>
                          <td className="p-2">{item.detail}</td>
                          <td className="p-2">{item.section}</td>
                          <td className="p-2">{item.qty}</td>
                          <td className="p-2">{item.uom}</td>
                          <td className="p-2">{item.price}</td>
                          <td className="p-2">{item.discount}</td>
                          <td className="p-2">{item.gst}</td>
                          <td className="p-2">{item.amount}</td>
                          <td className="p-2 flex gap-2">
                            <FaEye className="text-gray-600 cursor-pointer" />
                            <FaEdit className="text-blue-600 cursor-pointer" />
                            <FaTrash className="text-red-600 cursor-pointer" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Summary */}
                  <div className="text-right mt-4 text-sm space-y-1">
                    <p>Subtotal: 1,20,000</p>
                    <p>GST: 1,000</p>
                    <p className="font-bold">Total: 1,21,000</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Order;
