import React from "react";

function HomeCards() {
  return (
    <div>
      {" "}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-4xl md:text-5xl font-semibold text-[#1c3c2e] mb-10">
          Lorem Ipsum is simply <br /> dummy text.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nasdaq Card */}
          <div className="bg-[#3d0d50] text-white rounded-xl p-6 md:p-8 flex flex-col justify-between ">
            {/* Header */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {/* Logo Icon Placeholder */}
                <span className="text-2xl font-bold">ℕ</span> Nasdaq
              </h3>
              <p className="text-sm mt-4 leading-relaxed">
                “Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry’s
                standard dummy.”
              </p>
              <p className="text-xs mt-4 opacity-80">
                Josh Machiz, Chief Digital Officer
              </p>
            </div>

            {/* Results */}
            <div className="mt-8 border-t border-white/30 pt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold">Emmy Winning</p>
                <p className="text-xs opacity-80">Facebook Watch Program</p>
              </div>
              <div>
                <p className="font-bold">Millions</p>
                <p className="text-xs opacity-80">
                  Of impressions generated per client per IPO
                </p>
              </div>
            </div>
          </div>

          {/* Microsoft Card */}
          <div className="bg-[#4717f6] text-white rounded-xl p-6 md:p-8 flex flex-col justify-between relative">
            {/* Header */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {/* Logo Icon Placeholder */}
                <span className="text-xl font-bold">🧊</span> Microsoft
              </h3>
              <p className="text-sm mt-4 leading-relaxed">
                “Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry’s
                standard dummy.”
              </p>
              <p className="text-xs mt-4 opacity-80">
                Carrol Tylor, Director of Content Experience
              </p>
            </div>

            {/* Results */}
            <div className="mt-8 border-t border-white/30 pt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold">50% Faster</p>
                <p className="text-xs opacity-80">Launch of projects</p>
              </div>
              <div>
                <p className="font-bold">10.000</p>
                <p className="text-xs opacity-80">Projects completed</p>
              </div>
            </div>

            {/* Arrow Button */}
            <div className="absolute right-[-20px] top-1/2 transform -translate-y-1/2">
              <button className="w-10 h-10 rounded-full bg-[#1f1ce1] flex items-center justify-center shadow-lg hover:scale-105 transition">
                <span className="text-white text-xl">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeCards;
