import React from "react";

const orders = [
  {
    orderId: "59217",
    orderNumber: "59217342",
    orderDate: "20 Feb 2024",
    status: "Completed",
    item: 1,
    customer: "Cody Fisher",
    trackingCode: "940010010936113003113",
  },
  {
    orderId: "59213",
    orderNumber: "59217343",
    orderDate: "20 Feb 2024",
    status: "Completed",
    item: 2,
    customer: "Kristin Watson",
    trackingCode: "940010010936113003113",
  },
  {
    orderId: "59219",
    orderNumber: "59217344",
    orderDate: "20 Feb 2024",
    status: "Completed",
    item: 12,
    customer: "Esther Howard",
    trackingCode: "940010010936113003113",
  },
  {
    orderId: "59220",
    orderNumber: "59217345",
    orderDate: "20 Feb 2024",
    status: "Completed",
    item: 22,
    customer: "Jenny Wilson",
    trackingCode: "940010010936113003113",
  },
  {
    orderId: "59223",
    orderNumber: "59217346",
    orderDate: "20 Feb 2024",
    status: "Completed",
    item: 32,
    customer: "John Smith",
    trackingCode: "940010010936113003113",
  },
  {
    orderId: "592182",
    orderNumber: "59217346",
    orderDate: "20 Feb 2024",
    status: "Completed",
    item: 41,
    customer: "Cameron Williamson",
    trackingCode: "940010010936113003113",
  },
  {
    orderId: "592182",
    orderNumber: "59217347",
    orderDate: "20 Feb 2024",
    status: "Completed",
    item: 44,
    customer: "Cameron Williamson",
    trackingCode: "940010010936113003113",
  },
];

function CustomerDetails() {
  return (
    <div className="bg-white rounded-md shadow p-4 w-full max-w-full overflow-x-auto">
      <table className="min-w-[700px] w-full text-sm text-left border-collapse">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-2 whitespace-nowrap">ORDER ID</th>
            <th className="px-4 py-2 whitespace-nowrap">ORDER NUMBER</th>
            <th className="px-4 py-2 whitespace-nowrap">ORDER DATE</th>
            <th className="px-4 py-2 whitespace-nowrap">STATUS</th>
            <th className="px-4 py-2 whitespace-nowrap">ITEM</th>
            <th className="px-4 py-2 whitespace-nowrap">CUSTOMER NAME</th>
            <th className="px-4 py-2 whitespace-nowrap">TRACKING CODE</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {orders.map((order, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2 whitespace-nowrap">{order.orderId}</td>
              <td className="px-4 py-2 whitespace-nowrap">{order.orderNumber}</td>
              <td className="px-4 py-2 whitespace-nowrap">{order.orderDate}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">{order.item}</td>
              <td className="px-4 py-2 whitespace-nowrap">{order.customer}</td>
              <td className="px-4 py-2 whitespace-nowrap">{order.trackingCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerDetails;
