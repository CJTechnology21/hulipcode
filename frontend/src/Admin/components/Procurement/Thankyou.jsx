import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Header from "../Header";

function ThankYou() {
  return (
    <>
      <Header title="Response Submitted" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        {/* Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Thank You!
          </h1>
          <p className="text-gray-600">
            Your response has been successfully submitted.  
            Our team will review it and get back to you shortly.
          </p>
        </div>
      </div>
    </>
  );
}

export default ThankYou;
