import React, { useState } from "react";
import Layout from "../Layout";
import PartyTab from "./PartyTab";
import TransactionTab from "./TransactionTab";
import Button from "../../../components/Button";

function FinanceHome() {
  const [activeTab, setActiveTab] = useState("party");

  return (
    <Layout title="Finance">
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex gap-6 border-b">
          <Button
            variant="custom"
            onClick={() => setActiveTab("party")}
            className={`pb-2 font-medium ${
              activeTab === "party"
                ? "border-b-4 border-red-600 text-red-600"
                : "text-gray-500"
            }`}
          >
            Party
          </Button>
          <Button
            variant="custom"
            onClick={() => setActiveTab("transaction")}
            className={`pb-2 font-medium ${
              activeTab === "transaction"
                ? "border-b-4 border-red-600 text-red-600"
                : "text-gray-500"
            }`}
          >
            Transaction
          </Button>
        </div>
      </div>
      <div className="px-6 py-4">
        {activeTab === "party" ? <PartyTab /> : <TransactionTab />}
      </div>
    </Layout>
  );
}

export default FinanceHome;
