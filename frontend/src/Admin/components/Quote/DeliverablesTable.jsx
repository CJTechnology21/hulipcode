import React from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Button from "../../../components/Button";

const DeliverablesTable = ({ items, onRowClick, onDelete, onAddDeliverable }) => {
  const total = items.reduce(
    (sum, item) => sum + item.qty * item.rate * (1 + item.gst / 100),
    0
  );

  return (
    <>
      <div className="flex justify-end mb-2">
        <Button
          variant="custom"
          onClick={onAddDeliverable}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded-full text-sm font-bold"
        >
          <FaPlus /> Add Deliverable
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border mt-4">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="border px-2 py-1">S.No</th>
              <th className="border px-2 py-1">Photo</th>
              <th className="border px-2 py-1">Code & Category</th>
              <th className="border px-2 py-1">Description</th>
              <th className="border px-2 py-1">Specification</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Unit</th>
              <th className="border px-2 py-1">Rate</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">GST (%)</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const amount = item.qty * item.rate;
              const totalWithGST = amount * (1 + item.gst / 100);
              return (
                <tr
                  key={item.id}
                  onClick={() => onRowClick(item)}
                  className="cursor-pointer hover:bg-red-50"
                >
                  <td className="border px-2 py-1">{idx + 1}</td>
                  <td className="border px-2 py-1">
                    <img
                      src={item.photo}
                      alt="item"
                      className="w-10 h-10 object-cover"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    {item.code} / {item.category}
                  </td>
                  <td className="border px-2 py-1">{item.description}</td>
                  <td className="border px-2 py-1">{item.spec}</td>
                  <td className="border px-2 py-1">{item.qty}</td>
                  <td className="border px-2 py-1">{item.unit}</td>
                  <td className="border px-2 py-1">₹ {item.rate}</td>
                  <td className="border px-2 py-1">₹ {amount}</td>
                  <td className="border px-2 py-1">{item.gst}%</td>
                  <td className="border px-2 py-1">₹ {totalWithGST.toFixed(2)}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <FaEdit className="text-blue-600 cursor-pointer" />
                    <FaTrash
                      className="text-red-600 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-right text-lg font-semibold text-red-700 mt-4">
        Total Amount: ₹ {total.toLocaleString("en-IN")}/-
      </div>
    </>
  );
};

export default DeliverablesTable;
