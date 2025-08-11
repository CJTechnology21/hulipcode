import React from "react";

function ProgressBar() {
  const workCompleted = 64.5;
  const paymentDisbursed = 48;
  const paymentEscrow = 85;
  return (
    <div>
      {/* Top Label */}
      <div className="flex items-center gap-2 font-bold text-black mb-4">
        <span>Work Progress</span>
        <span className="text-sm font-bold">0%</span>
      </div>

      {/* Progress Bar Wrapper */}
      <div className="relative w-full h-2 rounded-full bg-gray-300">
        {/* Cyan section */}
        <div
          className="absolute top-0 left-0 h-2 bg-cyan-600 rounded-full"
          style={{ width: `${paymentDisbursed}%` }}
        ></div>

        {/* Green section */}
        <div
          className="absolute top-0 h-2 bg-green-400"
          style={{
            left: `${paymentDisbursed}%`,
            width: `${paymentEscrow - paymentDisbursed}%`,
          }}
        ></div>

        {/* Yellow section */}
        <div
          className="absolute top-0 h-2 bg-yellow-400"
          style={{
            left: `${paymentEscrow}%`,
            width: `${100 - paymentEscrow}%`,
          }}
        ></div>

        {/* Markers */}
        <div
          className="absolute -top-[7px] w-4 h-4 rounded-full bg-cyan-600 border-2 border-white"
          style={{ left: "0%" }}
        ></div>

        <div
          className="absolute -top-[7px] w-4 h-4 rounded-full bg-cyan-600 border-2 border-white"
          style={{ left: `${workCompleted}%`, transform: "translateX(-50%)" }}
        ></div>

        <div
          className="absolute -top-[7px] w-4 h-4 rounded-full bg-green-400 border-2 border-white"
          style={{
            left: `${paymentDisbursed}%`,
            transform: "translateX(-50%)",
          }}
        ></div>

        <div
          className="absolute -top-[7px] w-4 h-4 rounded-full bg-yellow-400 border-2 border-white"
          style={{ left: `${paymentEscrow}%`, transform: "translateX(-50%)" }}
        ></div>

        <div
          className="absolute -top-[7px] w-4 h-4 rounded-full bg-gray-300 border-2 border-white"
          style={{ left: "100%", transform: "translateX(-50%)" }}
        ></div>
      </div>

      {/* Legend */}
      <div className="flex justify-between mt-6 text-sm font-bold flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-cyan-600"></span>
          Work Completed {workCompleted}%
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-green-400"></span>
          Payment Disbursed {paymentDisbursed}%
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
          Payment In Escrow {paymentEscrow}%
        </div>
      </div>

      {/* End percentage */}
      <div className="flex justify-end mt-2 font-bold text-black">100%</div>
    </div>
  );
}

export default ProgressBar;
