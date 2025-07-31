import React, { useState } from "react";
import { MdFilterList } from "react-icons/md";
import Button from "../../../components/Button";
import { allTransactions } from "./transactions";
import clsx from "clsx";
import TransactionModal from "./TransactionModal";
import CreateNewTransactionModal from "./CreateNewTransactionModal";
function TransactionTab() {
  const [filteredTransactions, setFilteredTransactions] =
    useState(allTransactions);

  const [selectedTxn, setSelectedTxn] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [newTransactionModal, setNewTransactionModal] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    site: "",
    startDate: "",
    endDate: "",
  });

  const handleFilter = () => {
    let result = allTransactions.filter((txn) => {
      const matchesType = filters.type ? txn.type === filters.type : true;
      const matchesStatus = filters.status
        ? txn.status === filters.status
        : true;
      const matchesSite = filters.site
        ? txn.site.toLowerCase().includes(filters.site.toLowerCase())
        : true;

      const txnDate = new Date(txn.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      const matchesDate =
        (!startDate || txnDate >= startDate) &&
        (!endDate || txnDate <= endDate);

      return matchesType && matchesStatus && matchesSite && matchesDate;
    });

    setFilteredTransactions(result);
  };

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <select
            name="type"
            value={filters.type}
            onChange={handleInputChange}
            className="text-sm px-3 py-2 border rounded-md"
          >
            <option value="">All Types</option>
            <option value="Payment Out">Payment Out</option>
          </select>

          <input
            type="text"
            name="site"
            placeholder="Search Site"
            value={filters.site}
            onChange={handleInputChange}
            className="text-sm px-3 py-2 border rounded-md"
          />

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleInputChange}
            className="text-sm px-3 py-2 border rounded-md"
          />

          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleInputChange}
            className="text-sm px-3 py-2 border rounded-md"
          />

          <Button
            onClick={handleFilter}
            variant="custom"
            className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
          >
            <MdFilterList /> Apply Filter
          </Button>
        </div>

        <Button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-semibold"
          onClick={() => setNewTransactionModal(true)}
        >
          + Create Transaction
        </Button>
      </div>

      <div className="hidden sm:grid grid-cols-3 bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-3 rounded-t-md sticky top-0 z-10">
        <div className="uppercase">Party</div>
        <div className="uppercase">Details</div>
        <div className="text-right uppercase">Status</div>
      </div>

      <div className="bg-white rounded-md shadow-sm divide-y">
        {filteredTransactions.length ? (
          filteredTransactions.map((txn, idx) => {
            const isPaymentIn = txn.type === "Payment In";

            return (
              <div
                onClick={() => {
                  setSelectedTxn(txn);
                  setShowDrawer(true);
                }}
                key={idx}
                className="grid sm:grid-cols-3 grid-cols-1 px-4 py-4 items-start sm:items-center text-sm hover:bg-gray-50 gap-2"
              >
                <div className="flex gap-3">
                  <div
                    className={clsx(
                      "px-2 py-1 font-bold rounded text-center min-w-[60px] text-sm flex flex-col items-center justify-center",
                      isPaymentIn
                        ? "bg-green-100 text-green-700"
                        : "bg-pink-100 text-pink-700"
                    )}
                  >
                    <span className="font-medium">
                      {new Date(txn.date).toLocaleDateString("en-GB")}
                    </span>
                    <span>{isPaymentIn ? "₹↓" : "₹↑"}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{txn.name}</p>
                    <p className="text-xs text-gray-500">{txn.type}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-800">{txn.site}</p>
                  <p className="text-xs text-gray-500">{txn.detail}</p>
                </div>

                <div className="text-right">
                  <p
                    className={clsx(
                      "font-semibold",
                      isPaymentIn ? "text-green-700" : "text-pink-700"
                    )}
                  >
                    {txn.amount}
                  </p>
                  <p className="text-xs">
                    {txn.status === "-" ? (
                      "-"
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {txn.status}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm">
            No transactions found.
          </div>
        )}
      </div>

      <TransactionModal
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        transaction={selectedTxn}
      />

      <CreateNewTransactionModal
        open={newTransactionModal}
        onClose={() => setNewTransactionModal(false)}
        onCreate={(newData) => {
          // Handle the created transaction here
          console.log("New transaction:", newData);
          setNewTransactionModal(false); // Close modal after create
        }}
      />
    </div>
  );
}

export default TransactionTab;
