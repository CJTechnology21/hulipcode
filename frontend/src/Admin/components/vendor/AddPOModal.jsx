import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import Input from "../../../components/Input";
import DropDown from "../../../components/DropDown";
import Button from "../../../components/Button";

export default function AddPOModal({ isOpen, onClose, onAddPO }) {
  const [form, setForm] = useState({
    project: "",
    orderedBy: "",
    vendor: "",
    amount: "",
    date: "",
    status: "Pending",
    paymentTerms: "",
    deliveryDate: "",
    notes: "",
    items: [],
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.vendor || !form.amount) return;
    onAddPO({
      ...form,
      amount: parseFloat(form.amount),
    });
    onClose();
    setForm({
      project: "",
      orderedBy: "",
      vendor: "",
      amount: "",
      date: "",
      status: "Pending",
      paymentTerms: "",
      deliveryDate: "",
      notes: "",
      items: [],
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full space-y-4">
          <Dialog.Title className="text-xl font-semibold">
            Add Purchase Order
          </Dialog.Title>

          <Input
            name="project"
            placeholder="Project Name"
            value={form.project}
            onChange={(e) => handleChange("project", e.target.value)}
          />
          <Input
            name="orderedBy"
            placeholder="Ordered By"
            value={form.orderedBy}
            onChange={(e) => handleChange("orderedBy", e.target.value)}
          />
          <Input
            name="vendor"
            placeholder="Vendor Name"
            value={form.vendor}
            onChange={(e) => handleChange("vendor", e.target.value)}
          />
          <Input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
          />
          <DropDown
            label="Status"
            name="status"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            options={["Pending", "Paid"]}
          />
          <Input
            name="paymentTerms"
            placeholder="Payment Terms"
            value={form.paymentTerms}
            onChange={(e) => handleChange("paymentTerms", e.target.value)}
          />
          <Input
            name="deliveryDate"
            type="date"
            placeholder="Delivery Date"
            value={form.deliveryDate}
            onChange={(e) => handleChange("deliveryDate", e.target.value)}
          />
          <Input
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button color="gray" variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              color="green"
              variant="custom"
              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
              onClick={handleSubmit}
            >
              Add PO
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
