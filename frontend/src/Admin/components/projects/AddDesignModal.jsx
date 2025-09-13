import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import DropDown from "../../../components/DropDown";
import { fetchArchitects } from "../../../services/leadServices";
import { createLayout, patchLayout } from "../../../services/twoDServices";

// ✅ Yup schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  area: yup.string().required("Area is required"),
  fileTypes: yup.array().min(1, "Select at least one file type"),
  assigned: yup.string().required("Assigned person is required"),
  status: yup.string().required("Status is required"),
});

function AddDesignModal({ isOpen, onClose, projectId, onSave }) {
  const [versions, setVersions] = useState([]);
  const [architects, setArchitects] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      area: "",
      fileTypes: [],
      assigned: "",
      status: "Draft",
    },
  });

  const fileTypes = ["Flooring", "Electrical", "Plumbing"];

  const handleAddVersion = () => {
    const label = `V${versions.length + 1}`;
    setVersions((prev) => [...prev, { label, file: null, url: "" }]);
  };

  const onSubmit = async (data) => {
    if (!projectId) {
      toast.error("Project ID is missing!");
      return;
    }

    if (!versions.length || !versions[0].file) {
      toast.error("Add at least one version with a file for V1");
      return;
    }

    try {
      toast.info("Creating layout...", { autoClose: 2000 });

      const assignedObj = {
        name: data.assigned || "Unassigned",
        color: "bg-yellow-400",
      };

      const formData = new FormData();
      formData.append("file", versions[0].file);
      formData.append("projectId", projectId);
      formData.append("name", data.name);
      formData.append("area", data.area);
      formData.append("assigned", JSON.stringify(assignedObj));
      formData.append("status", data.status);
      formData.append("fileTypes", data.fileTypes.join(","));

      // ✅ Use service function
      const createRes = await createLayout(formData);
      const layoutId = createRes._id;

      // Upload additional versions
      for (let i = 1; i < versions.length; i++) {
        if (!versions[i].file) continue;

        const vForm = new FormData();
        vForm.append("file", versions[i].file);
        vForm.append("versionLabel", versions[i].label);

        await patchLayout(layoutId, vForm);
      }

      toast.success("Layout and all versions uploaded successfully!");
      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.error("Create Layout Error:", error);
      toast.error(error?.response?.data?.error || "Failed to create layout");
    }
  };

  // ✅ Fetch architects from leadServices
  useEffect(() => {
    const loadArchitects = async () => {
      try {
        const res = await fetchArchitects(); // should return array of users
        const names = res.map((a) => a.name);
        setArchitects(names);
      } catch (err) {
        console.error("Failed to fetch architects", err);
      }
    };
    loadArchitects();
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-lg w-[500px] max-h-[90vh] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <Dialog.Title className="text-lg font-semibold">
              Add New Design
            </Dialog.Title>
            <span className="text-sm text-gray-500">
              Project ID: {projectId}
            </span>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <Input
                  type="text"
                  {...register("name")}
                  className="w-full border rounded-lg p-2"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>

              <Controller
                name="area"
                control={control}
                render={({ field }) => (
                  <DropDown
                    label="Area"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    options={["Bedroom", "Toilet", "Living Room"]}
                  />
                )}
              />
              {errors.area && (
                <p className="text-red-500 text-xs">{errors.area.message}</p>
              )}

              <div>
                <label className="block text-sm font-medium">File Types</label>
                <div className="flex gap-4 mt-1">
                  {fileTypes.map((type) => (
                    <label key={type} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        value={type}
                        {...register("fileTypes")}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.fileTypes && (
                  <p className="text-red-500 text-xs">{errors.fileTypes.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Versions</label>
                {versions.map((v, i) => (
                  <div key={i} className="mb-2">
                    <span className="text-sm font-semibold">{v.label}</span>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          const updated = [...versions];
                          updated[i].file = file;
                          updated[i].url = url;
                          setVersions(updated);
                        }
                      }}
                      className="block w-full text-sm border rounded-lg p-2"
                    />
                    {v.url &&
                      (v.file?.type === "application/pdf" ? (
                        <embed
                          src={v.url}
                          type="application/pdf"
                          width="100%"
                          height="150px"
                          className="mt-2 border rounded"
                        />
                      ) : (
                        <img
                          src={v.url}
                          alt={v.label}
                          className="mt-2 h-32 rounded border"
                        />
                      ))}
                  </div>
                ))}
                <Button
                  variant="custom"
                  type="button"
                  onClick={handleAddVersion}
                  className="bg-red-500 hover:bg-red-600 text-white cursor-pointer text-sm"
                >
                  + Add Version
                </Button>
              </div>

              <Controller
                name="assigned"
                control={control}
                render={({ field }) => (
                  <DropDown
                    label="Assigned To"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    options={architects.length ? architects : ["No architects found"]}
                  />
                )}
              />
              {errors.assigned && (
                <p className="text-red-500 text-xs">{errors.assigned.message}</p>
              )}

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <DropDown
                    label="Status"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    options={["Draft", "Review", "Approved", "Rejected"]}
                  />
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-xs">{errors.status.message}</p>
              )}
            </form>
          </div>

          <div className="p-4 border-t flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="custom"
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Save
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default AddDesignModal;

// import React, { useState } from "react";
// import { Dialog } from "@headlessui/react";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import axios from "axios";
// import { toast } from "react-toastify";

// import Button from "../../../components/Button";
// import Input from "../../../components/Input";
// import DropDown from "../../../components/DropDown";

// // ✅ Yup schema
// const schema = yup.object().shape({
//   name: yup.string().required("Name is required"),
//   area: yup.string().required("Area is required"),
//   fileTypes: yup.array().min(1, "Select at least one file type"),
//   assigned: yup.string().required("Assigned person is required"),
//   status: yup.string().required("Status is required"),
// });

// function AddDesignModal({ isOpen, onClose, projectId, onSave }) {
//   const [versions, setVersions] = useState([]);

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       name: "",
//       area: "",
//       fileTypes: [],
//       assigned: "Ravi",
//       status: "Draft",
//     },
//   });

//   const fileTypes = ["Flooring", "Electrical", "Plumbing"];

//   const handleAddVersion = () => {
//     const label = `V${versions.length + 1}`;
//     setVersions((prev) => [...prev, { label, file: null, url: "" }]);
//   };

//   const onSubmit = async (data) => {
//     if (!projectId) {
//       toast.error("Project ID is missing!");
//       return;
//     }

//     if (!versions.length || !versions[0].file) {
//       toast.error("Add at least one version with a file for V1");
//       return;
//     }

//     try {
//       toast.info("Creating layout...", { autoClose: 2000 });

//       const assignedObj = {
//         name: data.assigned || "Unassigned",
//         color: "bg-yellow-400",
//       };

//       // Create FormData for first version
//       const formData = new FormData();
//       formData.append("file", versions[0].file);
//       formData.append("projectId", projectId);
//       formData.append("name", data.name);
//       formData.append("area", data.area);
//       formData.append("assigned", JSON.stringify(assignedObj));
//       formData.append("status", data.status);
//       formData.append("fileTypes", data.fileTypes.join(","));

//       const createRes = await axios.post(
//         "http://localhost:5000/api/2dlayout",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       const layoutId = createRes.data._id;

//       // Upload additional versions
//       for (let i = 1; i < versions.length; i++) {
//         if (!versions[i].file) continue;

//         const vForm = new FormData();
//         vForm.append("file", versions[i].file);
//         vForm.append("versionLabel", versions[i].label);

//         await axios.patch(
//           `http://localhost:5000/api/2dlayout/${layoutId}`,
//           vForm,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//       }

//       toast.success("Layout and all versions uploaded successfully!");
//       if (onSave) onSave();
//       onClose();
//     } catch (error) {
//       console.error("Create Layout Error:", error);
//       toast.error(error?.response?.data?.error || "Failed to create layout");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onClose={onClose} className="relative z-50">
//       <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

//       <div className="fixed inset-0 flex items-center justify-center p-4">
//         <Dialog.Panel className="bg-white rounded-2xl shadow-lg w-[500px] max-h-[90vh] flex flex-col">
//           <div className="p-4 border-b flex justify-between items-center">
//             <Dialog.Title className="text-lg font-semibold">
//               Add New Design
//             </Dialog.Title>
//             <span className="text-sm text-gray-500">
//               Project ID: {projectId}
//             </span>
//           </div>

//           <div className="p-4 overflow-y-auto flex-1">
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium">Name</label>
//                 <Input
//                   type="text"
//                   {...register("name")}
//                   className="w-full border rounded-lg p-2"
//                 />
//                 {errors.name && (
//                   <p className="text-red-500 text-xs">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>

//               <Controller
//                 name="area"
//                 control={control}
//                 render={({ field }) => (
//                   <DropDown
//                     label="Area"
//                     name={field.name}
//                     value={field.value}
//                     onChange={field.onChange}
//                     options={["Bedroom", "Toilet", "Living Room"]}
//                   />
//                 )}
//               />
//               {errors.area && (
//                 <p className="text-red-500 text-xs">{errors.area.message}</p>
//               )}

//               <div>
//                 <label className="block text-sm font-medium">File Types</label>
//                 <div className="flex gap-4 mt-1">
//                   {fileTypes.map((type) => (
//                     <label key={type} className="flex items-center gap-1">
//                       <input
//                         type="checkbox"
//                         value={type}
//                         {...register("fileTypes")}
//                         className="cursor-pointer"
//                       />
//                       <span className="text-sm">{type}</span>
//                     </label>
//                   ))}
//                 </div>
//                 {errors.fileTypes && (
//                   <p className="text-red-500 text-xs">
//                     {errors.fileTypes.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium">Versions</label>
//                 {versions.map((v, i) => (
//                   <div key={i} className="mb-2">
//                     <span className="text-sm font-semibold">{v.label}</span>
//                     <Input
//                       type="file"
//                       accept="image/*,.pdf"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (file) {
//                           const url = URL.createObjectURL(file);
//                           const updated = [...versions];
//                           updated[i].file = file;
//                           updated[i].url = url;
//                           setVersions(updated);
//                         }
//                       }}
//                       className="block w-full text-sm border rounded-lg p-2"
//                     />
//                     {v.url &&
//                       (v.file?.type === "application/pdf" ? (
//                         <embed
//                           src={v.url}
//                           type="application/pdf"
//                           width="100%"
//                           height="150px"
//                           className="mt-2 border rounded"
//                         />
//                       ) : (
//                         <img
//                           src={v.url}
//                           alt={v.label}
//                           className="mt-2 h-32 rounded border"
//                         />
//                       ))}
//                   </div>
//                 ))}
//                 <Button
//                   variant="custom"
//                   type="button"
//                   onClick={handleAddVersion}
//                   className="bg-red-500 hover:bg-red-600 text-white cursor-pointer text-sm"
//                 >
//                   + Add Version
//                 </Button>
//               </div>

//               <Controller
//                 name="assigned"
//                 control={control}
//                 render={({ field }) => (
//                   <DropDown
//                     label="Assigned To"
//                     name={field.name}
//                     value={field.value}
//                     onChange={field.onChange}
//                     options={["Ravi", "Tanvi"]}
//                   />
//                 )}
//               />
//               {errors.assigned && (
//                 <p className="text-red-500 text-xs">
//                   {errors.assigned.message}
//                 </p>
//               )}

//               <Controller
//                 name="status"
//                 control={control}
//                 render={({ field }) => (
//                   <DropDown
//                     label="Status"
//                     name={field.name}
//                     value={field.value}
//                     onChange={field.onChange}
//                     options={["Draft", "Review", "Approved", "Rejected"]}
//                   />
//                 )}
//               />
//               {errors.status && (
//                 <p className="text-red-500 text-xs">
//                   {errors.status.message}
//                 </p>
//               )}
//             </form>
//           </div>

//           <div className="p-4 border-t flex justify-end space-x-3">
//             <Button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-300 rounded-lg"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="custom"
//               type="submit"
//               onClick={handleSubmit(onSubmit)}
//               className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
//             >
//               Save
//             </Button>
//           </div>
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   );
// }

// export default AddDesignModal;