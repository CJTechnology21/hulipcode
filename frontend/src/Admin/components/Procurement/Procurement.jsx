import React, { useState } from "react";
import Layout from "../Layout";
import RfqHome from "./RfqHome";
import ProcurementContent from "./ProcurementContent";

function Procurement() {
  const [activeTab, setActiveTab] = useState("RFQ");

  return (
    <Layout title="Procurement">
      {/* Tabs – attached directly under the header */}
      <div className="bg-white border-b flex text-sm font-medium">
        <button
          className={`px-4 py-2 ${
            activeTab === "RFQ"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600 hover:text-red-600 border-b-2 border-transparent hover:border-blue-300"
          } transition`}
          onClick={() => setActiveTab("RFQ")}
        >
          RFQ
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "Procurement"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600 hover:text-red-600 border-b-2 border-transparent hover:border-blue-300"
          } transition`}
          onClick={() => setActiveTab("Procurement")}
        >
          Procurement
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "RFQ" ? (
          <div><RfqHome/></div>
        ) : (
          <div><ProcurementContent/></div>
        )}
      </div>
    </Layout>
  );
}

export default Procurement;
