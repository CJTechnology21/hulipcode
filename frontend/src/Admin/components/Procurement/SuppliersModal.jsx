import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../../../components/SearchBar";
import Button from "../../../components/Button";
import suppliers from './suppliersData'
function SuppliersModal({ isOpen, onClose, onSelect, onCreateParty }) {
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedSupplier, setSelectedSupplier] = useState(null);
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
