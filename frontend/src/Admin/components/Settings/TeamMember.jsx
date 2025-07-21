import React, { useState } from "react";
import DropDown from "../../../components/DropDown";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SearchBar from "../../../components/SearchBar";
import TeamMemberModal from "./TeamMemberModal"; // ✅ your existing modal

const initialTeam = [
  { id: 1, name: "Ar. Neha Sharma", role: "Architect", location: "Delhi", experience: "8 Years", charges: "₹1,500/hr" },
  { id: 2, name: "Designer Raj", role: "Interior Designer", location: "Mumbai", experience: "5 Years", charges: "₹1,000/hr" },
  { id: 3, name: "Consultant Aman", role: "Consultant", location: "Bangalore", experience: "6 Years", charges: "₹1,200/hr" },
];

const roles = ["Architect", "Interior Designer", "Consultant"];
const locations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad"];

const TeamMembers = () => {
  const [team, setTeam] = useState(initialTeam);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    location: "",
    experience: "",
    charges: "",
  });

  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTeam = team.filter((member) => {
    const matchSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = selectedRole ? member.role === selectedRole : true;
    const matchLocation = selectedLocation ? member.location === selectedLocation : true;
    return matchSearch && matchRole && matchLocation;
  });

  const handleAddMember = () => {
    const id = team.length + 1;
    setTeam([...team, { id, ...newMember }]);
    setNewMember({ name: "", role: "", location: "", experience: "", charges: "" });
  };

  const openModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Team Members</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name"
          />
        </div>
        <DropDown
          label="Role"
          name="role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          options={roles}
        />
        <DropDown
          label="Location"
          name="location"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          options={locations}
        />
        <div className="flex items-end">
          <Button
            onClick={() => {
              setSearchTerm("");
              setSelectedRole("");
              setSelectedLocation("");
            }}
            color="gray"
            fullWidth
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Member Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeam.map((member) => (
          <div
            key={member.id}
            className="border border-gray-200 p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md"
            onClick={() => openModal(member)} // ✅ trigger modal
          >
            <h3 className="font-semibold text-lg">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role} - {member.location}</p>
            <p className="text-sm">Experience: {member.experience}</p>
            <p className="text-sm">Charges: {member.charges}</p>
          </div>
        ))}
      </div>

      {/* Add New Member */}
      <div className="mt-6 border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold">Add New Member</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input
              name="name"
              placeholder="Enter name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            />
          </div>
          <DropDown
            label="Role"
            name="newRole"
            value={newMember.role}
            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            options={roles}
          />
          <DropDown
            label="Location"
            name="newLocation"
            value={newMember.location}
            onChange={(e) => setNewMember({ ...newMember, location: e.target.value })}
            options={locations}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <Input
              name="experience"
              placeholder="e.g. 5 Years"
              value={newMember.experience}
              onChange={(e) => setNewMember({ ...newMember, experience: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Charges</label>
            <Input
              name="charges"
              placeholder="e.g. ₹1000/hr"
              value={newMember.charges}
              onChange={(e) => setNewMember({ ...newMember, charges: e.target.value })}
            />
          </div>
        </div>
        <Button onClick={handleAddMember} color="green">
          Add Member
        </Button>
      </div>

      {/* Modal */}
      <TeamMemberModal isOpen={isModalOpen} onClose={closeModal} member={selectedMember} />
    </div>
  );
};

export default TeamMembers;


  // import React, { useState } from "react";
  // import DropDown from "../../../components/DropDown";
  // import Button from "../../../components/Button";
  // import Input from "../../../components/Input";
  // import SearchBar from "../../../components/SearchBar";

  // const initialTeam = [
  //   { id: 1, name: "Ar. Neha Sharma", role: "Architect", location: "Delhi", experience: "8 Years", charges: "₹1,500/hr" },
  //   { id: 2, name: "Designer Raj", role: "Interior Designer", location: "Mumbai", experience: "5 Years", charges: "₹1,000/hr" },
  //   { id: 3, name: "Consultant Aman", role: "Consultant", location: "Bangalore", experience: "6 Years", charges: "₹1,200/hr" },
  // ];

  // const roles = ["Architect", "Interior Designer", "Consultant"];
  // const locations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad"];

  // const TeamMembers = () => {
  //   const [team, setTeam] = useState(initialTeam);
  //   const [searchTerm, setSearchTerm] = useState("");
  //   const [selectedRole, setSelectedRole] = useState("");
  //   const [selectedLocation, setSelectedLocation] = useState("");
  // const [selectedMember, setSelectedMember] = useState(null);
  //   const [newMember, setNewMember] = useState({
  //     name: "",
  //     role: "",
  //     location: "",
  //     experience: "",
  //     charges: "",
  //   });

  //   const filteredTeam = team.filter((member) => {
  //     const matchSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
  //     const matchRole = selectedRole ? member.role === selectedRole : true;
  //     const matchLocation = selectedLocation ? member.location === selectedLocation : true;
  //     return matchSearch && matchRole && matchLocation;
  //   });

  //   const handleAddMember = () => {
  //     const id = team.length + 1;
  //     setTeam([...team, { id, ...newMember }]);
  //     setNewMember({ name: "", role: "", location: "", experience: "", charges: "" });
  //   };

  //   return (
  //     <div className="p-6 space-y-6">
  //       <h2 className="text-xl font-bold">Team Members</h2>

  //       {/* Filters */}
  //       <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
  //           <SearchBar
  //             value={searchTerm}
  //             onChange={(e) => setSearchTerm(e.target.value)}
  //             placeholder="Search by name"
  //           />
  //         </div>
  //         <DropDown
  //           label="Role"
  //           name="role"
  //           value={selectedRole}
  //           onChange={(e) => setSelectedRole(e.target.value)}
  //           options={roles}
  //         />
  //         <DropDown
  //           label="Location"
  //           name="location"
  //           value={selectedLocation}
  //           onChange={(e) => setSelectedLocation(e.target.value)}
  //           options={locations}
  //         />
  //         <div className="flex items-end">
  //           <Button
  //             onClick={() => {
  //               setSearchTerm("");
  //               setSelectedRole("");
  //               setSelectedLocation("");
  //             }}
  //             color="gray"
  //             fullWidth
  //           >
  //             Reset Filters
  //           </Button>
  //         </div>
  //       </div>

  //       {/* Member Cards */}
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //         {filteredTeam.map((member) => (
  //           <div key={member.id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
  //             <h3 className="font-semibold text-lg">{member.name}</h3>
  //             <p className="text-sm text-gray-600">{member.role} - {member.location}</p>
  //             <p className="text-sm">Experience: {member.experience}</p>
  //             <p className="text-sm">Charges: {member.charges}</p>
  //           </div>
  //         ))}
  //       </div>

  //       {/* Add New Member */}
  //       <div className="mt-6 border-t pt-6 space-y-4">
  //         <h3 className="text-lg font-semibold">Add New Member</h3>
  //         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
  //             <Input
  //               name="name"
  //               placeholder="Enter name"
  //               value={newMember.name}
  //               onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
  //             />
  //           </div>
  //           <DropDown
  //             label="Role"
  //             name="newRole"
  //             value={newMember.role}
  //             onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
  //             options={roles}
  //           />
  //           <DropDown
  //             label="Location"
  //             name="newLocation"
  //             value={newMember.location}
  //             onChange={(e) => setNewMember({ ...newMember, location: e.target.value })}
  //             options={locations}
  //           />
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
  //             <Input
  //               name="experience"
  //               placeholder="e.g. 5 Years"
  //               value={newMember.experience}
  //               onChange={(e) => setNewMember({ ...newMember, experience: e.target.value })}
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-1">Charges</label>
  //             <Input
  //               name="charges"
  //               placeholder="e.g. ₹1000/hr"
  //               value={newMember.charges}
  //               onChange={(e) => setNewMember({ ...newMember, charges: e.target.value })}
  //             />
  //           </div>
  //         </div>
  //         <Button onClick={handleAddMember} color="green">
  //           Add Member
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // };

  // export default TeamMembers;
