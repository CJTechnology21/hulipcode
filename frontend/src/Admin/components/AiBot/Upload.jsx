
import React, { useState, useRef } from 'react';

function Upload() {
  const [activeTab, setActiveTab] = useState('Interior Design');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="min-h-screen font-fredoka bg-[#f2f2f2] p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white px-6 py-4 shadow-sm rounded-md mb-4">
        <h1 className="text-2xl font-bold">Logo</h1>
        <button className="text-sm font-medium text-gray-700 hover:text-red-500">Sign out</button>
      </div>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row bg-white rounded-md shadow-md overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-full lg:w-[350px] border-r border-gray-300 bg-[#f6f8f9] p-4 space-y-4">
          {/* Tabs */}
          <div className="flex space-x-2">
            {['Interior Design', 'Exterior Design'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-md text-sm font-semibold border ${
                  activeTab === tab
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-orange-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Upload Box */}
          <div
            onClick={handleUploadClick}
            className="cursor-pointer border border-dashed border-gray-300 rounded-md bg-white p-4 text-center text-sm text-gray-600"
          >
            <div className="flex justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8.414a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0011.586 2H4zm8 5a1 1 0 112 0 1 1 0 01-2 0z" />
                <path fillRule="evenodd" d="M12.707 3.293a1 1 0 00-1.414 0L9.586 5H4a1 1 0 00-1 1v10h14V8.414l-4.293-4.293zM5 13l2-2 3 3 4-4 3 3v2H5v-2z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="font-medium">Click to upload or drag and drop your image here</p>
            <p className="text-xs text-gray-400">or use your sample images</p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Input Fields */}
          <div className="space-y-3 text-sm">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Input Type</label>
              <select className="w-full border border-gray-300 rounded-md p-2 bg-white">
                <option>Select type</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Colour Type (Optional)</label>
              <select className="w-full border border-gray-300 rounded-md p-2 bg-white">
                <option>Pick Colour</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Custom Design Request</label>
              <textarea
                rows={3}
                placeholder="Type your word"
                className="w-full border border-gray-300 rounded-md p-2 bg-white resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">AI Creativity</label>
              <select className="w-full border border-gray-300 rounded-md p-2 bg-white">
                <option>Select</option>
              </select>
            </div>
          </div>

          {/* Button */}
          <button className="w-full mt-2 bg-blue-600 text-white rounded-md py-2 text-sm font-semibold hover:bg-blue-700">
            VISUALIZE
          </button>
        </div>

        {/* Right Preview Section */}
        <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 text-center border-t lg:border-t-0">
          {selectedImage ? (
            <img src={selectedImage} alt="Uploaded" className="max-w-full max-h-[400px] rounded-md shadow-md" />
          ) : (
            <>
              <div className="text-blue-600 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8.414a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0011.586 2H4zm8 5a1 1 0 112 0 1 1 0 01-2 0z" />
                  <path fillRule="evenodd" d="M12.707 3.293a1 1 0 00-1.414 0L9.586 5H4a1 1 0 00-1 1v10h14V8.414l-4.293-4.293zM5 13l2-2 3 3 4-4 3 3v2H5v-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Generated images will appear here.</h2>
              <p className="text-sm text-gray-600 mt-1">
                Ready to bring your vision to life? Get started on the left to create your own custom renders.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;

// import React, { useState } from 'react';

    // function Upload() {
    // const [activeTab, setActiveTab] = useState('Interior Design');

    // return (
    //     <div className="min-h-screen font-fredoka bg-[#f2f2f2] p-4">
    //     {/* Top Bar */}
    //     <div className="flex justify-between items-center bg-white px-6 py-4 shadow-sm rounded-md mb-4">
    //         <h1 className="text-2xl font-bold">Logo</h1>
    //         <button className="text-sm font-medium text-gray-700 hover:text-red-500">Sign out</button>
    //     </div>

    //     {/* Main Section */}
    //     <div className="flex flex-col lg:flex-row bg-white rounded-md shadow-md overflow-hidden">
    //         {/* Left Sidebar */}
    //         <div className="w-full lg:w-[350px] border-r border-gray-300 bg-[#f6f8f9] p-4 space-y-4">
    //         {/* Tabs */}
    //         <div className="flex space-x-2">
    //             {['Interior Design', 'Exterior Design'].map((tab) => (
    //             <button
    //                 key={tab}
    //                 onClick={() => setActiveTab(tab)}
    //                 className={`flex-1 py-2 rounded-md text-sm font-semibold border ${
    //                 activeTab === tab
    //                     ? 'bg-black text-white'
    //                     : 'bg-white text-black hover:bg-orange-500 hover:text-white'
    //                 }`}
    //             >
    //                 {tab}
    //             </button>
    //             ))}
    //         </div>

    //         {/* Upload Box */}
    //         <div className="border border-dashed border-gray-300 rounded-md bg-white p-4 text-center text-sm text-gray-600">
    //             <div className="flex justify-center mb-2">
    //             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    //                 <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8.414a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0011.586 2H4zm8 5a1 1 0 112 0 1 1 0 01-2 0z" />
    //                 <path fillRule="evenodd" d="M12.707 3.293a1 1 0 00-1.414 0L9.586 5H4a1 1 0 00-1 1v10h14V8.414l-4.293-4.293zM5 13l2-2 3 3 4-4 3 3v2H5v-2z" clipRule="evenodd" />
    //             </svg>
    //             </div>
    //             <p className="font-medium">Click to upload or drag and drop your image here</p>
    //             <p className="text-xs text-gray-400">or use your sample images</p>
    //         </div>

    //         {/* Input Fields */}
    //         <div className="space-y-3 text-sm">
    //             <div>
    //             <label className="block font-medium text-gray-700 mb-1">Input Type</label>
    //             <select className="w-full border border-gray-300 rounded-md p-2 bg-white">
    //                 <option>Select type</option>
    //             </select>
    //             </div>

    //             <div>
    //             <label className="block font-medium text-gray-700 mb-1">Colour Type (Optional)</label>
    //             <select className="w-full border border-gray-300 rounded-md p-2 bg-white">
    //                 <option>Pick Colour</option>
    //             </select>
    //             </div>

    //             <div>
    //             <label className="block font-medium text-gray-700 mb-1">Custom Design Request</label>
    //             <textarea
    //                 rows={3}
    //                 placeholder="Type your word"
    //                 className="w-full border border-gray-300 rounded-md p-2 bg-white resize-none"
    //             ></textarea>
    //             </div>

    //             <div>
    //             <label className="block font-medium text-gray-700 mb-1">AI Creativity</label>
    //             <select className="w-full border border-gray-300 rounded-md p-2 bg-white">
    //                 <option>Select</option>
    //             </select>
    //             </div>
    //         </div>

    //         {/* Button */}
    //         <button className="w-full mt-2 bg-blue-600 text-white rounded-md py-2 text-sm font-semibold hover:bg-blue-700">
    //             VISUALIZE
    //         </button>
    //         </div>

    //         {/* Right Preview Section */}
    //         <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 text-center border-t lg:border-t-0">
    //         <div className="text-blue-600 mb-3">
    //             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="currentColor" viewBox="0 0 20 20">
    //             <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8.414a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0011.586 2H4zm8 5a1 1 0 112 0 1 1 0 01-2 0z" />
    //             <path fillRule="evenodd" d="M12.707 3.293a1 1 0 00-1.414 0L9.586 5H4a1 1 0 00-1 1v10h14V8.414l-4.293-4.293zM5 13l2-2 3 3 4-4 3 3v2H5v-2z" clipRule="evenodd" />
    //             </svg>
    //         </div>
    //         <h2 className="text-lg font-semibold text-gray-800">Generated images will appear here.</h2>
    //         <p className="text-sm text-gray-600 mt-1">
    //             Ready to bring your vision to life? Get started on the left to create your own custom renders.
    //         </p>
    //         </div>
    //     </div>
    //     </div>
    // );
    // }

    // export default Upload