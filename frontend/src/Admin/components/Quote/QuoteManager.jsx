import React, { useState } from "react";
import QuoteSummary from "./QuoteSummary";
import RoomDetails from "./RoomDetail";

const QuoteManager = () => {
  const [activeSection, setActiveSection] = useState("Summary");

  return (
    <div className="p-4">
      {activeSection === "Summary" ? (
        <QuoteSummary
          activeSection={activeSection}
          onEdit={(section) => setActiveSection(section)}
        />
      ) : (
        <RoomDetails
          section={activeSection}
          goBack={() => setActiveSection("Summary")}
        />
      )}
    </div>
  );
};

export default QuoteManager;
