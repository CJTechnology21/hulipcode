import React from "react";
import Layout from "../../components/Layout";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  budget: yup.string().required("Budget is required"),
  contact: yup.string().required("Contact is required"),
  status: yup.string().required("Status is required"),
  category: yup.string().required("Category is required"),
  assigned: yup.string().required("Assigned User ID is required"),
  source: yup.string().nullable(),
  reminderDate: yup.string().nullable(),
  reminderTime: yup.string().nullable(),
  update: yup.string().nullable(),
  isHuelip: yup.boolean(),
});

const STATUS_OPTIONS = [
  "Not Assigned",
  "Assigned",
  "Requirement Gathered",
  "Estimate Shared",
  "Visit Planned",
  "Pending on Client Decision",
  "On Hold",
  "Not Interested",
  "Quotation Approved",
];

const CATEGORY_OPTIONS = ["RESIDENTIAL", "COMMERCIAL"];

function LeadForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      isHuelip: false,
      budget: "",
      contact: "",
      status: "Not Assigned",
      category: "RESIDENTIAL",
      update: "",
      assigned: "",
      source: "",
      reminderDate: "",
      reminderTime: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/leads", data, {
        withCredentials: true, 
        headers: { "Content-Type": "application/json" },
      });

      console.log("Lead saved:", res.data);
      toast.success("Lead saved successfully!");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Error saving lead");
    }
  };
  return (
    <Layout title="Add New Lead">
      <div className="max-w-9xl p-4 m-4 bg-white rounded-xl min-h-screen">
        <h2 className="text-2xl font-bold mb-8">Add Leads</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-white p-4 rounded-lg"
        >
          {/* Name */}
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <Input
              name="name"
              placeholder="Enter name"
              register={register}
              error={errors.name}
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block font-semibold mb-1">Budget</label>
            <Input
              name="budget"
              placeholder="Enter budget"
              register={register}
              error={errors.budget}
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block font-semibold mb-1">Contact</label>
            <Input
              name="contact"
              placeholder="Enter contact number"
              register={register}
              error={errors.contact}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select
              {...register("status")}
              className="w-full border rounded p-3"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              {...register("category")}
              className="w-full border rounded p-3"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Assigned */}
          <div>
            <label className="block font-semibold mb-1">Assigned User ID</label>
            <Input
              name="assigned"
              placeholder="Enter assigned user ID"
              register={register}
              error={errors.assigned}
            />
          </div>

          {/* Source */}
          <div>
            <label className="block font-semibold mb-1">Source</label>
            <Input
              name="source"
              placeholder="Enter source"
              register={register}
              error={errors.source}
            />
          </div>

          {/* Reminder Date */}
          <div>
            <label className="block font-semibold mb-1">Reminder Date</label>
            <Input
              name="reminderDate"
              type="date"
              register={register}
              error={errors.reminderDate}
            />
          </div>

          {/* Reminder Time */}
          <div>
            <label className="block font-semibold mb-1">Reminder Time</label>
            <Input
              name="reminderTime"
              type="time"
              register={register}
              error={errors.reminderTime}
            />
          </div>

          {/* Update */}
          <div className="xl:col-span-3">
            <label className="block font-semibold mb-1">Update</label>
            <textarea
              {...register("update")}
              className="w-full border rounded p-3"
              rows="3"
            />
            {errors.update && (
              <p className="text-red-500 text-sm">{errors.update.message}</p>
            )}
          </div>

          {/* Is Huelip */}
          <div className="xl:col-span-3 flex items-center space-x-2">
            <input type="checkbox" {...register("isHuelip")} />
            <label>Is Huelip</label>
          </div>

          {/* Submit */}
          <div className="xl:col-span-3 flex justify-end mt-2">
            <Button
              variant="custom"
              type="submit"
              disabled={isSubmitting}
              className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
            >
              {isSubmitting ? "Saving..." : "Save Lead"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default LeadForm;

// import React, { useState } from "react";
// import Layout from "../../components/Layout";
// import Button from "../../../components/Button";
// import Input from "../../../components/Input";

// function LeadForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     isHuelip: false,
//     budget: "",
//     contact: "",
//     status: "Not Assigned",
//     category: "RESIDENTIAL",
//     update: "",
//     assigned: "",
//     source: "",
//     reminderDate: "",
//     reminderTime: "",
//   });

//   const STATUS_OPTIONS = [
//     "Not Assigned",
//     "Assigned",
//     "Requirement Gathered",
//     "Estimate Shared",
//     "Visit Planned",
//     "Pending on Client Decision",
//     "On Hold",
//     "Not Interested",
//     "Quotation Approved",
//   ];

//   const CATEGORY_OPTIONS = ["RESIDENTIAL", "COMMERCIAL"];

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Lead Data:", formData);
//     // TODO: Send to API
//   };

//   return (
//     <Layout title="Add New Lead">
//       <div className="max-w-9xl p-4 m-4 bg-white rounded-xl min-h-screen">
//         <h2 className="text-2xl font-bold mb-8">Add Leads</h2>

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-white p-4 rounded-lg"
//         >
//           {/* Name */}
//           <div>
//             <label className="block font-semibold mb-1">Name</label>
//             <Input
//               type="text"
//               name="name"
//               className="w-full border rounded p-3"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Budget */}
//           <div>
//             <label className="block font-semibold mb-1">Budget</label>
//             <Input
//               type="text"
//               name="budget"
//               className="w-full border rounded p-3"
//               value={formData.budget}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Contact */}
//           <div>
//             <label className="block font-semibold mb-1">Contact</label>
//             <Input
//               type="text"
//               name="contact"
//               className="w-full border rounded p-3"
//               value={formData.contact}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Status */}
//           <div>
//             <label className="block font-semibold mb-1">Status</label>
//             <select
//               name="status"
//               className="w-full border rounded p-3"
//               value={formData.status}
//               onChange={handleChange}
//               required
//             >
//               {STATUS_OPTIONS.map((status) => (
//                 <option key={status} value={status}>
//                   {status}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block font-semibold mb-1">Category</label>
//             <select
//               name="category"
//               className="w-full border rounded p-3"
//               value={formData.category}
//               onChange={handleChange}
//             >
//               {CATEGORY_OPTIONS.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Assigned */}
//           <div>
//             <label className="block font-semibold mb-1">Assigned (User ID)</label>
//             <Input
//               type="text"
//               name="assigned"
//               className="w-full border rounded p-3"
//               value={formData.assigned}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Source */}
//           <div>
//             <label className="block font-semibold mb-1">Source</label>
//             <Input
//               type="text"
//               name="source"
//               className="w-full border rounded p-3"
//               value={formData.source}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Reminder Date */}
//           <div>
//             <label className="block font-semibold mb-1">Reminder Date</label>
//             <Input
//               type="date"
//               name="reminderDate"
//               className="w-full border rounded p-3"
//               value={formData.reminderDate}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Reminder Time */}
//           <div>
//             <label className="block font-semibold mb-1">Reminder Time</label>
//             <Input
//               type="time"
//               name="reminderTime"
//               className="w-full border rounded p-3"
//               value={formData.reminderTime}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Update */}
//           <div className="xl:col-span-3">
//             <label className="block font-semibold mb-1">Update</label>
//             <textarea
//               name="update"
//               className="w-full border rounded p-3"
//               rows="3"
//               value={formData.update}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Is Huelip */}
//           <div className="xl:col-span-3 flex items-center space-x-2">
//             <Input
//               type="checkbox"
//               name="isHuelip"
//               checked={formData.isHuelip}
//               onChange={handleChange}
//             />
//             <label>Is Huelip</label>
//           </div>

//           {/* Submit Button */}
//           <div className="xl:col-span-3 flex justify-end mt-2">
//             <Button
//               variant="custom"
//               type="submit"
//               className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
//             >
//               Save Lead
//             </Button>
//           </div>
//         </form>
//       </div>
//     </Layout>
//   );
// }

// export default LeadForm;

// import React, { useState } from "react";
// import Layout from "../../components/Layout";

// function LeadForm() {
//   const [formData, setFormData] = useState({
//     clientName: "",
//     clientPhone: "",
//     clientEmail: "",
//     projectName: "",
//     address: "",
//     floor: "",
//     ceilingHeight: "",
//     city: "",
//     area: "",
//     type: "",
//     budget: "",
//     category: "",
//     carpetArea: "",
//     totalSpaces: "",
//     secondClientName: "",
//     secondClientPhone: "",
//     secondClientEmail: "",
//     status: "",
//     source: "",
//     assignedTo: "",
//     logs: [
//       {
//         date: "25-04-2025 4:45pm",
//         update: "Client ghoomne gya",
//         updatedBy: "Pradeep",
//       },
//       {
//         date: "21-04-2025 5:45pm",
//         update: "Kal batayega",
//         updatedBy: "Ravi",
//       },
//       {
//         date: "30-03-2025 2:05pm",
//         update: "Client not responding",
//         updatedBy: "Pradeep",
//       },
//     ],
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(formData);
//   };

//   return (
//     <div >
//       <Layout title="Lead Detail">
//         <div className="p-6">
//           <form
//             onSubmit={handleSubmit}
//             className="bg-white rounded-xl shadow p-6 space-y-6"
//           >
//             {/* Client Detail */}
//             <h2 className="text-lg font-bold">Client Detail</h2>
//             <div className="grid grid-cols-3 gap-4">
//               <input
//                 name="clientName"
//                 value={formData.clientName}
//                 onChange={handleChange}
//                 placeholder="Name"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="clientPhone"
//                 value={formData.clientPhone}
//                 onChange={handleChange}
//                 placeholder="Phone Number"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="clientEmail"
//                 value={formData.clientEmail}
//                 onChange={handleChange}
//                 placeholder="Email ID"
//                 className="border rounded px-3 py-2"
//               />
//             </div>

//             {/* Project Detail */}
//             <h2 className="text-lg font-bold">Project Detail</h2>
//             <div className="grid grid-cols-3 gap-4">
//               <input
//                 name="projectName"
//                 value={formData.projectName}
//                 onChange={handleChange}
//                 placeholder="Project Name"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 placeholder="Address"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="floor"
//                 value={formData.floor}
//                 onChange={handleChange}
//                 placeholder="Floor"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="ceilingHeight"
//                 value={formData.ceilingHeight}
//                 onChange={handleChange}
//                 placeholder="Ceiling Height"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 placeholder="City"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="area"
//                 value={formData.area}
//                 onChange={handleChange}
//                 placeholder="Area"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="type"
//                 value={formData.type}
//                 onChange={handleChange}
//                 placeholder="Type"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="budget"
//                 value={formData.budget}
//                 onChange={handleChange}
//                 placeholder="Budget"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 placeholder="Category"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="carpetArea"
//                 value={formData.carpetArea}
//                 onChange={handleChange}
//                 placeholder="Carpet Area"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="totalSpaces"
//                 value={formData.totalSpaces}
//                 onChange={handleChange}
//                 placeholder="Total No of Spaces"
//                 className="border rounded px-3 py-2"
//               />
//             </div>

//             {/* Client Detail Again */}
//             <h2 className="text-lg font-bold">Client Detail</h2>
//             <div className="grid grid-cols-3 gap-4">
//               <input
//                 name="secondClientName"
//                 value={formData.secondClientName}
//                 onChange={handleChange}
//                 placeholder="Name"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="secondClientPhone"
//                 value={formData.secondClientPhone}
//                 onChange={handleChange}
//                 placeholder="Phone Number"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="secondClientEmail"
//                 value={formData.secondClientEmail}
//                 onChange={handleChange}
//                 placeholder="Email ID"
//                 className="border rounded px-3 py-2"
//               />
//             </div>

//             {/* Additional Detail */}
//             <h2 className="text-lg font-bold">Additional Detail</h2>
//             <div className="grid grid-cols-3 gap-4">
//               <input
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 placeholder="Status"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="source"
//                 value={formData.source}
//                 onChange={handleChange}
//                 placeholder="Source"
//                 className="border rounded px-3 py-2"
//               />
//               <input
//                 name="assignedTo"
//                 value={formData.assignedTo}
//                 onChange={handleChange}
//                 placeholder="Assigned To"
//                 className="border rounded px-3 py-2"
//               />
//             </div>

//             {/* Logs */}
//             <h2 className="text-lg font-bold">Logs</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full border">
//                 <thead className="bg-gray-200 text-sm">
//                   <tr>
//                     <th className="border px-4 py-2">Date & Time</th>
//                     <th className="border px-4 py-2">Update</th>
//                     <th className="border px-4 py-2">Updated by</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {formData.logs.map((log, index) => (
//                     <tr key={index} className="text-sm">
//                       <td className="border px-4 py-2">{log.date}</td>
//                       <td className="border px-4 py-2">{log.update}</td>
//                       <td className="border px-4 py-2">{log.updatedBy}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Submit */}
//             <div>
//               <button
//                 type="submit"
//                 className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
//               >
//                 Update
//               </button>
//             </div>
//           </form>
//         </div>
//       </Layout>
//     </div>
//   );
// }

// export default LeadForm;
