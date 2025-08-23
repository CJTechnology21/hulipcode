import React, { useState, useEffect } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import DashboardCard from "./DashboardCard";
import { fetchProjectById, updateProject } from "../../../../services/projectServices";

function ProjectDetails({ projectId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch project details
  useEffect(() => {
    if (!projectId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const projectData = await fetchProjectById(projectId);

        setDetails({
          projectName: projectData?.name || "-",
          clientName: projectData?.client || "-", // client is string
          clientContact: projectData?.clientContact || "-",
          address: projectData?.location || "-",
          category: projectData?.category || "-",
          scope: projectData?.scope || "-",
        });
      } catch (err) {
        console.error("Error loading project:", err);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleSave = async () => {
    try {
      await updateProject(projectId, details);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  if (loading) return <DashboardCard title="Project Details">Loading...</DashboardCard>;
  if (!details) return <DashboardCard title="Project Details">No project found</DashboardCard>;

  return (
    <DashboardCard
      title="Project Details"
      extraHeader={
        <div className="flex gap-2 items-center">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-green-600"
            >
              Save
            </button>
          ) : null}
          <PencilSquareIcon
            className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={() => setIsEditing(!isEditing)}
          />
        </div>
      }
    >
      {/* Project Fields - Side by Side */}
      <div className="space-y-3">
        {Object.entries({
          "Project Name": isEditing ? (
            <input
              type="text"
              name="projectName"
              value={details.projectName}
              onChange={handleChange}
              className="border rounded p-1 w-full text-sm sm:text-base"
            />
          ) : (
            details.projectName
          ),
          "Client Name": isEditing ? (
            <input
              type="text"
              name="clientName"
              value={details.clientName}
              onChange={handleChange}
              className="border rounded p-1 w-full text-sm sm:text-base"
            />
          ) : (
            details.clientName
          ),
          "Client Contact": isEditing ? (
            <input
              type="text"
              name="clientContact"
              value={details.clientContact}
              onChange={handleChange}
              className="border rounded p-1 w-full text-sm sm:text-base"
            />
          ) : (
            details.clientContact
          ),
          Address: isEditing ? (
            <textarea
              name="address"
              value={details.address}
              onChange={handleChange}
              className="border rounded p-1 w-full text-sm sm:text-base"
              rows={2}
            />
          ) : (
            details.address
          ),
          "Project Category": isEditing ? (
            <input
              type="text"
              name="category"
              value={details.category}
              onChange={handleChange}
              className="border rounded p-1 w-full text-sm sm:text-base"
            />
          ) : (
            details.category
          ),
          "Project Scope": isEditing ? (
            <input
              type="text"
              name="scope"
              value={details.scope}
              onChange={handleChange}
              className="border rounded p-1 w-full text-sm sm:text-base"
            />
          ) : (
            details.scope
          ),
        }).map(([label, field], idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-start sm:gap-4"
          >
            {/* Label */}
            <p className="text-red-600 font-semibold text-xs sm:text-sm min-w-[120px] sm:min-w-[160px]">
              {label}:
            </p>

            {/* Value / Input */}
            <div className="flex-1 font-bold text-black break-words whitespace-pre-line">
              {field}
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export default ProjectDetails;

