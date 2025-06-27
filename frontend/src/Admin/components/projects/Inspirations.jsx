import { useState } from "react";
import Header from "../Header";
import SideBar from "../SideBar";

function Inspirations() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: "",
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleCaptionChange = (index, value) => {
    const updated = [...images];
    updated[index].caption = value;
    setImages(updated);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <SideBar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gradient-to-br from-gray-100 to-gray-200">
        <Header
          title="Inspirations"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-6 max-w-screen-xl mx-auto">
          {/* Upload Box */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-xl p-6 mb-8 border border-gray-200">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Upload Inspiration Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          {/* Image Gallery */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white/70 backdrop-blur-md"
              >
                {/* Image with zoom on hover */}
                <div className="overflow-hidden h-60">
                  <img
                    src={img.preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Caption overlay */}
                <div className="p-4">
                  <textarea
                    value={img.caption}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    placeholder="Add a caption (optional)"
                    className="w-full text-sm text-gray-700 bg-white/80 border rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inspirations;

// import { useState } from "react";
// import Header from "../Header";
// import SideBar from "../SideBar";

// function Inspirations() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [images, setImages] = useState([]);

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);

//     const updatedImages = files.map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//       caption: "",
//     }));

//     setImages((prev) => [...prev, ...updatedImages]);
//   };

//   const handleCaptionChange = (index, value) => {
//     const updated = [...images];
//     updated[index].caption = value;
//     setImages(updated);
//   };

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:block`}
//       >
//         <SideBar />
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main content */}
//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Inspirations"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />

//         <div className="p-6">
//           <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//             <label className="block text-lg font-medium mb-2 text-gray-700">
//               Upload Images
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleImageUpload}
//               className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//           </div>

//           {/* Gallery */}
//           {images.length > 0 && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {images.map((img, index) => (
//                 <div
//                   key={index}
//                   className="relative bg-white border rounded-lg shadow hover:shadow-xl transition-shadow"
//                 >
//                   <img
//                     src={img.preview}
//                     alt={`Upload ${index + 1}`}
//                     className="w-full h-60 object-cover rounded-t-lg"
//                   />
//                   <div className="p-4">
//                     <textarea
//                       value={img.caption}
//                       onChange={(e) => handleCaptionChange(index, e.target.value)}
//                       placeholder="Add a caption (optional)"
//                       className="w-full text-sm text-gray-700 border rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
//                       rows={2}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Inspirations;
