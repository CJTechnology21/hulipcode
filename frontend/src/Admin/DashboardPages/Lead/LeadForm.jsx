import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {  fetchArchitects } from "../../../services/leadServices";
import { createLead } from "../../../services/leadServices";
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  budget: yup.string().required("Budget is required"),
  contact: yup.string().required("Contact is required"),
  email: yup.string().email("Please enter a valid email address").nullable(),
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
  const [loadingArchitects, setLoadingArchitects] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

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
      email: "",
      status: "Not Assigned",
      category: "RESIDENTIAL",
      update: "",
      assigned: "",
      source: "",
      reminderDate: "",
      reminderTime: "",
    },
  });

  // Fetch architects on mount
  useEffect(() => {
    const loadArchitects = async () => {
      setLoadingArchitects(true);
      try {
        const data = await fetchArchitects();
        setArchitects(data);
      } catch (err) {
        console.error("Error fetching architects", err);
        toast.error("Failed to load architects");
      } finally {
        setLoadingArchitects(false);
      }
    };
    loadArchitects();
  }, []);

  // Handle form submit
  const onSubmit = async (data) => {
  try {
    const payload = { ...data };
    delete payload.id; // ensure no duplicate id gets sent
    await createLead(payload);
    toast.success("Lead saved successfully!");
    reset();
    setSearchTerm("");
  } catch (err) {
    console.error("Create Lead Error:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Error saving lead");
  }
};

  // const onSubmit = async (data) => {
  //   try {
  //     await createLead(data);
  //     toast.success("Lead saved successfully!");
  //     reset();
  //     setSearchTerm("");
  //   } catch (err) {
  //     console.error(err);
  //     console.error("Create Lead Error:", err.response?.data || err.message);
  //     toast.error("Error saving lead");
  //   }
  // };

  // Filter architects by search term
  const filteredArchitects = architects.filter((arch) =>
    arch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Add New Lead">
      <div className="max-w-9xl p-4 m-4 bg-white rounded-xl min-h-screen relative">
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

          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">
              Email <span className="text-gray-500 text-sm">(Required for quote approval)</span>
            </label>
            <Input
              name="email"
              type="email"
              placeholder="Enter email address"
              register={register}
              error={errors.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
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

          {/* Assigned Architect Search */}
          <div className="relative">
            <label className="block font-semibold mb-1">Assigned User</label>
            <input
              type="text"
              placeholder="Search project..."
              className={`w-full border rounded p-3 ${
                errors.assigned ? "border-red-500" : ""
              }`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            <input type="hidden" {...register("assigned")} />

            {/* Modal-like dropdown */}
            {showDropdown && (
              <div
                className="absolute left-0 mt-1 w-full bg-white border rounded shadow-lg z-20"
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {loadingArchitects ? (
                  <p className="p-3">Loading...</p>
                ) : filteredArchitects.length > 0 ? (
                  filteredArchitects.map((arch) => (
                    <div
                      key={arch._id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        // Fill ID into visible search bar
                        setSearchTerm(arch._id);
                        // Also keep in hidden assigned field
                        setValue("assigned", arch._id);
                        // Close dropdown
                        setShowDropdown(false);
                      }}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold uppercase">
                        {(arch.name || "")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">
                          {arch.name || "Unnamed"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-3 text-gray-500">No results found</p>
                )}
              </div>
            )}
          </div>

          {/* Source */}
          <div>
            <label className="block font-semibold mb-1">Source</label>
            <select
              {...register("source")}
              className="w-full border rounded p-3"
            >
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
      </div>
    </Layout>
  );
}

export default LeadForm;
