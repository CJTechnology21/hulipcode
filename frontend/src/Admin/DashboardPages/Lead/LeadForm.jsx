import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { fetchArchitects } from "../../../services/leadServices";
import { createLead } from "../../../services/leadServices";
import { getShortlistedProfessionals } from "../../../services/shortlistServices";
import { useAuth } from "../../../context/AuthContext";
// Schema will be created dynamically based on whether user is a client
const createSchema = (isClient) => {
  return yup.object().shape({
    propertyDetails: yup.string().required("Property details is required"),
    budget: yup.string().required("Budget is required"),
    style: yup.string().nullable(),
    requirements: yup.string().nullable(),
    address: yup.string().required("Address is required"),
    assigned: isClient ? yup.string().nullable() : yup.string().required("Assigned User is required"),
    isHuelip: yup.boolean(),
  });
};

function LeadForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [architects, setArchitects] = useState([]);
  const [loadingArchitects, setLoadingArchitects] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortlistedProfessionals, setShortlistedProfessionals] = useState([]);
  const [loadingShortlist, setLoadingShortlist] = useState(false);
  
  // Check if user is a client
  const userRole = localStorage.getItem('crm_role') || user?.role || '';
  const isClient = userRole === 'client';
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(createSchema(isClient)),
    defaultValues: {
      propertyDetails: "",
      budget: "",
      style: "",
      requirements: "",
      address: "",
      assigned: "",
      isHuelip: false,
    },
  });

  // Fetch shortlisted professionals if user is a client
  useEffect(() => {
    if (isClient) {
      const loadShortlisted = async () => {
        setLoadingShortlist(true);
        try {
          const data = await getShortlistedProfessionals();
          setShortlistedProfessionals(data || []);
          
          // If no shortlisted professionals, show message and redirect
          if (!data || data.length === 0) {
            toast.warning("Please shortlist professionals first before adding a lead.");
            setTimeout(() => {
              navigate("/professional");
            }, 2000);
          }
        } catch (err) {
          console.error("Error fetching shortlisted professionals", err);
          // If error, still allow form submission (might be admin)
        } finally {
          setLoadingShortlist(false);
        }
      };
      loadShortlisted();
    }
  }, [isClient, navigate]);

  // Fetch architects on mount (for non-client users)
  useEffect(() => {
    if (!isClient) {
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
    }
  }, [isClient]);

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      // If client and no shortlisted professionals, prevent submission
      if (isClient && (!shortlistedProfessionals || shortlistedProfessionals.length === 0)) {
        toast.error("Please shortlist at least one professional before adding a lead.");
        navigate("/professional");
        return;
      }

      const payload = { ...data };
      delete payload.id; // ensure no duplicate id gets sent
      
      // Set default status for new leads
      payload.status = "Assigned";
      
      // If client, create lead for each shortlisted professional
      if (isClient && shortlistedProfessionals.length > 0) {
        const professionalIds = shortlistedProfessionals.map((shortlist) => {
          // Handle both populated and non-populated professionalId
          if (shortlist.professionalId && typeof shortlist.professionalId === 'object') {
            return shortlist.professionalId._id || shortlist.professionalId;
          }
          return shortlist.professionalId;
        }).filter(Boolean); // Remove any undefined/null values
        
        if (professionalIds.length === 0) {
          toast.error("No valid professionals found in shortlist.");
          return;
        }
        
        // Create leads for all shortlisted professionals
        const leadPromises = professionalIds.map((professionalId) => {
          const leadPayload = {
            ...payload,
            assigned: professionalId,
            status: "Assigned", // Auto-assign status
          };
          return createLead(leadPayload);
        });
        
        await Promise.all(leadPromises);
        toast.success(`Lead saved successfully and assigned to ${professionalIds.length} professional(s)!`);
      } else {
        // For non-clients, use the existing flow
        await createLead(payload);
        toast.success("Lead saved successfully!");
      }
      
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
    <Layout title={isClient ? "Add New Requirement" : "Add New Lead"}>
      <div className="max-w-9xl p-4 m-4 bg-white rounded-xl min-h-screen relative">
        <h2 className="text-2xl font-bold mb-8">{isClient ? "Add Requirement" : "Add Leads"}</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-white p-4 rounded-lg"
        >
          {/* Property Details */}
          <div>
            <label className="block font-semibold mb-1">Property Details</label>
            <Input
              name="propertyDetails"
              placeholder="Enter property details"
              register={register}
              error={errors.propertyDetails}
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

          {/* Style */}
          <div>
            <label className="block font-semibold mb-1">Style</label>
            <Input
              name="style"
              placeholder="Enter style"
              register={register}
              error={errors.style}
            />
          </div>

          {/* Requirements */}
          <div className="xl:col-span-3">
            <label className="block font-semibold mb-1">Requirements</label>
            <textarea
              {...register("requirements")}
              className="w-full border rounded p-3"
              rows="3"
              placeholder="Enter requirements"
            />
            {errors.requirements && (
              <p className="text-red-500 text-sm">{errors.requirements.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="xl:col-span-3">
            <label className="block font-semibold mb-1">Address</label>
            <Input
              name="address"
              placeholder="Enter address"
              register={register}
              error={errors.address}
            />
          </div>

          {/* Assigned User Field */}
          <div className="relative xl:col-span-3">
            <label className="block font-semibold mb-1">Assigned To</label>
            {isClient ? (
              // For clients: Show shortlisted professionals count (read-only)
              <div>
                <input
                  type="text"
                  readOnly
                  value={
                    loadingShortlist
                      ? "Loading..."
                      : shortlistedProfessionals.length > 0
                      ? `${shortlistedProfessionals.length} Professional(s)`
                      : "No professionals shortlisted"
                  }
                  className={`w-full border rounded p-3 bg-gray-50 cursor-not-allowed ${
                    shortlistedProfessionals.length === 0 ? "border-red-300" : ""
                  }`}
                  placeholder="Shortlisted professionals will be auto-assigned"
                />
                {shortlistedProfessionals.length === 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    Please shortlist professionals first. Redirecting to Professional page...
                  </p>
                )}
                {shortlistedProfessionals.length > 0 && (
                  <p className="text-gray-500 text-sm mt-1">
                    Lead will be assigned to all {shortlistedProfessionals.length} shortlisted professional(s)
                  </p>
                )}
                <input type="hidden" {...register("assigned")} />
              </div>
            ) : (
              // For non-clients: Show architect search dropdown
              <>
                <input
                  type="text"
                  placeholder="Search professional..."
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
                            setSearchTerm(arch.name || arch._id);
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
              </>
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

