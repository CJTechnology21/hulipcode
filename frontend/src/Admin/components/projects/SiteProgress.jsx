
import { useState } from "react";
import Header from "../Header";
import SideBar from "../SideBar";

function SiteProgress() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");

  const handleImageUpload = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    console.log("Images:", images);
    console.log("Description:", description);
    alert("Submitted!");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <SideBar />
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Project Progress"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-6 md:p-10 overflow-hidden">
          <div className="max-w-6xl w-full min-h-[500px] bg-white rounded-2xl shadow-md mx-auto p-8">
            <h2 className="text-2xl font-semibold mb-6">All your progress will be shown here</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Progress Description</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  rows="4"
                  placeholder="Describe the progress..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
                {images.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-700 list-disc pl-4">
                    {images.map((img, i) => (
                      <li key={i}>{img.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Submit Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteProgress;
// import { useState } from "react";
// import Header from "../Header";
// import SideBar from "../SideBar";

// function SiteProgress() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:translate-x-0`}
//       >
//         <SideBar />
//       </div>
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Project Progress"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />
//       </div>
//     </div>
//   );
// }

// export default SiteProgress;
