import React from "react";
import Layout from "../Layout";

function Insights() {
  return (
    <Layout title="Insights">
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <h2 className="text-2xl font-semibold text-red-600">1,250</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Payment In</p>
            <h2 className="text-2xl font-semibold text-green-600">₹ 8,50,000</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Payment Out</p>
            <h2 className="text-2xl font-semibold text-red-600">₹ 6,75,000</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Sites Covered</p>
            <h2 className="text-2xl font-semibold text-blue-600">27</h2>
          </div>
        </div>

        {/* Placeholder for Chart */}
        <div className="bg-white p-6 rounded shadow">
          <p className="text-sm text-gray-600 mb-2 font-medium">Transaction Trends</p>
          <div className="h-40 flex items-center justify-center text-gray-400 border border-dashed rounded">
            {/* Replace this with an actual chart later */}
            <span>Chart goes here (e.g., line or bar chart)</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded shadow">
          <p className="text-sm text-gray-600 mb-3 font-medium">Recent Activity</p>
          <ul className="divide-y text-sm">
            <li className="py-2 flex justify-between">
              <span>Payment In from Vijay Stores</span>
              <span className="text-green-600 font-semibold">₹ 20,000</span>
            </li>
            <li className="py-2 flex justify-between">
              <span>Payment Out to JK Traders</span>
              <span className="text-red-600 font-semibold">₹ 12,500</span>
            </li>
            <li className="py-2 flex justify-between">
              <span>Site Added: Shakti Nagar</span>
              <span className="text-gray-500">3 days ago</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export default Insights;
