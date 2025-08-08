import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../../../components/SearchBar";
import Button from "../../../components/Button";

const suppliers = [
  {
    id: 1,
    name: "Adesh Ji Naraina Brick Supplier",
    phone: "9873021371",
    type: "Material Supplier",
    email:"userusage04@gmail.com",
  },
  {
    id: 2,
    name: "Gupta Industries Cantonment",
    phone: "9810473444",
    type: "Material Supplier",
  },
  
  {
    id: 4,
    name: "Sharma Traders",
    phone: "9999999999",
    type: "Material Supplier",
  },
  {
    id: 5,
    name: "Adesh Ji Naraina Brick Supplier",
    phone: "9873021371",
    type: "Material Supplier",
  },
  {
    id: 6,
    name: "Gupta Industries Cantonment",
    phone: "9810473444",
    type: "Material Supplier",
  },
  {
    id: 7,
    name: "Nikhil",
    phone: "8688950076",
    type: "Material Supplier",
    email: "nikhilpaspula16@gmail.com",
  },
];

function SuppliersModal({ isOpen, onClose, onSelect, onCreateParty }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);
  const dropdownRef = useRef();

  useEffect(() => {
    setFilteredSuppliers(
      suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="relative w-full">
      <div
        ref={dropdownRef}
        className="absolute z-50 mt-1 w-full max-h-[400px] bg-white shadow-lg border rounded-xl flex flex-col"
      >
        {/* Search Bar */}
        <div className="p-3 border-b">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search supplier..."
          />
        </div>

        {/* Supplier List */}
        <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="flex justify-between items-center px-3 py-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  onSelect(supplier);
                  onClose();
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center uppercase text-xs font-semibold">
                    {supplier.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {supplier.name}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {supplier.phone}
                    </div>
                  </div>
                </div>
                <div className="text-gray-400 text-xs">{supplier.type}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-center text-gray-500 py-6">
              No suppliers found.
            </div>
          )}
        </div>

        {/* Create Party Button */}
        <div className="p-3 border-t flex justify-center">
          <Button
            variant="outlined"
            color="red"
            borderStyle="dashed"
            size="sm"
            onClick={onCreateParty} // trigger from parent
          >
            + Create Party
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SuppliersModal;

// import React, { useState, useEffect, useRef } from "react";
// import SearchBar from "../../../components/SearchBar";
// import Button from "../../../components/Button";

// function SuppliersModal({ isOpen, onClose, onSelect }) {
//   const dropdownRef = useRef();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suppliers, setSuppliers] = useState([
//     {
//       id: 1,
//       name: "Adesh Ji Naraina Brick Supplier",
//       phone: "9873021371",
//       type: "Material Supplier",
//     },
//     {
//       id: 2,
//       name: "Gupta Industries Cantonment",
//       phone: "9810473444",
//       type: "Material Supplier",
//     },
//     {
//       id: 4,
//       name: "Sharma Traders",
//       phone: "9999999999",
//       type: "Material Supplier",
//     },

//   ]);
//   const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);
//   const [creating, setCreating] = useState(false);
//   const [newSupplier, setNewSupplier] = useState({
//     name: "",
//     phone: "",
//     email: "",
//   });

//   useEffect(() => {
//     setFilteredSuppliers(
//       suppliers.filter((supplier) =>
//         supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [searchTerm, suppliers]);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         onClose();
//       }
//     }

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   const handleCreateSupplier = () => {
//     if (!newSupplier.name || !newSupplier.phone) return;

//     const newEntry = {
//       id: Date.now(),
//       name: newSupplier.name,
//       phone: newSupplier.phone,
//       email: newSupplier.email || "",
//       type: "Material Supplier",
//     };

//     setSuppliers((prev) => [...prev, newEntry]);
//     setNewSupplier({ name: "", phone: "", email: "" });
//     setCreating(false);
//     setSearchTerm(""); // Reset search
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="relative w-full">
//       <div
//         ref={dropdownRef}
//         className="absolute z-50 mt-1 w-full max-h-[500px] bg-white shadow-lg border rounded-xl flex flex-col"
//       >
//         {/* Search Bar */}
//         <div className="p-3 border-b">
//           <SearchBar
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search supplier..."
//           />
//         </div>

//         {/* Supplier List */}
//         <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
//           {filteredSuppliers.length > 0 ? (
//             filteredSuppliers.map((supplier) => (
//               <div
//                 key={supplier.id}
//                 className="flex justify-between items-center px-3 py-3 hover:bg-gray-50 cursor-pointer"
//                 onClick={() => {
//                   onSelect(supplier);
//                   onClose();
//                 }}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center uppercase text-xs font-semibold">
//                     {supplier.name
//                       .split(" ")
//                       .map((w) => w[0])
//                       .slice(0, 2)
//                       .join("")}
//                   </div>
//                   <div>
//                     <div className="font-medium text-gray-800">
//                       {supplier.name}
//                     </div>
//                     <div className="text-gray-500 text-xs">
//                       {supplier.phone}
//                       {supplier.email ? ` • ${supplier.email}` : ""}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-gray-400 text-xs">{supplier.type}</div>
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-center text-gray-500 py-6">
//               No suppliers found.
//             </div>
//           )}
//         </div>

//         {/* Create Supplier */}
//         {creating ? (
//           <div className="p-4 border-t bg-gray-50 space-y-2">
//             <input
//               type="text"
//               className="w-full px-3 py-2 border rounded-md"
//               placeholder="Supplier name"
//               value={newSupplier.name}
//               onChange={(e) =>
//                 setNewSupplier({ ...newSupplier, name: e.target.value })
//               }
//             />
//             <input
//               type="text"
//               className="w-full px-3 py-2 border rounded-md"
//               placeholder="Phone"
//               value={newSupplier.phone}
//               onChange={(e) =>
//                 setNewSupplier({ ...newSupplier, phone: e.target.value })
//               }
//             />
//             <input
//               type="email"
//               className="w-full px-3 py-2 border rounded-md"
//               placeholder="Email (optional)"
//               value={newSupplier.email}
//               onChange={(e) =>
//                 setNewSupplier({ ...newSupplier, email: e.target.value })
//               }
//             />
//             <div className="flex justify-between items-center pt-2">
//               <Button size="sm" onClick={handleCreateSupplier}>
//                 Save
//               </Button>
//               <Button
//                 size="sm"
//                 variant="outlined"
//                 color="gray"
//                 onClick={() => setCreating(false)}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="p-3 border-t flex justify-center bg-white">
//             <Button
//               variant="outlined"
//               color="red"
//               borderStyle="dashed"
//               size="sm"
//               onClick={() => setCreating(true)}
//             >
//               + Create Supplier
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SuppliersModal;
