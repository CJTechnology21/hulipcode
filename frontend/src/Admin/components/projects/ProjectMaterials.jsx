import React, { useState } from 'react';
import { FiSearch, FiDownload, FiPlus } from 'react-icons/fi';
import Button from '../../../components/Button';
import SearchBar from '../../../components/SearchBar';

export default function ProjectMaterials() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Material List');

  return (
    <div className="p-4 md:p-6 bg-white w-full min-h-[80vh]">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* Search */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Material"
            className="w-60"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm text-gray-600 cursor-pointer hover:text-black">
            Pending To Receive
          </span>
          <span className="text-sm text-gray-600 cursor-pointer hover:text-black flex items-center gap-1">
            Material Requests
            <span className="text-xs bg-gray-300 rounded-full px-1">0</span>
          </span>
          <button className="flex items-center text-sm text-gray-600 gap-1 hover:text-black">
            <FiDownload />
            Download
          </button>
          <button className="flex items-center bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded gap-2 ">
            <FiPlus />
            Add Material
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('Material List')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            activeTab === 'Material List'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Material List
        </button>
        <button
          onClick={() => setActiveTab('Recent Entries')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            activeTab === 'Recent Entries'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Recent Entries
        </button>
      </div>

      {/* Tab Content (Empty State for now) */}
      <div className="flex flex-col items-center justify-center text-center h-64">
        <h2 className="text-lg font-semibold mb-2">Add Materials</h2>
        <p className="text-sm text-gray-600 mb-4 max-w-md">
          You haven’t added any material data yet, you can upload material data or can add manually
        </p>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
          Add Received
          <FiPlus />
        </button>
      </div>
    </div>
  );
}

// import React, { useState } from 'react';
// import { FiSearch, FiDownload, FiPlus } from 'react-icons/fi';
// import Button from '../../../components/Button'; // Adjust the path as per your structure
// import SearchBar from '../../../components/SearchBar';

// function ProjectMaterials() {
//   const [searchTerm, setSearchTerm] = useState('');

//   return (
//     <div className="p-4 md:p-6 bg-white w-full min-h-[80vh]">
//       {/* Top Bar */}
//       <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
//         {/* Search */}
//         <div className="w-full md:w-auto flex items-center gap-2">
//           {/* <FiSearch className="text-gray-500" /> */}
//           <SearchBar
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search Material"
//             className="w-60"
//           />
//         </div>

//         {/* Right Actions */}
//         <div className="flex items-center gap-4 flex-wrap">
//           <span className="text-sm text-gray-500 cursor-pointer hover:text-black">
//             Pending To Receive
//           </span>
//           <span className="text-sm text-gray-500 cursor-pointer hover:text-black flex items-center gap-1">
//             Material Requests
//             <span className="text-xs bg-gray-300 rounded-full px-1">0</span>
//           </span>
//           <Button color="gray" variant="icon" size="sm" className="text-sm gap-1">
//             <FiDownload />
//             Download
//           </Button>
//           <Button color="red" size="sm" className="gap-2">
//             <FiPlus />
//             Add Material
//           </Button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-4 mb-8">
//         <Button color="red" size="sm" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full">
//           Material List
//         </Button>
//         <Button
//           color="red"
//           variant="outlined"
//           size="sm"
//           className="bg-red-100 text-gray-600 hover:bg-red-200 px-4 py-2 rounded-full"
//         >
//           Recent Entries
//         </Button>
//       </div>

//       {/* Empty State */}
//       <div className="flex flex-col items-center justify-center text-center h-64">
//         <h2 className="text-lg font-semibold mb-2">Add Materials</h2>
//         <p className="text-sm text-gray-600 mb-4 max-w-md">
//           You haven’t added any material data yet, you can upload material data or can add manually
//         </p>
//         <Button color="green" size="sm" className="gap-2">
//           Add Received
//           <FiPlus />
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default ProjectMaterials;
