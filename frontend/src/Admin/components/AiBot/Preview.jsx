import React, { useState, useRef } from "react";

function Preview() {
  const [activeTab, setActiveTab] = useState("Interior Design");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalImage, setModalImage] = useState(null); // 👈 New: for modal view
  const fileInputRef = useRef(null);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedImage(URL.createObjectURL(file));
  };

  const handleImageClick = (src) => {
    setModalImage(src);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="min-h-screen font-fredoka bg-[#f2f2f2] p-4 overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white px-6 py-4 shadow-sm rounded-md mb-4">
        <h1 className="text-2xl font-bold">Logo</h1>
        <button className="text-sm font-medium text-gray-700 hover:text-red-500">
          Sign out
        </button>
      </div>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row bg-white rounded-md shadow-md overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-[350px] border-r border-gray-300 bg-[#f6f8f9] p-4 space-y-4">
          {/* Tabs */}
          <div className="flex space-x-2">
            {["Interior Design", "Exterior Design"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-md text-sm font-semibold border ${
                  activeTab === tab
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-orange-500 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Upload */}
          <div>
            {selectedImage && (
              <div className="relative w-full h-40 rounded-md overflow-hidden mb-2">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-1 right-1 bg-white text-black rounded-full p-1 shadow hover:bg-red-500 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            {!selectedImage && (
              <div
                onClick={handleUploadClick}
                className="cursor-pointer border border-dashed border-gray-300 rounded-md bg-white p-4 text-center text-sm text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500 mx-auto mb-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8.414a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0011.586 2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M12.707 3.293a1 1 0 00-1.414 0L9.586 5H4a1 1 0 00-1 1v10h14V8.414l-4.293-4.293zM5 13l2-2 3 3 4-4 3 3v2H5v-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Click to upload or drag and drop your image here
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Input Fields */}
          <div className="space-y-3 text-sm">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Input Type
              </label>
              <select className="w-full border border-gray-300 rounded-md p-2 bg-white">
                <option>Room</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Colour Type(Optional)
              </label>
              <select className="w-full border border-gray-300 rounded-md p-2 bg-white">
                <option>Brown</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Custom Design Request
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 bg-white resize-none"
                rows={3}
                placeholder="A modern room with navy blue cabinets, marble countertops..."
              ></textarea>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                AI Creativity
              </label>
              <select className="w-full border border-gray-300 rounded-md p-2 bg-white">
                <option>Medium</option>
              </select>
            </div>
          </div>

          <button className="w-full mt-2 bg-blue-600 text-white rounded-md py-2 text-sm font-semibold hover:bg-blue-700">
            VISUALIZE
          </button>
        </div>

        {/* Preview Section */}
        <div className="flex-1 bg-white p-6 relative">
          <h2 className="text-center text-lg font-semibold mb-4">Welcome</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => {
              const src =
                selectedImage ||
                "https://content.jdmagicbox.com/v2/comp/hyderabad/c3/040pxx40.xx40.210731150325.k2c3/catalogue/v-designs-and-interiors-kukatpally-hyderabad-interior-designers-5xdy18qkrq.jpg";
              return (
                <div
                  key={i}
                  className="relative w-full h-48 rounded-md overflow-hidden group shadow cursor-pointer"
                  onClick={() => handleImageClick(src)}
                >
                  <img
                    src={src}
                    alt="Generated"
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <button className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 3H5a2 2 0 00-2 2v3m13-5h3a2 2 0 012 2v3M3 8v8a2 2 0 002 2h3m13-8v8a2 2 0 01-2 2h-3M8 21h8"></path>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Modal */}
          {modalImage && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg overflow-hidden w-full max-w-5xl shadow-lg relative">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-1 border rounded-full text-sm font-medium hover:bg-gray-100">
                      Before
                    </button>
                    <button className="px-4 py-1 border rounded-full text-sm font-medium hover:bg-gray-100">
                      Side by side
                    </button>
                    <button className="px-4 py-1 border rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                      After
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-gray-500 hover:text-gray-800">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 12v.01M8 12v.01M12 12v.01M16 12v.01M20 12v.01"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={closeModal}
                      className="text-gray-600 text-2xl hover:text-red-600 font-bold"
                    >
                      &times;
                    </button>
                  </div>
                </div>

                {/* Image */}
                <div className="w-full max-h-[70vh] overflow-hidden flex items-center justify-center bg-black">
                  <img
                    src={modalImage}
                    alt="Preview"
                    className="object-contain max-h-[70vh]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center flex-wrap gap-2 px-4 py-3 bg-white border-t">
                  <div className="flex gap-2 w-full justify-center flex-wrap">
                    {[
                      { label: "Create Variation", icon: "🧬" },
                      { label: "Enhance Quality", icon: "📷" },
                      { label: "Download", icon: "⬇️" },
                      { label: "Delete", icon: "🗑️" },
                      { label: "Find Product", icon: "🔍" },
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        <span>{btn.icon}</span>
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Preview;
// import React, { useState, useRef } from "react";

// function Preview() {
//   const [activeTab, setActiveTab] = useState("Interior Design");
//   const [selectedImage, setSelectedImage] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleUploadClick = () => fileInputRef.current.click();

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) setSelectedImage(URL.createObjectURL(file));
//   };

//   return (
//     <div className="min-h-screen font-fredoka bg-[#f2f2f2] p-4">
//       {/* Top Bar */}
//       <div className="flex justify-between items-center bg-white px-6 py-4 shadow-sm rounded-md mb-4">
//         <h1 className="text-2xl font-bold">Logo</h1>
//         <button className="text-sm font-medium text-gray-700 hover:text-red-500">Sign out</button>
//       </div>

//       {/* Main Section */}
//       <div className="flex flex-col lg:flex-row bg-white rounded-md shadow-md overflow-hidden">
//         {/* Sidebar */}
//         <div className="w-full lg:w-[350px] border-r border-gray-300 bg-[#f6f8f9] p-4 space-y-4">
//           {/* Tabs */}
//           <div className="flex space-x-2">
//             {["Interior Design", "Exterior Design"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`flex-1 py-2 rounded-md text-sm font-semibold border ${
//                   activeTab === tab
//                     ? "bg-black text-white"
//                     : "bg-white text-black hover:bg-orange-500 hover:text-white"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Upload */}
//           <div>
//             {selectedImage && (
//               <div className="relative w-full h-40 rounded-md overflow-hidden mb-2">
//                 <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
//                 <button onClick={() => setSelectedImage(null)} className="absolute top-1 right-1 bg-white text-black rounded-full p-1 shadow hover:bg-red-500 hover:text-white">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//             )}
//             {!selectedImage && (
//               <div onClick={handleUploadClick} className="cursor-pointer border border-dashed border-gray-300 rounded-md bg-white p-4 text-center text-sm text-gray-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8.414a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0011.586 2H4z" />
//                   <path fillRule="evenodd" d="M12.707 3.293a1 1 0 00-1.414 0L9.586 5H4a1 1 0 00-1 1v10h14V8.414l-4.293-4.293zM5 13l2-2 3 3 4-4 3 3v2H5v-2z" clipRule="evenodd" />
//                 </svg>
//                 Click to upload or drag and drop your image here
//                 <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
//               </div>
//             )}
//           </div>

//           {/* Input Fields */}
//           <div className="space-y-3 text-sm">
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">Input Type</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 bg-white">
//                 <option>Room</option>
//               </select>
//             </div>
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">Colour Type(Optional)</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 bg-white">
//                 <option>Brown</option>
//               </select>
//             </div>
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">Custom Design Request</label>
//               <textarea className="w-full border border-gray-300 rounded-md p-2 bg-white resize-none" rows={3} placeholder="A modern room with navy blue cabinets, marble countertops..."></textarea>
//             </div>
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">AI Creativity</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 bg-white">
//                 <option>Medium</option>
//               </select>
//             </div>
//           </div>

//           <button className="w-full mt-2 bg-blue-600 text-white rounded-md py-2 text-sm font-semibold hover:bg-blue-700">VISUALIZE</button>
//         </div>

//         {/* Preview Section */}
//         <div className="flex-1 bg-white p-6">
//           <h2 className="text-center text-lg font-semibold mb-4">Welcome</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="relative w-full h-48 rounded-md overflow-hidden group shadow">
//                 <img
//                   src={selectedImage ||"https://content.jdmagicbox.com/v2/comp/hyderabad/c3/040pxx40.xx40.210731150325.k2c3/catalogue/v-designs-and-interiors-kukatpally-hyderabad-interior-designers-5xdy18qkrq.jpg" }
//                   alt={'Generated images'}
//                   className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
//                 />
//                 <button className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black">
//                   <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <path d="M8 3H5a2 2 0 00-2 2v3m13-5h3a2 2 0 012 2v3M3 8v8a2 2 0 002 2h3m13-8v8a2 2 0 01-2 2h-3M8 21h8"></path>
//                   </svg>
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Preview;
