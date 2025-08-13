import React, { useState } from "react";
import Layout from "../../components/Layout";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

// Import services
import { createLead, fetchArchitects } from "../../../services/leadServices";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  budget: yup.string().required("Budget is required"),
  contact: yup.string().required("Contact is required"),
  status: yup.string().required("Status is required"),
  category: yup.string().required("Category is required"),
  assigned: yup.string().required("Assigned User is required"),
  source: yup.string().required("Source is required"),
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
const SOURCE_OPTIONS = ["Google", "Facebook", "Instagram", "Huelip"];

function LeadForm() {
  const [architects, setArchitects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingArchitects, setLoadingArchitects] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
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

  // Fetch architects from backend using service
  const handleFetchArchitects = async () => {
    setLoadingArchitects(true);
    try {
      const data = await fetchArchitects();
      setArchitects(data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching architects", err);
      toast.error("Failed to load architects");
    } finally {
      setLoadingArchitects(false);
    }
  };

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      await createLead(data);
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
            <select {...register("status")} className="w-full border rounded p-3">
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
            <select {...register("category")} className="w-full border rounded p-3">
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
            <label className="block font-semibold mb-1">Assigned User</label>
            <div className="flex gap-2">
              <Input
                name="assigned"
                placeholder="Select architect..."
                register={register}
                error={errors.assigned}
                readOnly
              />
              <Button
                type="button"
                onClick={handleFetchArchitects}
                className="bg-red-500 hover:bg-red-600 text-white px-4 rounded"
              >
                Choose
              </Button>
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="block font-semibold mb-1">Source</label>
            <select {...register("source")} className="w-full border rounded p-3">
              <option value="">Select source</option>
              {SOURCE_OPTIONS.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
            {errors.source && (
              <p className="text-red-500 text-sm">{errors.source.message}</p>
            )}
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

        {/* Architect Selection Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-bold mb-4">Select Architect</h3>
              {loadingArchitects ? (
                <p>Loading...</p>
              ) : (
                <ul className="space-y-2">
                  {architects.map((arch) => (
                    <li
                      key={arch._id}
                      className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setValue("assigned", arch._id);
                        setShowModal(false);
                      }}
                    >
                      {arch.name} ({arch.email})
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 rounded"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default LeadForm;


// import React from "react";
// import Layout from "../../components/Layout";
// import Button from "../../../components/Button";
// import Input from "../../../components/Input";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { toast } from "react-toastify";
// import axios from "axios";
// const schema = yup.object().shape({
//   name: yup.string().required("Name is required"),
//   budget: yup.string().required("Budget is required"),
//   contact: yup.string().required("Contact is required"),
//   status: yup.string().required("Status is required"),
//   category: yup.string().required("Category is required"),
//   assigned: yup.string().required("Assigned User ID is required"),
//   source: yup.string().nullable(),
//   reminderDate: yup.string().nullable(),
//   reminderTime: yup.string().nullable(),
//   update: yup.string().nullable(),
//   isHuelip: yup.boolean(),
// });

// const STATUS_OPTIONS = [
//   "Not Assigned",
//   "Assigned",
//   "Requirement Gathered",
//   "Estimate Shared",
//   "Visit Planned",
//   "Pending on Client Decision",
//   "On Hold",
//   "Not Interested",
//   "Quotation Approved",
// ];

// const CATEGORY_OPTIONS = ["RESIDENTIAL", "COMMERCIAL"];

// function LeadForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       name: "",
//       isHuelip: false,
//       budget: "",
//       contact: "",
//       status: "Not Assigned",
//       category: "RESIDENTIAL",
//       update: "",
//       assigned: "",
//       source: "",
//       reminderDate: "",
//       reminderTime: "",
//     },
//   });
//   const onSubmit = async (data) => {
//     try {
//       const res = await axios.post("http://localhost:5000/api/leads", data, {
//         withCredentials: true,
//         headers: { "Content-Type": "application/json" },
//       });

//       console.log("Lead saved:", res.data);
//       toast.success("Lead saved successfully!");
//       reset();
//     } catch (err) {
//       console.error(err);
//       toast.error("Error saving lead");
//     }
//   };
//   return (
//     <Layout title="Add New Lead">
//       <div className="max-w-9xl p-4 m-4 bg-white rounded-xl min-h-screen">
//         <h2 className="text-2xl font-bold mb-8">Add Leads</h2>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-white p-4 rounded-lg"
//         >
//           {/* Name */}
//           <div>
//             <label className="block font-semibold mb-1">Name</label>
//             <Input
//               name="name"
//               placeholder="Enter name"
//               register={register}
//               error={errors.name}
//             />
//           </div>

//           {/* Budget */}
//           <div>
//             <label className="block font-semibold mb-1">Budget</label>
//             <Input
//               name="budget"
//               placeholder="Enter budget"
//               register={register}
//               error={errors.budget}
//             />
//           </div>

//           {/* Contact */}
//           <div>
//             <label className="block font-semibold mb-1">Contact</label>
//             <Input
//               name="contact"
//               placeholder="Enter contact number"
//               register={register}
//               error={errors.contact}
//             />
//           </div>

//           {/* Status */}
//           <div>
//             <label className="block font-semibold mb-1">Status</label>
//             <select
//               {...register("status")}
//               className="w-full border rounded p-3"
//             >
//               {STATUS_OPTIONS.map((status) => (
//                 <option key={status} value={status}>
//                   {status}
//                 </option>
//               ))}
//             </select>
//             {errors.status && (
//               <p className="text-red-500 text-sm">{errors.status.message}</p>
//             )}
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block font-semibold mb-1">Category</label>
//             <select
//               {...register("category")}
//               className="w-full border rounded p-3"
//             >
//               {CATEGORY_OPTIONS.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//             {errors.category && (
//               <p className="text-red-500 text-sm">{errors.category.message}</p>
//             )}
//           </div>

//           {/* Assigned */}
//           <div>
//             <label className="block font-semibold mb-1">Assigned User ID</label>
//             <Input
//               name="assigned"
//               placeholder="Enter assigned user ID"
//               register={register}
//               error={errors.assigned}
//             />
//           </div>

//           {/* Source */}
//           <div>
//             <label className="block font-semibold mb-1">Source</label>
//             <Input
//               name="source"
//               placeholder="Enter source"
//               register={register}
//               error={errors.source}
//             />
//           </div>

//           {/* Reminder Date */}
//           <div>
//             <label className="block font-semibold mb-1">Reminder Date</label>
//             <Input
//               name="reminderDate"
//               type="date"
//               register={register}
//               error={errors.reminderDate}
//             />
//           </div>

//           {/* Reminder Time */}
//           <div>
//             <label className="block font-semibold mb-1">Reminder Time</label>
//             <Input
//               name="reminderTime"
//               type="time"
//               register={register}
//               error={errors.reminderTime}
//             />
//           </div>

//           {/* Update */}
//           <div className="xl:col-span-3">
//             <label className="block font-semibold mb-1">Update</label>
//             <textarea
//               {...register("update")}
//               className="w-full border rounded p-3"
//               rows="3"
//             />
//             {errors.update && (
//               <p className="text-red-500 text-sm">{errors.update.message}</p>
//             )}
//           </div>

//           {/* Is Huelip */}
//           <div className="xl:col-span-3 flex items-center space-x-2">
//             <input type="checkbox" {...register("isHuelip")} />
//             <label>Is Huelip</label>
//           </div>

//           {/* Submit */}
//           <div className="xl:col-span-3 flex justify-end mt-2">
//             <Button
//               variant="custom"
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
//             >
//               {isSubmitting ? "Saving..." : "Save Lead"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </Layout>
//   );
// }

// export default LeadForm;
