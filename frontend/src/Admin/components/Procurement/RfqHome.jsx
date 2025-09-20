import React, { useState, useEffect } from "react";
import SearchBar from "../../../components/SearchBar";
import Button from "../../../components/Button";
import MaterialRequestModal from "./MaterialRequestModal";
import CreateRFQModal from "./CreateRFQModal";
import RFQDrawer from "./RFQDrawer";
import { fetchProjects } from "../../../services/projectServices";
import { fetchRFQs } from "../../../services/rfqServices";
import { formatDate } from "../../../utils/dateFormatter";
import ClipLoader from "react-spinners/ClipLoader";
import { useSelector } from "react-redux";

export default function RfqHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);
  const [rfqDrafts, setRfqDrafts] = useState([]);
  const [loadingRFQs, setLoadingRFQs] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [rfqId, setRfqId] = useState(null);

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Redux state for selected materials
  const selectedMaterials = useSelector(
    (state) => state.pendingMaterials.selectedMaterials
  );

  // Fetch RFQs
  const getRFQs = async () => {
    setLoadingRFQs(true);
    try {
      const data = await fetchRFQs();
      const rfqsArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setRfqDrafts(rfqsArray);
    } catch (err) {
      console.error("Error fetching RFQs:", err);
      setRfqDrafts([]);
    } finally {
      setLoadingRFQs(false);
    }
  };

  useEffect(() => {
    getRFQs();
  }, []);

  // Filter RFQs by project, RFQ no, supplier, or delivery location
  const filteredRFQs = Array.isArray(rfqDrafts)
    ? rfqDrafts.filter((rfq) => {
        const search = searchTerm.toLowerCase();
        return (
          (rfq?.project?.name || "").toLowerCase().includes(search) ||
          (rfq?.rfqNo || "").toLowerCase().includes(search) ||
          (rfq?.supplier?.name || "").toLowerCase().includes(search) ||
          (rfq?.deliveryLocation || "").toLowerCase().includes(search)
        );
      })
    : [];

  const totalRFQs = filteredRFQs.length;
  const totalMaterialsAcrossRFQs = filteredRFQs.reduce(
    (acc, rfq) => acc + (rfq?.materials?.length || 0),
    0
  );

  const handleRowClick = (rfq) => {
    setSelectedRFQ({
      ...rfq,
      suppliers: rfq?.suppliers || [],
    });
    setRfqId(rfq._id);
  };

  const handleOpenRFQModal = async () => {
    setLoadingProjects(true);
    try {
      const data = await fetchProjects();
      setProjects(data || []);
      setIsRFQModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  return (
    <>
      <MaterialRequestModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rfqId={rfqId}
      />

      <CreateRFQModal
        open={isRFQModalOpen}
        onClose={() => setIsRFQModalOpen(false)}
        projects={projects}
        loading={loadingProjects}
      />

      <div className="flex flex-col gap-4 p-2">
        {/* Top Toolbar */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div className="w-full md:w-72">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by RFQ, Project, Supplier or Location"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="text-sm text-gray-600">
              RFQs: <strong>{totalRFQs}</strong>
            </div>
            <div className="text-sm text-gray-600">
              Total Materials: <strong>{totalMaterialsAcrossRFQs}</strong>
            </div>

            <Button
              color="black"
              variant="custom"
              className="text-sm font-medium text-gray-800 relative"
              onClick={() => setIsModalOpen(true)}
            >
              Open Material Request
              {selectedMaterials.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {selectedMaterials.length}
                </span>
              )}
            </Button>

            <Button
              color="red"
              className="text-white bg-red-600 hover:bg-red-700 text-sm px-4 py-2 rounded-lg font-semibold"
              variant="custom"
              onClick={handleOpenRFQModal}
            >
              + New RFQ
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-md text-xs sm:text-sm bg-white">
            <thead className="bg-gray-400 text-black">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left">RFQ No</th>
                <th className="px-2 sm:px-4 py-2 text-left">Supplier</th>
                <th className="px-2 sm:px-4 py-2 text-left">Materials</th>
                <th className="px-2 sm:px-4 py-2 text-left">Delivery Location</th>
                <th className="px-2 sm:px-4 py-2 text-left">Bidding Start</th>
                <th className="px-2 sm:px-4 py-2 text-left">Bidding End</th>
                <th className="px-2 sm:px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {loadingRFQs ? (
                <tr>
                  <td colSpan={7} className="text-center px-4 py-6 text-gray-500">
                    <ClipLoader size={28} color="#b91c1c" />
                  </td>
                </tr>
              ) : filteredRFQs.length > 0 ? (
                filteredRFQs.map((rfq, index) => (
                  <tr
                    key={rfq._id || index}
                    className="border-t border-gray-200 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(rfq)}
                  >
                    <td className="px-2 sm:px-4 py-2">
                      {rfq?.rfqNo || `#RFQ-${index + 1}`}
                    </td>
                    <td className="px-2 sm:px-4 py-2">
                      {rfq?.supplier?.name || "--"}
                    </td>
                    <td className="px-2 sm:px-4 py-2">{rfq?.materials?.length || 0}</td>
                    <td className="px-2 sm:px-4 py-2">{rfq?.deliveryLocation || "--"}</td>
                    <td className="px-2 sm:px-4 py-2">
                      {rfq?.biddingStartDate ? formatDate(rfq.biddingStartDate) : "--"}
                    </td>
                    <td className="px-2 sm:px-4 py-2">
                      {rfq?.biddingEndDate ? formatDate(rfq.biddingEndDate) : "--"}
                    </td>
                    <td className="px-2 sm:px-4 py-2">
                      <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-md text-xs font-medium">
                        {rfq.status || "Draft"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center px-4 py-6 text-gray-500">
                    No RFQ drafts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right Drawer */}
        <RFQDrawer
          rfq={selectedRFQ}
          onClose={() => {
            setSelectedRFQ(null);
            getRFQs();
          }}
        />
      </div>
    </>
  );
}

// import React, { useState, useEffect } from "react";
// import SearchBar from "../../../components/SearchBar";
// import Button from "../../../components/Button";
// import MaterialRequestModal from "./MaterialRequestModal";
// import CreateRFQModal from "./CreateRFQModal";
// import RFQDrawer from "./RFQDrawer";
// import { fetchProjects } from "../../../services/projectServices";
// import { fetchRFQs } from "../../../services/rfqServices";
// import { formatDate } from "../../../utils/dateFormatter";
// import ClipLoader from "react-spinners/ClipLoader";
// import { useSelector } from "react-redux";
// export default function RfqHome() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);
//   const [rfqDrafts, setRfqDrafts] = useState([]);
//   const [loadingRFQs, setLoadingRFQs] = useState(false);
//   const [selectedRFQ, setSelectedRFQ] = useState(null);
//   const [selectedMaterials, setSelectedMaterials] = useState([]);
//   const [rfqId, setRfqId] = useState(null);

//   const [projects, setProjects] = useState([]);
//   const [loadingProjects, setLoadingProjects] = useState(false);

//   const getRFQs = async () => {
//     setLoadingRFQs(true);
//     try {
//       const data = await fetchRFQs();
//       const rfqsArray = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.data)
//         ? data.data
//         : [];
//       setRfqDrafts(rfqsArray);
//     } catch (err) {
//       console.error("Error fetching RFQs:", err);
//       setRfqDrafts([]);
//     } finally {
//       setLoadingRFQs(false);
//     }
//   };

//   useEffect(() => {
//     getRFQs();
//   }, []);
//   const filteredRFQs = Array.isArray(rfqDrafts)
//     ? rfqDrafts.filter((rfq) => {
//         const search = searchTerm.toLowerCase();

//         return (
//           (rfq?.project?.name || "").toLowerCase().includes(search) || // project name
//           (rfq?.rfqNo || "").toLowerCase().includes(search) || // rfq no
//           (rfq?.supplier?.name || "").toLowerCase().includes(search) || // supplier name
//           (rfq?.deliveryLocation || "").toLowerCase().includes(search) // delivery location
//         );
//       })
//     : [];

//   const totalRFQs = filteredRFQs.length;
//   const totalMaterialsAcrossRFQs = filteredRFQs.reduce(
//     (acc, rfq) => acc + (rfq?.materials?.length || 0),
//     0
//   );

//   const handleRowClick = (rfq) => {
//     setSelectedRFQ({
//       ...rfq,
//       suppliers: rfq?.suppliers || [],
//     });
//     setRfqId(rfq._id);
//   };

//   const handleOpenRFQModal = async () => {
//     setLoadingProjects(true);
//     try {
//       const data = await fetchProjects();
//       setProjects(data || []);
//       setIsRFQModalOpen(true);
//     } catch (err) {
//       console.error("Failed to fetch projects:", err);
//     } finally {
//       setLoadingProjects(false);
//     }
//   };

//   return (
//     <>
//       <MaterialRequestModal
//         open={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         selectedMaterials={selectedMaterials}
//         rfqId={rfqId}
//         setSelectedMaterials={setSelectedMaterials}
//       />

//       <CreateRFQModal
//         open={isRFQModalOpen}
//         onClose={() => setIsRFQModalOpen(false)}
//         projects={projects}
//         loading={loadingProjects}
//       />

//       <div className="flex flex-col gap-4 p-2">
//         {/* Top Toolbar */}
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
//           <div className="w-full md:w-72">
//             <SearchBar
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search By RFQ Number or Project"
//             />
//           </div>
//           <div className="flex flex-wrap items-center gap-4 md:gap-6">
//             <div className="text-sm text-gray-600">
//               RFQs: <strong>{totalRFQs}</strong>
//             </div>
//             <div className="text-sm text-gray-600">
//               Total Materials: <strong>{totalMaterialsAcrossRFQs}</strong>
//             </div>

//             <Button
//               color="black"
//               variant="custom"
//               className="text-sm font-medium text-gray-800 relative"
//               onClick={() => setIsModalOpen(true)}
//             >
//               Open Material Request
//               {selectedMaterials.length > 0 && (
//                 <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
//                   {selectedMaterials.length}
//                 </span>
//               )}
//             </Button>

//             <Button
//               color="red"
//               className="text-white bg-red-600 hover:bg-red-700 text-sm px-4 py-2 rounded-lg font-semibold"
//               variant="custom"
//               onClick={handleOpenRFQModal}
//             >
//               + New RFQ
//             </Button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-200 rounded-md text-xs sm:text-sm bg-white">
//             <thead className="bg-gray-400 text-black">
//               <tr>
//                 <th className="px-2 sm:px-4 py-2 text-left">RFQ No</th>
//                 <th className="px-2 sm:px-4 py-2 text-left">Supplier</th>
//                 <th className="px-2 sm:px-4 py-2 text-left">Materials</th>
//                 <th className="px-2 sm:px-4 py-2 text-left">
//                   Delivery Location
//                 </th>
//                 <th className="px-2 sm:px-4 py-2 text-left">Bidding Start</th>
//                 <th className="px-2 sm:px-4 py-2 text-left">Bidding End</th>
//                 <th className="px-2 sm:px-4 py-2 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loadingRFQs ? (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="text-center px-4 py-6 text-gray-500"
//                   >
//                     <ClipLoader size={28} color="#b91c1c" />
//                   </td>
//                 </tr>
//               ) : filteredRFQs.length > 0 ? (
//                 filteredRFQs.map((rfq, index) => (
//                   <tr
//                     key={rfq._id || index}
//                     className="border-t border-gray-200 cursor-pointer hover:bg-gray-100"
//                     onClick={() => handleRowClick(rfq)}
//                   >
//                     <td className="px-2 sm:px-4 py-2">
//                       {rfq?.rfqNo || `#RFQ-${index + 1}`}
//                     </td>
//                     <td className="px-2 sm:px-4 py-2">
//                       {rfq?.supplier?.name || "--"}
//                     </td>
//                     <td className="px-2 sm:px-4 py-2">
//                       {rfq?.materials?.length || 0}
//                     </td>
//                     <td className="px-2 sm:px-4 py-2">
//                       {rfq?.deliveryLocation || "--"}
//                     </td>
//                     <td className="px-2 sm:px-4 py-2">
//                       {rfq?.biddingStartDate
//                         ? formatDate(rfq.biddingStartDate)
//                         : "--"}
//                     </td>
//                     <td className="px-2 sm:px-4 py-2">
//                       {rfq?.biddingEndDate
//                         ? formatDate(rfq.biddingEndDate)
//                         : "--"}
//                     </td>
//                     <td className="px-2 sm:px-4 py-2">
//                       <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-md text-xs font-medium">
//                         {rfq.status || "Draft"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="text-center px-4 py-6 text-gray-500"
//                   >
//                     No RFQ drafts found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Right Drawer */}
//         <RFQDrawer
//           rfq={selectedRFQ}
//           onClose={() => {
//             setSelectedRFQ(null);
//             getRFQs();
//           }}
//         />
//       </div>
//     </>
//   );
// }
