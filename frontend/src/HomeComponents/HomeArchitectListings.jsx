import React, { useState, useEffect } from "react";
// import Input from "../components/Input";
import ArchitectCard from "../components/ArchitectCard";
import HomeHeader from "./HomeHeader";
import DropDown from "../components/DropDown";
import SearchBar from "../components/SearchBar";

const architects = [
  {
    id: 1,
    name: "Ar. Neha Sharma",
    location: "Delhi",
    experience: "8 Years",
    charges: "₹1,000/hr",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
  },
  {
    id: 2,
    name: "Ar. Raj Mehta",
    location: "Mumbai",
    experience: "5 Years",
    charges: "₹1,500/hr",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
  },
  {
    id: 3,
    name: "Ar. Krishna Mehta",
    location: "Hyderabad",
    experience: "5 Years",
    charges: "₹1,500/hr",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
  },
  {
    id: 4,
    name: "Ar. Sanjay Saahu",
    location: "Chennai",
    experience: "5 Years",
    charges: "₹1,500/hr",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
  },
  {
    id: 5,
    name: "Ar. Balu",
    location: "Banglore",
    experience: "5 Years",
    charges: "₹1,500/hr",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
  },
];

function HomeArchitectListings() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    experience: "",
    charges: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Scroll to top on search or filter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [search, filters]);

  const filteredArchitects = architects.filter((arch) => {
    return (
      arch.name.toLowerCase().includes(search.toLowerCase()) &&
      (filters.location === "" || arch.location === filters.location) &&
      (filters.experience === "" || arch.experience === filters.experience) &&
      (filters.charges === "" || arch.charges === filters.charges)
    );
  });

  return (
    <div className="max-w-screen bg-gray-100">
      <HomeHeader />
      <h1 className="text-3xl font-bold mt-6 text-center text-[#0b1c38]">
        Find Certified Architects
      </h1>

      {/* Filters & Search */}
      <div className="mt-8 px-6">
        <div className="flex flex-col lg:flex-row flex-wrap gap-4 justify-center">
          <div className="w-full sm:w-60">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by Name
            </label>
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
            />
          </div>

          <div className="w-full sm:w-52">
            <DropDown
              label="Location"
              name="location"
              value={filters.location}
              options={["Delhi", "Mumbai", "Banglore", "Chennai", "Hyderabad"]}
              onChange={handleFilterChange}
            />
          </div>

          <div className="w-full sm:w-52">
            <DropDown
              label="Experience"
              name="experience"
              value={filters.experience}
              options={["2 Years", "5 Years", "8 Years"]}
              onChange={handleFilterChange}
            />
          </div>

          <div className="w-full sm:w-52">
            <DropDown
              label="Charges"
              name="charges"
              value={filters.charges}
              options={["₹1,000/hr", "₹1,500/hr"]}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Architect Grid */}
      <div className="grid grid-cols-1 mt-8 p-6 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArchitects.map((arch) => (
          <ArchitectCard key={arch.id} architect={arch} />
        ))}
      </div>

      {filteredArchitects.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          No architects found based on your filters.
        </div>
      )}
    </div>
  );
}

export default HomeArchitectListings;
