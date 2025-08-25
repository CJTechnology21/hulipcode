import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../../../components/Input";
import DropDown from "../../../components/DropDown";
import Button from "../../../components/Button";

//  Import services instead of defining here
import { fetchVendors, fetchArchandClients } from "../../../services/leadServices";
import { fetchProjects } from "../../../services/projectServices";

// --- VALIDATION SCHEMA ---
const schema = yup.object().shape({
  project: yup.string().required("Project is required"),
  orderedBy: yup.string().required("Ordered By is required"),
  vendor: yup.string().required("Vendor is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  date: yup.date().nullable(),
  status: yup.string().oneOf(["Pending", "Paid"]).default("Pending"),
  paymentTerms: yup.string(),
  deliveryDate: yup.date().nullable(),
  notes: yup.string(),
});

export default function AddPOModal({ isOpen, onClose, onAddPO }) {
  const [vendors, setVendors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [archClients, setArchClients] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
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
    },
  });

  // Fetch dropdown data on modal open
  useEffect(() => {
    const loadData = async () => {
      try {
        const [vData, pData, acData] = await Promise.all([
          fetchVendors(),
          fetchProjects(),
          fetchArchandClients(),
        ]);

        setVendors(vData?.map(v => ({ label: v.name, value: v.id })) || []);
        setProjects(pData?.map(p => ({ label: p.name, value: p.id })) || []);
        setArchClients(
          acData?.map(ac => ({ label: ac.name, value: ac.id })) || []
        );
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    };

    if (isOpen) loadData();
  }, [isOpen]);

  const onSubmit = (data) => {
    onAddPO({
      ...data,
      amount: parseFloat(data.amount),
    });
    onClose();
    reset();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg p-6 m-4 max-w-lg w-full space-y-4">
          <Dialog.Title className="text-xl font-semibold">
            Add Purchase Order
          </Dialog.Title>

          {/* Project */}
          <DropDown
            label="Project"
            name="project"
            value=""
            options={projects}
            onChange={(e) => setValue("project", e.target.value)}
          />
          {errors.project && (
            <p className="text-red-500 text-sm">{errors.project.message}</p>
          )}

          {/* Ordered By */}
          <DropDown
            label="Ordered By"
            name="orderedBy"
            value=""
            options={archClients}
            onChange={(e) => setValue("orderedBy", e.target.value)}
          />
          {errors.orderedBy && (
            <p className="text-red-500 text-sm">{errors.orderedBy.message}</p>
          )}

          {/* Vendor */}
          <DropDown
            label="Vendor"
            name="vendor"
            value=""
            options={vendors}
            onChange={(e) => setValue("vendor", e.target.value)}
          />
          {errors.vendor && (
            <p className="text-red-500 text-sm">{errors.vendor.message}</p>
          )}

          {/* Amount */}
          <Input
            name="amount"
            type="number"
            placeholder="Amount"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}

          {/* Status */}
          <DropDown
            label="Status"
            name="status"
            options={["Pending", "Paid"]}
            onChange={(e) => setValue("status", e.target.value)}
          />

          {/* Payment Terms */}
          <Input
            name="paymentTerms"
            placeholder="Payment Terms"
            {...register("paymentTerms")}
          />

          {/* Delivery Date */}
          <Input
            name="deliveryDate"
            type="date"
            placeholder="Delivery Date"
            {...register("deliveryDate")}
          />

          {/* Notes */}
          <Input
            name="notes"
            placeholder="Notes"
            {...register("notes")}
          />

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
              Add PO
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// import React, { useState } from "react";
// import { Dialog } from "@headlessui/react";
// import Input from "../../../components/Input";
// import DropDown from "../../../components/DropDown";
// import Button from "../../../components/Button";

// export default function AddPOModal({ isOpen, onClose, onAddPO }) {
//   const [form, setForm] = useState({
//     project: "",
//     orderedBy: "",
//     vendor: "",
//     amount: "",
//     date: "",
//     status: "Pending",
//     paymentTerms: "",
//     deliveryDate: "",
//     notes: "",
//     items: [],
//   });

//   const handleChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = () => {
//     if (!form.vendor || !form.amount) return;
//     onAddPO({
//       ...form,
//       amount: parseFloat(form.amount),
//     });
//     onClose();
//     setForm({
//       project: "",
//       orderedBy: "",
//       vendor: "",
//       amount: "",
//       date: "",
//       status: "Pending",
//       paymentTerms: "",
//       deliveryDate: "",
//       notes: "",
//       items: [],
//     });
//   };

//   return (
//     <Dialog open={isOpen} onClose={onClose} className="relative z-50">
//       <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//       <div className="fixed inset-0 flex items-center justify-center p-4">
//         <Dialog.Panel className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full space-y-4">
//           <Dialog.Title className="text-xl font-semibold">
//             Add Purchase Order
//           </Dialog.Title>

//           <Input
//             name="project"
//             placeholder="Project Name"
//             value={form.project}
//             onChange={(e) => handleChange("project", e.target.value)}
//           />
//           <Input
//             name="orderedBy"
//             placeholder="Ordered By"
//             value={form.orderedBy}
//             onChange={(e) => handleChange("orderedBy", e.target.value)}
//           />
//           <Input
//             name="vendor"
//             placeholder="Vendor Name"
//             value={form.vendor}
//             onChange={(e) => handleChange("vendor", e.target.value)}
//           />
//           <Input
//             name="amount"
//             type="number"
//             placeholder="Amount"
//             value={form.amount}
//             onChange={(e) => handleChange("amount", e.target.value)}
//           />
//           <DropDown
//             label="Status"
//             name="status"
//             value={form.status}
//             onChange={(e) => handleChange("status", e.target.value)}
//             options={["Pending", "Paid"]}
//           />
//           <Input
//             name="paymentTerms"
//             placeholder="Payment Terms"
//             value={form.paymentTerms}
//             onChange={(e) => handleChange("paymentTerms", e.target.value)}
//           />
//           <Input
//             name="deliveryDate"
//             type="date"
//             placeholder="Delivery Date"
//             value={form.deliveryDate}
//             onChange={(e) => handleChange("deliveryDate", e.target.value)}
//           />
//           <Input
//             name="notes"
//             placeholder="Notes"
//             value={form.notes}
//             onChange={(e) => handleChange("notes", e.target.value)}
//           />

//           <div className="flex justify-end gap-3 mt-4">
//             <Button color="gray" variant="outlined" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button
//               color="green"
//               variant="custom"
//               className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
//               onClick={handleSubmit}
//             >
//               Add PO
//             </Button>
//           </div>
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   );
// }
