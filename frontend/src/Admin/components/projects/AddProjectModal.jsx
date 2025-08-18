import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Layout from "../Layout";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Project Name is required"),
  client: yup.string().required("Client Name is required"),
  location: yup.string().required("Location is required"),
  category: yup.string(),
  status: yup.string().required("Status is required"),
  progress: yup
    .number()
    .min(0, "Minimum 0%")
    .max(100, "Maximum 100%")
    .nullable(),
  cashFlow: yup.string(),
  protect: yup.boolean(),
});

const statusOptions = [
  "EXECUTION IN PROGRESS",
  "SITE MEASUREMENTS",
  "DESIGNING IN PROCESS",
  "HOLD",
  "COMPLETED",
];
const categoryOptions = ["Residential", "Commercial", "Retail", "Industrial"];

function AddProjectScreen() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { status: "", protect: false },
  });

  const watchStatus = watch("status");

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/projects", data);
      toast.success("Project created successfully!", { id: "createProject" });
      navigate("/projects");
    } catch (err) {
      console.error("Error creating project:", err);
      toast.error("Failed to create project", { id: "createProject" });
    }
  };

  return (
    <Layout title="Add Project">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <div className="bg-white p-6 m-4 rounded-xl min-h-screen">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Project Name</label>
            <input
              {...register("name")}
              placeholder="Project Name"
              className="border p-2 rounded"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Client Name</label>
            <input
              {...register("client")}
              placeholder="Client Name"
              className="border p-2 rounded"
            />
            {errors.client && (
              <span className="text-red-500 text-sm">
                {errors.client.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Location</label>
            <input
              {...register("location")}
              placeholder="City / Area"
              className="border p-2 rounded"
            />
            {errors.location && (
              <span className="text-red-500 text-sm">
                {errors.location.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Category</label>
            <DropDown
              name="category"
              value={watch("category")}
              options={categoryOptions}
              onChange={(e) => setValue("category", e.target.value)}
            />
            {errors.category && (
              <span className="text-red-500 text-sm">
                {errors.category.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Status</label>
            <DropDown
              name="status"
              value={watchStatus}
              options={statusOptions}
              onChange={(e) => setValue("status", e.target.value)}
            />
            {errors.status && (
              <span className="text-red-500 text-sm">
                {errors.status.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Progress %</label>
            <input
              type="number"
              {...register("progress")}
              placeholder="0-100%"
              min={0}
              max={100}
              className="border p-2 rounded"
            />
            {errors.progress && (
              <span className="text-red-500 text-sm">
                {errors.progress.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Cash Flow</label>
            <input
              {...register("cashFlow")}
              placeholder="Cash Flow (₹)"
              className="border p-2 rounded"
            />
          </div>

          {/* Huelip Protect */}
          <div className="flex items-center gap-2 mt-2 col-span-full">
            <input type="checkbox" {...register("protect")} />
            <span className="text-sm font-medium">Huelip Protect</span>
          </div>

          {/* Buttons */}
          <div className="col-span-full flex flex-wrap justify-end gap-4 mt-4">
            <Button
              variant="custom"
              type="button"
              className="px-4 py-2 bg-gray-300 rounded text-black"
              onClick={() => navigate("/projects")}
            >
              Cancel
            </Button>
            <Button
              variant="custom"
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default AddProjectScreen;

// // AddProjectModal.jsx
// import React, { useState } from "react";
// import Input from "../../../components/Input";
// import Button from "../../../components/Button";
// import DropDown from "../../../components/DropDown";

// function AddProjectModal({ onClose, onSubmit }) {
//   const [status, setStatus] = useState(""); // track dropdown value

//   const statusOptions = [
//     "EXECUTION IN PROGRESS",
//     "SITE MEASUREMENTS",
//     "DESIGNING IN PROCESS",
//     "HOLD",
//     "COMPLETED",
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const data = Object.fromEntries(formData.entries());
//     data.status = status; // use the dropdown state
//     onSubmit(data);
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md m-4">
//         <h2 className="text-lg font-semibold mb-4">Add New Project</h2>
//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <Input name="id" placeholder="Project ID" className="input" required />
//           <Input name="name" placeholder="Project Name" className="input" required />
//           <Input name="client" placeholder="Client Name" className="input" required />
//           <Input name="location" placeholder="Location" className="input" required />
//           <Input name="category" placeholder="Category" className="input" />

//           <DropDown
//             label="Status"
//             name="status"
//             value={status}
//             options={statusOptions}
//             onChange={(e) => setStatus(e.target.value)}
//           />

//           <Input
//             type="number"
//             name="progress"
//             placeholder="Progress %"
//             className="input"
//             min="0"
//             max="100"
//           />
//           <Input name="cashFlow" placeholder="Cash Flow (e.g., 25000)" className="input" />
//           <label className="flex items-center gap-2">
//             <Input type="checkbox" name="protect" />
//             <span className="text-sm">Huelip Protect</span>
//           </label>

//           <div className="flex justify-end gap-4">
//             <Button
//               variant="custom"
//               className="px-4 py-2 bg-gray-300 rounded text-black"
//               onClick={onClose}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="custom"
//               type="submit"
//               className="px-4 py-2 bg-red-600 text-white rounded"
//             >
//               Save
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddProjectModal;
