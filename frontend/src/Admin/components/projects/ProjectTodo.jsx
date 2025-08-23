import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiPlus, FiFilter } from "react-icons/fi";
import Button from "../../../components/Button";
import SearchBar from "../../../components/SearchBar";
import DropDown from "../../../components/DropDown";
import TodoFilter from "./TodoFilter"; 
import AddNewTodoModal from "./AddNewTodoModal";
function ProjectToDo({projectId}) {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  // eslint-disable-next-line 
  const [filteredItems, setFilteredItems] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="p-4 md:p-6 space-y-4 bg-white w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
          <div className="w-40">
            <DropDown
              name="status"
              value={status}
              options={["Pending", "Completed"]}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>

          <div className="w-40">
            <DropDown
              name="type"
              value={type}
              options={["Plumbing", "Electrical"]}
              onChange={(e) => setType(e.target.value)}
            />
          </div>

          <div className="w-60">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
            />
          </div>

          <Button
            className="text-red-600 text-sm flex items-center gap-1 hover:bg-red-200 cursor-pointer bg-red-100"
            onClick={() => setShowFilter(true)}
          >
            <FiFilter />
            Filter
          </Button>
        </div>

        <Button className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2" 
        onClick={()=>setIsModalOpen(true)}>
          <FiPlus />
          New To Do
        </Button>
      </div>

      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-red-100 text-left">
            <tr>
              <th className="px-4 py-2">Item Name</th>
              <th className="px-4 py-2">Due Date</th>
              <th className="px-4 py-2">Assigned</th>
              <th className="px-4 py-2">Project</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Example Row */}
            <tr className="border-t">
              <td className="px-4 py-3 flex items-center gap-2">
                <span className="text-lg">↻</span>
                <span>plumbing</span>
              </td>
              <td className="px-4 py-3 text-red-600 font-medium">29 Jul</td>
              <td className="px-4 py-3">Alam Glass... +1</td>
              <td className="px-4 py-3">Dr Manoj | 135 Naraina</td>
              <td className="px-4 py-3 flex items-center gap-1">
                <span>plumbing</span>
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-1" />
              </td>
              <td className="px-4 py-3">
                <button className="text-gray-500 hover:text-black">
                  <BsThreeDotsVertical />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <TodoFilter
        show={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(filters) => {
          setFilteredItems(filters);
          setShowFilter(false);
          console.log("Applied Filters: ", filters);
        }}
      />
      
      
       <AddNewTodoModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
}

export default ProjectToDo;
