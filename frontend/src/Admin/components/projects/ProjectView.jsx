import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Header";
import SideBar from "../SideBar";
import { useState } from "react";

function ProjectView() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const project = state?.project;

  const [teamMembers, setTeamMembers] = useState([
    { name: "Alice", task: "UI Design" },
    { name: "Bob", task: "Backend API" },
  ]);

  const [newMember, setNewMember] = useState({ name: "", task: "" });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.task) return;
    setTeamMembers((prev) => [...prev, newMember]);
    setNewMember({ name: "", task: "" });
  };

  if (!project)
    return (
      <p className="p-6 text-red-500 font-semibold">
        No project data available
      </p>
    );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <SideBar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title={`Project ${project.projectId}`}
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-6 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Project Details
          </h2>

          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {/* Image */}
            <div className="flex justify-center">
              <img
                src={project.image}
                alt="Project"
                className="w-full max-w-md h-56 object-cover rounded-xl border"
              />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
              <Detail label="Project ID" value={project.projectId} />
              <Detail label="Name" value={project.projectName} />
              <Detail label="Type" value={project.projectType} />
              <Detail label="Budget" value={`₹ ${project.budget}`} />
              <Detail label="Location" value={project.location} />
              <Detail label="Year Built" value={project.buildingYear} />
              <Detail
                label="Project Duration"
                value={project.projectDuration}
              />
              <Detail
                label="Project Size"
                value={`${project.projectsize} sqft`}
              />
              <Detail label="Credits" value={project.credit} />
            </div>

            {/* Description */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">
                Description:
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {project.projectDescription}
              </p>
            </div>

            {/* Add Task Button */}
            <div className="mt-4">
              <button onClick={()=>navigate('/taskform  ')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Add Task 
              </button>
               <button onClick={()=>navigate('/task  ')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-10">
                Manage Task 
              </button>
                <button onClick={()=>navigate('/project/vendor  ')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-10">
                Contact Vendor 
              </button>
            </div>

            {/* Team Members Section */}
            {/* Team Members Section */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-3">Team Members</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Team Members Table */}
                <div className="md:col-span-2">
                  <table className="w-full border rounded">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Task</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((member, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{member.name}</td>
                          <td className="p-2">{member.task}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Team Member Form */}
                <form
                  onSubmit={handleAddMember}
                  className="flex flex-col gap-4 bg-white p-4 border rounded shadow"
                >
                  <input
                    type="text"
                    placeholder="Member Name"
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="border px-3 py-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Task"
                    value={newMember.task}
                    onChange={(e) =>
                      setNewMember((prev) => ({
                        ...prev,
                        task: e.target.value,
                      }))
                    }
                    className="border px-3 py-2 rounded"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Add Member
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Detail Component
function Detail({ label, value }) {
  return (
    <div>
      <span className="font-medium text-gray-800">{label}:</span> {value}
    </div>
  );
}

export default ProjectView;
