import { useState, useEffect } from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import { FaSearch, FaFilePdf } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import Button from "../../components/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { createProjectFromQuote } from "../../services/quoteServices"; // ✅ API

function Contract() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Extract all data from navigation state
  const { quoteId, totalAmount, qid, architectId } = location.state || {};

  // ✅ Log values once when component mounts
  useEffect(() => {
    console.log("🧾 Contract Page Loaded With Data:");
    console.log("• Quote MongoId:", quoteId);
    console.log("• QID:", qid);
    console.log("• Total Amount:", totalAmount);
    console.log("• Architect ID:", architectId);
  }, [quoteId, qid, totalAmount, architectId]);

  // ✅ Handle contract selection
  const handleContractClick = () => {
    if (!quoteId) {
      toast.error("Quote details missing!");
      return;
    }

    const selected = {
      id: quoteId,
      name: `Contract for Quote ${qid || quoteId}`,
      amount: totalAmount || 0,
    };

    setSelectedContract(selected);

    console.log("📄 Contract Selected:");
    console.log(selected);
  };

  // ✅ Handle signing agreement — create project in backend
  const handleSignAgreement = async () => {
    if (!selectedContract?.id) {
      toast.error("Please select a contract first.");
      return;
    }

    try {
      setIsCreating(true);
      toast.info("Creating project from quote...");

      console.log("🚀 Creating Project With:");
      console.log("• Quote MongoId:", selectedContract.id);
      console.log("• Architect ID:", architectId);

      // Send architectId along with quoteId to backend
      await createProjectFromQuote(selectedContract.id, architectId);

      toast.success("Agreement signed & project created successfully!");
      navigate("/projects");
    } catch (err) {
      console.error("❌ Error creating project:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to create project. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <SideBar />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Contract"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6 flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col justify-between">
            {/* Top Section */}
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="flex justify-end">
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Search"
                    className="border rounded-xl px-3 py-1 w-full pr-9 text-sm"
                  />
                  <FaSearch className="absolute right-3 top-2.5 text-gray-500 text-sm" />
                </div>
              </div>

              {/* Contract Row */}
              <div
                className={`border rounded-lg p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 cursor-pointer ${
                  selectedContract ? "ring-2 ring-red-500" : ""
                }`}
                onClick={handleContractClick}
              >
                <div className="flex items-center gap-3">
                  <FaFilePdf className="text-green-600 text-xl" />
                  <span className="font-medium">
                    {qid ? `Quote #${qid}` : "No Quote Selected"}
                  </span>
                  <span className="bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                    APPROVED
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>
                    {totalAmount
                      ? `${Number(totalAmount).toLocaleString()} RS`
                      : "N/A"}
                  </span>
                  <FiChevronDown className="text-gray-500" />
                </div>
              </div>

              {/* Optional Architect Info Display */}
              {/* {architectId && (
                <div className="text-sm text-gray-700 mt-2">
                  <strong>Architect ID:</strong> {architectId}
                </div>
              )} */}
            </div>

            {/* Bottom Buttons */}
            <div className="flex gap-3 mt-6">
              {/*  Sign Agreement */}
              <Button
                className={`bg-red-700 hover:bg-red-800 text-white ${
                  isCreating ? "opacity-60 cursor-not-allowed" : ""
                }`}
                size="md"
                variant="custom"
                disabled={!selectedContract || isCreating}
                onClick={handleSignAgreement}
              >
                {isCreating ? "Signing..." : "Sign Agreement"}
              </Button>

              {/* Auto Contract */}
              <Button
                className="bg-red-700 hover:bg-red-800 text-white"
                size="md"
                variant="custom"
                disabled={!selectedContract}
                onClick={() => navigate("/projects")}
              >
                Auto Contract
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contract;

// import { useState } from "react";
// import SideBar from "./SideBar";
// import Header from "./Header";
// import { FaSearch, FaFilePdf } from "react-icons/fa";
// import { FiChevronDown } from "react-icons/fi";
// import Button from "../../components/Button";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import { createProjectFromQuote } from "../../services/quoteServices"; // ✅ API

// function Contract() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedContract, setSelectedContract] = useState(null);
//   const [isCreating, setIsCreating] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // ✅ Extract all data from navigation state
//   const { quoteId, totalAmount, qid, architectID } = location.state || {};

//   // ✅ Handle contract selection
//   const handleContractClick = () => {
//     if (!quoteId) {
//       toast.error("Quote details missing!");
//       return;
//     }

//     setSelectedContract({
//       id: quoteId,
//       name: `Contract for Quote ${qid || quoteId}`,
//       amount: totalAmount || 0,
//     });
//   };

//   // ✅ Handle signing agreement — create project in backend
//   const handleSignAgreement = async () => {
//     if (!selectedContract?.id) {
//       toast.error("Please select a contract first.");
//       return;
//     }

//     try {
//       setIsCreating(true);
//       toast.info("Creating project from quote...");

//       //  Send architectId along with quoteId to backend
//       await createProjectFromQuote(selectedContract.id, architectID);
//       console.log("architectId and MongoId: ", architectID,selectedContract.id)
//       toast.success("Agreement signed & project created successfully!");
//       navigate("/projects");
//     } catch (err) {
//       console.error("Error creating project:", err);
//       toast.error(
//         err.response?.data?.message ||
//           "Failed to create project. Please try again."
//       );
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:block`}
//       >
//         <SideBar />
//       </div>

//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main Content */}
//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Contract"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />
//         <div className="p-6 flex-1 flex flex-col gap-4">
//           <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col justify-between">
//             {/* Top Section */}
//             <div className="flex flex-col gap-4">
//               {/* Search */}
//               <div className="flex justify-end">
//                 <div className="relative w-64">
//                   <input
//                     type="text"
//                     placeholder="Search"
//                     className="border rounded-xl px-3 py-1 w-full pr-9 text-sm"
//                   />
//                   <FaSearch className="absolute right-3 top-2.5 text-gray-500 text-sm" />
//                 </div>
//               </div>

//               {/* Contract Row */}
//               <div
//                 className={`border rounded-lg p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 cursor-pointer ${
//                   selectedContract ? "ring-2 ring-red-500" : ""
//                 }`}
//                 onClick={handleContractClick}
//               >
//                 <div className="flex items-center gap-3">
//                   <FaFilePdf className="text-green-600 text-xl" />
//                   <span className="font-medium">
//                     {qid ? `Quote #${qid}` : "No Quote Selected"}
//                   </span>
//                   <span className="bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
//                     APPROVED
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm font-semibold">
//                   <span>
//                     {totalAmount
//                       ? `${Number(totalAmount).toLocaleString()} RS`
//                       : "N/A"}
//                   </span>
//                   <FiChevronDown className="text-gray-500" />
//                 </div>
//               </div>

//               {/* Architect Info (Optional Display) */}
              
//             </div>

//             {/* Bottom Buttons */}
//             <div className="flex gap-3 mt-6">
//               {/*  Sign Agreement */}
//               <Button
//                 className={`bg-red-700 hover:bg-red-800 text-white ${
//                   isCreating ? "opacity-60 cursor-not-allowed" : ""
//                 }`}
//                 size="md"
//                 variant="custom"
//                 disabled={!selectedContract || isCreating}
//                 onClick={handleSignAgreement}
//               >
//                 {isCreating ? "Signing..." : "Sign Agreement"}
//               </Button>

//               {/* Auto Contract */}
//               <Button
//                 className="bg-red-700 hover:bg-red-800 text-white"
//                 size="md"
//                 variant="custom"
//                 disabled={!selectedContract}
//                 onClick={() => navigate("/projects")}
//               >
//                 Auto Contract
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Contract;

// import { useState } from "react";
// import SideBar from "./SideBar";
// import Header from "./Header";
// import { FaSearch, FaFilePdf } from "react-icons/fa";
// import { FiChevronDown } from "react-icons/fi";
// import Button from "../../components/Button";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import { createProjectFromQuote } from "../../services/quoteServices"; // ✅ import API

// function Contract() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedContract, setSelectedContract] = useState(null);
//   const [isCreating, setIsCreating] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   //  Get data from QuoteSummary navigation
//   const { quoteId, totalAmount,qid } = location.state || {};

//   //  Handle selecting the contract (based on quote)
//   const handleContractClick = () => {
//     if (!quoteId) {
//       toast.error("Quote details missing!");
//       return;
//     }
//     setSelectedContract({
//       id: quoteId,
//       name: `Contract for Quote ${quoteId}`,
//       amount: totalAmount || 0,
//     });
//   };

//   // ✅ Handle signing agreement → create project in backend
//   const handleSignAgreement = async () => {
//     if (!selectedContract?.id) {
//       toast.error("Please select a contract first.");
//       return;
//     }

//     try {
//       setIsCreating(true);
//       toast.info("Creating project from quote...");

//       await createProjectFromQuote(selectedContract.id);

//       toast.success("Agreement signed & project created successfully!");
//       navigate("/projects");
//     } catch (err) {
//       console.error("Error creating project:", err);
//       toast.error(
//         err.response?.data?.message ||
//           "Failed to create project. Please try again."
//       );
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:block`}
//       >
//         <SideBar />
//       </div>

//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main Content */}
//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Contract"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />
//         <div className="p-6 flex-1 flex flex-col gap-4">
//           <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col justify-between">
//             {/* Top Section */}
//             <div className="flex flex-col gap-4">
//               {/* Search */}
//               <div className="flex justify-end">
//                 <div className="relative w-64">
//                   <input
//                     type="text"
//                     placeholder="Search"
//                     className="border rounded-xl px-3 py-1 w-full pr-9 text-sm"
//                   />
//                   <FaSearch className="absolute right-3 top-2.5 text-gray-500 text-sm" />
//                 </div>
//               </div>

//               {/* Contract Row */}
//               <div
//                 className={`border rounded-lg p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 cursor-pointer ${
//                   selectedContract ? "ring-2 ring-red-500" : ""
//                 }`}
//                 onClick={handleContractClick}
//               >
//                 <div className="flex items-center gap-3">
//                   <FaFilePdf className="text-green-600 text-xl" />
//                   <span className="font-medium">
//                     {qid ? `Quote #${qid}` : "No Quote Selected"}
//                   </span>
//                   <span className="bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
//                     APPROVED
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm font-semibold">
//                   <span>
//                     {totalAmount
//                       ? `${Number(totalAmount).toLocaleString()} RS`
//                       : "N/A"}
//                   </span>
//                   <FiChevronDown className="text-gray-500" />
//                 </div>
//               </div>
//             </div>

//             {/* Bottom Buttons */}
//             <div className="flex gap-3 mt-6">
//               {/* ✅ Sign Agreement Button */}
//               <Button
//                 className={`bg-red-700 hover:bg-red-800 text-white ${
//                   isCreating ? "opacity-60 cursor-not-allowed" : ""
//                 }`}
//                 size="md"
//                 variant="custom"
//                 disabled={!selectedContract || isCreating}
//                 onClick={handleSignAgreement}
//               >
//                 {isCreating ? "Signing..." : "Sign Agreement"}
//               </Button>

//               {/* Auto Contract Button */}
//               <Button
//                 className="bg-red-700 hover:bg-red-800 text-white"
//                 size="md"
//                 variant="custom"
//                 disabled={!selectedContract}
//                 onClick={() => navigate("/projects")}
//               >
//                 Auto Contract
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Contract;


// import { useState } from "react";
// import SideBar from "./SideBar";
// import Header from "./Header";
// import { FaSearch, FaFilePdf } from "react-icons/fa";
// import { FiChevronDown } from "react-icons/fi";
// import Button from "../../components/Button";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useLocation } from "react-router-dom";
// function Contract() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedContract, setSelectedContract] = useState(null);
//   const location = useLocation();
//   const {quoteId,totalAmount} = location.state || {};
//   const navigate = useNavigate();

//   const handleContractClick = () => {
//     setSelectedContract("P-100/Q-10"); 
//   };

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:block`}
//       >
//         <SideBar />
//       </div>

//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main Content */}
//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Contract"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />
//         <div className="p-6 flex-1 flex flex-col gap-4">
//           <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col justify-between">
//             {/* Top Section */}
//             <div className="flex flex-col gap-4">
//               {/* Search */}
//               <div className="flex justify-end">
//                 <div className="relative w-64">
//                   <input
//                     type="text"
//                     placeholder="Search"
//                     className="border rounded-xl px-3 py-1 w-full pr-9 text-sm"
//                   />
//                   <FaSearch className="absolute right-3 top-2.5 text-gray-500 text-sm" />
//                 </div>
//               </div>

//               {/* Contract Row */}
//               <div
//                 className={`border rounded-lg p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 cursor-pointer ${
//                   selectedContract ? "ring-2 ring-red-500" : ""
//                 }`}
//                 onClick={handleContractClick}
//               >
//                 <div className="flex items-center gap-3">
//                   <FaFilePdf className="text-green-600 text-xl" />
//                   <span className="font-medium">P-100/Q-10</span>
//                   <span className="bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
//                     APPROVED
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm font-semibold">
//                   <span>2,00,000 RS</span>
//                   <FiChevronDown className="text-gray-500" />
//                 </div>
//               </div>
//             </div>

//             {/* Bottom Buttons */}
//             <div className="flex gap-3 mt-6">
//               <Button
//                 className="bg-red-700 hover:bg-red-800 text-white"
//                 size="md"
//                 variant="custom"
//                 disabled={!selectedContract}
//                 onClick={() => {
//                   toast.success("Agreement Signed Successfully");
//                   navigate("/projects");
//                 }}
//               >
//                 Sign Agreement
//               </Button>

//               <Button
//                 className="bg-red-700 hover:bg-red-800 text-white"
//                 size="md"
//                 variant="custom"
//                 disabled={!selectedContract}
//                 onClick={() => navigate("/projects")}
//               >
//                 Auto Contract
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Contract;
