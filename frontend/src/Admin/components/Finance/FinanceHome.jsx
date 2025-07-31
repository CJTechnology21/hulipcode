import React, { useState } from "react";
import Layout from "../Layout";
import PartyTab from "./PartyTab";
import TransactionTab from "./TransactionTab"; // ✅ fixed typo from TranscationTab

function FinanceHome() {
  const [activeTab, setActiveTab] = useState("party");

  return (
    <Layout title="Finance">
      {/* Tab Header with white background */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex gap-6 border-b">
          <button
            onClick={() => setActiveTab("party")}
            className={`pb-2 font-medium ${
              activeTab === "party"
                ? "border-b-4 border-red-600 text-red-600"
                : "text-gray-500"
            }`}
          >
            Party
          </button>
          <button
            onClick={() => setActiveTab("transaction")}
            className={`pb-2 font-medium ${
              activeTab === "transaction"
                ? "border-b-4 border-red-600 text-red-600"
                : "text-gray-500"
            }`}
          >
            Transaction
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-4">
        {activeTab === "party" ? <PartyTab /> : <TransactionTab />}
      </div>
    </Layout>
  );
}

export default FinanceHome;
