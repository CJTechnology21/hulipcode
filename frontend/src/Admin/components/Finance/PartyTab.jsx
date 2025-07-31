import React, { useState } from "react";
import Button from "../../../components/Button";
import SearchBar from "../../../components/SearchBar";
import { partyData, transactionData } from "./transactions";
import { FaUser, FaArrowLeft, FaDownload } from "react-icons/fa";
import CreateTransactionModal from "./CreateTransactionModal";

const PartyTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParty, setSelectedParty] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const filteredData = partyData.filter((party) =>
    party.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBack = () => setSelectedParty(null);

  return (
    <div className="w-full px-4 md:px-6">
      {/* Summary Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            Advance Paid <FaDownload className="text-gray-500 cursor-pointer" />
          </p>
          <p className="text-xl font-bold text-green-800">₹ 94,82,024.7</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">To Pay</p>
          <p className="text-xl font-bold text-red-800">₹ 3,03,975</p>
        </div>
        <div className="bg-pink-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">To Receive</p>
          <p className="text-xl font-bold text-red-800">₹ 0</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Advance Received</p>
          <p className="text-xl font-bold text-green-800">₹ 1,00,44,263</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 gap-2 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:max-w-xl">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search parties..."
          />
          <Button variant="outlined" size="sm" color="blue">
            Filter
          </Button>
          <select className="px-3 py-2 border rounded-md text-sm">
            <option>Active</option>
            <option>Inactive</option>
            <option>All</option>
          </select>
        </div>
        <Button
          variant="custom"
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          + New Party
        </Button>
      </div>

      {/* Main Content Area: List + Detail */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Party List */}
        <div
          className={`transition-all bg-white rounded-lg shadow-sm divide-y overflow-auto max-h-[70vh] w-full ${
            selectedParty ? "lg:w-1/2" : "w-full"
          }`}
        >
          {filteredData.length > 0 ? (
            filteredData.map((party, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                  selectedParty?.name === party.name ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedParty(party)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full" />
                  <div>
                    <p className="font-medium">{party.name}</p>
                    {party.role && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">
                        {party.role}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{party.amount}</p>
                  {party.status && (
                    <p
                      className={`text-xs ${
                        party.status === "Settled"
                          ? "text-gray-500"
                          : "text-green-600"
                      }`}
                    >
                      {party.status}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-gray-500">No parties found.</p>
          )}
        </div>

        {/* Party Detail */}
        {selectedParty && (
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-sm max-h-[70vh] overflow-auto flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start p-4 border-b">
                <div className="flex items-start gap-3">
                  <button
                    onClick={handleBack}
                    className="text-gray-500 hover:text-gray-700 text-lg mt-1"
                  >
                    <FaArrowLeft />
                  </button>

                  <div className="flex gap-3 items-start">
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl">
                      <FaUser />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedParty.name}
                      </p>
                      <div className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded mt-1 capitalize">
                        {selectedParty.role}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Opening Balance : 0
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedParty.amount}
                  </p>
                  {selectedParty.status && (
                    <p className="text-xs text-green-600">
                      {selectedParty.status}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border-b">
                <div className="text-red-600 mt-1">
                  <FaUser />
                </div>
                <div>
                  <div className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded mb-1 w-fit">
                    Party Received
                  </div>
                  <div className="bg-red-100 text-red-800 text-sm font-bold px-2 py-1 rounded w-fit">
                    {selectedParty.amount}
                  </div>
                </div>
              </div>

              <div className="space-y-4 px-4 py-4">
                {transactionData[selectedParty.name]?.length > 0 ? (
                  transactionData[selectedParty.name].map((txn, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="flex justify-between text-gray-600 font-medium">
                        <span>{txn.date}</span>
                        <span>{txn.amount}</span>
                      </div>
                      <p className="text-gray-600 whitespace-pre-line">
                        {txn.desc}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No transactions found.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between border-t px-4 py-3 gap-2">
              <Button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-semibold w-full sm:w-auto">
                - Payment Out
              </Button>
              <Button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-semibold w-full sm:w-auto"
                onClick={() => setOpenModal(true)}
              >
                + Create Transaction
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateTransactionModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default PartyTab;

// import React, { useState } from "react";
// import Button from "../../../components/Button";
// import SearchBar from "../../../components/SearchBar";
// import { partyData, transactionData } from "./transactions";
// import { FaUser, FaArrowLeft, FaDownload } from "react-icons/fa";
// import CreateTransactionModal from "./CreateTransactionModal";

// const PartyTab = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedParty, setSelectedParty] = useState(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);

//   const filteredData = partyData.filter((party) =>
//     party.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleBack = () => setSelectedParty(null);

//   return (
//     <div className="w-full px-4 md:px-6">
//       {/* Summary Boxes */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-green-50 p-4 rounded-lg shadow-sm">
//           <p className="text-sm text-gray-600 flex items-center gap-2">
//             Advance Paid <FaDownload className="text-gray-500 cursor-pointer" />
//           </p>
//           <p className="text-xl font-bold text-green-800">₹ 94,82,024.7</p>
//         </div>
//         <div className="bg-red-50 p-4 rounded-lg shadow-sm">
//           <p className="text-sm text-gray-600">To Pay</p>
//           <p className="text-xl font-bold text-red-800">₹ 3,03,975</p>
//         </div>
//         <div className="bg-pink-50 p-4 rounded-lg shadow-sm">
//           <p className="text-sm text-gray-600">To Receive</p>
//           <p className="text-xl font-bold text-red-800">₹ 0</p>
//         </div>
//         <div className="bg-green-50 p-4 rounded-lg shadow-sm">
//           <p className="text-sm text-gray-600">Advance Received</p>
//           <p className="text-xl font-bold text-green-800">₹ 1,00,44,263</p>
//         </div>
//       </div>

//       {/* Filters and Actions */}
//       <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 gap-2 sm:gap-4">
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:max-w-xl">
//           <SearchBar
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search parties..."
//           />
//           <Button variant="outlined" size="sm" color="blue">
//             Filter
//           </Button>
//           <select className="px-3 py-2 border rounded-md text-sm">
//             <option>Active</option>
//             <option>Inactive</option>
//             <option>All</option>
//           </select>
//         </div>
//         <Button
//           variant="custom"
//           size="sm"
//           className="bg-red-600 hover:bg-red-700 text-white"
//         >
//           + New Party
//         </Button>
//       </div>

//       {/* Main Content Area: List + Detail */}
//       <div className="flex flex-col lg:flex-row gap-4">
//         {/* Party List */}
//         <div
//           className={`transition-all bg-white rounded-lg shadow-sm divide-y overflow-auto max-h-[70vh] w-full ${
//             selectedParty ? "lg:w-1/2" : "w-full"
//           }`}
//         >
//           {filteredData.length > 0 ? (
//             filteredData.map((party, index) => (
//               <div
//                 key={index}
//                 className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 ${
//                   selectedParty?.name === party.name ? "bg-gray-100" : ""
//                 }`}
//                 onClick={() => setSelectedParty(party)}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 bg-gray-200 rounded-full" />
//                   <div>
//                     <p className="font-medium">{party.name}</p>
//                     {party.role && (
//                       <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">
//                         {party.role}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-semibold">{party.amount}</p>
//                   {party.status && (
//                     <p
//                       className={`text-xs ${
//                         party.status === "Settled"
//                           ? "text-gray-500"
//                           : "text-green-600"
//                       }`}
//                     >
//                       {party.status}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center py-4 text-gray-500">No parties found.</p>
//           )}
//         </div>

//         {/* Party Detail */}
//         {selectedParty && (
//           <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-sm max-h-[70vh] overflow-auto flex flex-col justify-between">
//             <div>
//               <div className="flex justify-between items-start p-4 border-b">
//                 <div className="flex items-start gap-3">
//                   <button
//                     onClick={handleBack}
//                     className="text-gray-500 hover:text-gray-700 text-lg mt-1"
//                   >
//                     <FaArrowLeft />
//                   </button>

//                   <div className="flex gap-3 items-start">
//                     <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl">
//                       <FaUser />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-gray-800">
//                         {selectedParty.name}
//                       </p>
//                       <div className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded mt-1 capitalize">
//                         {selectedParty.role}
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">
//                         Opening Balance : 0
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="text-right flex flex-col items-end gap-1">
//                   <p className="text-sm font-semibold text-gray-800">
//                     {selectedParty.amount}
//                   </p>
//                   {selectedParty.status && (
//                     <p className="text-xs text-green-600">
//                       {selectedParty.status}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-start gap-3 p-4 border-b">
//                 <div className="text-red-600 mt-1">
//                   <FaUser />
//                 </div>
//                 <div>
//                   <div className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded mb-1 w-fit">
//                     Party Received
//                   </div>
//                   <div className="bg-red-100 text-red-800 text-sm font-bold px-2 py-1 rounded w-fit">
//                     {selectedParty.amount}
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4 px-4 py-4">
//                 {transactionData[selectedParty.name]?.length > 0 ? (
//                   transactionData[selectedParty.name].map((txn, idx) => (
//                     <div key={idx} className="text-sm">
//                       <div className="flex justify-between text-gray-600 font-medium">
//                         <span>{txn.date}</span>
//                         <span>{txn.amount}</span>
//                       </div>
//                       <p className="text-gray-600 whitespace-pre-line">
//                         {txn.desc}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-400">No transactions found.</p>
//                 )}
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row justify-between border-t px-4 py-3 gap-2">
//               <Button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-semibold w-full sm:w-auto">
//                 - Payment Out
//               </Button>
//               <Button
//                 className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-semibold w-full sm:w-auto"
//                 onClick={() => setOpenModal(true)}
//               >
//                 + Create Transaction
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       <CreateTransactionModal open={openModal} onClose={() => setOpenModal(false)} />
//     </div>
//   );
// };

// export default PartyTab;

