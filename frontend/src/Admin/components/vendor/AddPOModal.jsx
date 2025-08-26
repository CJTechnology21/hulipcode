import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Select from "react-select";

import {
  fetchVendors,
  fetchArchandClients,
} from "../../../services/leadServices";
import { fetchProjects } from "../../../services/projectServices";
import { createVendorOrder,updateVendorOrder } from "../../../services/vendorOrderServices";
function AddPOModal({
  isOpen,
  onClose,
  onAddPO,
  onUpdatePO,
  mode = "add", // "add" | "edit"
  initialData = null,
}) {
  const [vendors, setVendors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [archClients, setArchClients] = useState([]);

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      project: null,
      orderedBy: null,
      vendor: null,
      amount: "",
      status: "Pending",
      paymentTerms: "",
      deliveryDate: "",
      notes: "",
    },
  });

  // Load dropdowns when modal opens
  useEffect(() => {
    const loadData = async () => {
      try {
        const [vData, pData, acData] = await Promise.all([
          fetchVendors(),
          fetchProjects(),
          fetchArchandClients(),
        ]);

        setVendors(vData?.map((v) => ({ label: v.name, value: v._id })) || []);
        setProjects(pData?.map((p) => ({ label: p.name, value: p._id })) || []);
        setArchClients(
          acData?.map((ac) => ({ label: ac.name, value: ac._id })) || []
        );
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    };

    if (isOpen) loadData();
  }, [isOpen]);

  // // Prefill form in edit mode AFTER options load
  // inside useEffect where we reset for edit mode
  useEffect(() => {
    if (
      mode === "edit" &&
      initialData &&
      vendors.length &&
      projects.length &&
      archClients.length
    ) {
      const prefillData = {
        project: initialData.project?._id || initialData.project || null,
        orderedBy: initialData.orderedBy?._id || initialData.orderedBy || null,
        vendor: initialData.vendor?._id || initialData.vendor || null,
        amount: initialData.amount || "",
        status: initialData.status || "Pending",
        paymentTerms: initialData.paymentTerms || "",
        deliveryDate: initialData.deliveryDate
          ? initialData.deliveryDate.slice(0, 10)
          : "",
        notes: initialData.notes || "",
      };

      // console.log("🔄 Prefilling form with:", prefillData); // ✅ debug
      reset(prefillData);
    }

    if (mode === "add") {
      const emptyData = {
        project: null,
        orderedBy: null,
        vendor: null,
        amount: "",
        status: "Pending",
        paymentTerms: "",
        deliveryDate: "",
        notes: "",
      };
      // console.log("🆕 Resetting form for add:", emptyData); // ✅ debug
      reset(emptyData);
    }
  }, [mode, initialData, vendors, projects, archClients, reset]);

  // inside onSubmit
  const onSubmit = (data) => {
    const payload = {
      ...data,
      amount: parseFloat(data.amount) || 0,
    };

    if (mode === "edit") {
      const updatedPO = { ...payload, _id: initialData._id }; // ✅ always keep _id
      // console.log("✏️ Submitting EDIT payload:", updatedPO); // ✅ debug
      onUpdatePO(updatedPO);
    } else {
      // console.log("➕ Submitting ADD payload:", payload); // ✅ debug
      onAddPO(payload);
    }

    onClose();
    reset();
  };
  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Paid", value: "Paid" },
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg p-6 m-4 w-full max-w-lg md:max-w-xl lg:max-w-2xl">
          <Dialog.Title className="text-xl font-semibold mb-2">
            {mode === "edit" ? "Edit Purchase Order" : "Add Purchase Order"}
          </Dialog.Title>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <Controller
              name="project"
              control={control}
              render={({ field }) => (
                <Select
                  options={projects}
                  value={projects.find((p) => p.value === field.value) || null}
                  onChange={(selected) =>
                    field.onChange(selected?.value || null)
                  }
                  placeholder="Select Project"
                />
              )}
            />
          </div>

          {/* Ordered By */}
          <div>
            <label className="block text-sm font-medium mb-1">Ordered By</label>
            <Controller
              name="orderedBy"
              control={control}
              render={({ field }) => (
                <Select
                  options={archClients}
                  value={
                    archClients.find((ac) => ac.value === field.value) || null
                  }
                  onChange={(selected) =>
                    field.onChange(selected?.value || null)
                  }
                  placeholder="Select Ordered By"
                />
              )}
            />
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium mb-1">Vendor</label>
            <Controller
              name="vendor"
              control={control}
              render={({ field }) => (
                <Select
                  options={vendors}
                  value={vendors.find((v) => v.value === field.value) || null}
                  onChange={(selected) =>
                    field.onChange(selected?.value || null)
                  }
                  placeholder="Select Vendor"
                />
              )}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <Input
              name="amount"
              type="number"
              placeholder="Enter amount"
              {...register("amount")}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  options={statusOptions}
                  value={
                    statusOptions.find((s) => s.value === field.value) || null
                  }
                  onChange={(selected) =>
                    field.onChange(selected?.value || null)
                  }
                  placeholder="Select Status"
                />
              )}
            />
          </div>

          {/* Payment Terms */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Payment Terms
            </label>
            <Input
              name="paymentTerms"
              placeholder="Enter payment terms"
              {...register("paymentTerms")}
            />
          </div>

          {/* Delivery Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Delivery Date
            </label>
            <Input
              name="deliveryDate"
              type="date"
              {...register("deliveryDate")}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Input
              name="notes"
              placeholder="Additional notes"
              {...register("notes")}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <Button color="gray" variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              color="green"
              variant="custom"
              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
              onClick={handleSubmit(onSubmit)}
            >
              {mode === "edit" ? "Update PO" : "Add PO"}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
export default AddPOModal;
