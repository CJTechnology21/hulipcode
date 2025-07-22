import React, { useState, useEffect } from "react";
import ArchitectCard from "../components/ArchitectCard";
import HomeHeader from "./HomeHeader";
import DropDown from "../components/DropDown";
import SearchBar from "../components/SearchBar";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
const architects = [
  {
    id: 1,
    name: "Ar. Neha Sharma",
    username: "neha_sharma",
    location: "Delhi",
    experience: "8 Years",
    rate: 20,
    score: "8.5",
    successRate: "96",
    rating: 4.0,
    reviews: 120,
    tagline: "Creative Interior Design & Artistic Painting",
    bio: "Experienced interior designer and painter delivering elegant living spaces.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
    flagUrl: "https://flagcdn.com/w40/in.png",
    skills: ["Interior Designer", "Painter"],
  },
  {
    id: 2,
    name: "Ar. Raj Mehta",
    username: "raj_mehta",
    location: "Mumbai",
    experience: "5 Years",
    rate: 25,
    score: "7.9",
    successRate: "89",
    rating: 3.0,
    reviews: 85,
    tagline: "Expert Plumbing & Detailed Painting",
    bio: "Dedicated to quality plumbing solutions and detailed paint finishes.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
    flagUrl: "https://flagcdn.com/w40/in.png",
    skills: ["Plumber", "Painter"],
  },
  {
    id: 3,
    name: "Ar. Krishna Mehta",
    username: "krishna_mehta",
    location: "Hyderabad",
    experience: "6 Years",
    rate: 15,
    score: "9.3",
    successRate: "98",
    rating: 5.0,
    reviews: 150,
    tagline: "Modern Interiors & Custom Carpentry",
    bio: "Specialized in modern interior designs and high-quality woodwork.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
    flagUrl: "https://flagcdn.com/w40/in.png",
    skills: ["Interior Designer", "Carpenter"],
  },
  {
    id: 4,
    name: "Sanjay Saahu",
    username: "sanjay_saahu",
    location: "Bangalore",
    experience: "6 Years",
    rate: 15,
    score: "9.0",
    successRate: "97",
    rating: 5.0,
    reviews: 150,
    tagline: "Elegant Design & Skilled Carpentry",
    bio: "Creating functional interiors and lasting wooden structures.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
    flagUrl: "https://flagcdn.com/w40/in.png",
    skills: ["Interior Designer", "Carpenter"],
  },
  {
    id: 5,
    name: "Balu",
    username: "balu_chennai",
    location: "Chennai",
    experience: "6 Years",
    rate: 15,
    score: "8.8",
    successRate: "94",
    rating: 4.0,
    reviews: 150,
    tagline: "Versatile Interior Work & Woodcraft",
    bio: "Passionate about turning concepts into beautiful living environments.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
    flagUrl: "https://flagcdn.com/w40/in.png",
    skills: ["Interior Designer", "Carpenter"],
  },
];

const mockProjects = [
  {
    id: 1,
    title: "Modern Home Renovation",
    location: "Mumbai",
    budget: "₹8,00,000",
    postedBy: "Rajeev Sharma",
    description:
      "Need a designer for 3BHK apartment revamp with modern interior theme.",
  },
  {
    id: 2,
    title: "Cafe Interior Design",
    location: "Delhi",
    budget: "₹5,00,000",
    postedBy: "Ankita Verma",
    description:
      "Seeking aesthetic designer for a new café layout and ambience design.",
  },
];

const allSkills = ["Interior Designer", "Painter", "Carpenter", "Plumber"];
const allLocations = ["Delhi", "Mumbai", "Hyderabad", "Banglore", "Chennai"];

function HomeArchitectListings() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("freelancers");
  const [filters, setFilters] = useState({
    sqftRateMin: "",
    sqftRateMax: "",
    selectedSkills: [],
    minReviews: "",
    maxReviews: "",
    rating: 0,
    selectedLocations: [],
  });
  const [sort, setSort] = useState("Most Relevant");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [search, filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "selectedSkills") {
      const updatedSkills = checked
        ? [...filters.selectedSkills, value]
        : filters.selectedSkills.filter((skill) => skill !== value);
      setFilters((prev) => ({ ...prev, selectedSkills: updatedSkills }));
    } else if (name === "selectedLocations") {
      const updatedLocations = checked
        ? [...filters.selectedLocations, value]
        : filters.selectedLocations.filter((loc) => loc !== value);
      setFilters((prev) => ({ ...prev, selectedLocations: updatedLocations }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };
  const filteredArchitects = architects.filter((arch) => {
    const matchesName = arch.name.toLowerCase().includes(search.toLowerCase());

    const matchesSkills =
      filters.selectedSkills.length === 0 ||
      filters.selectedSkills.every((skill) => arch.skills.includes(skill));

    const matchesLocation =
      filters.selectedLocations.length === 0 ||
      filters.selectedLocations.includes(arch.location);

    const rate = parseInt(arch.rate);
    const rateMin = parseInt(filters.sqftRateMin) || 0;
    const rateMax = parseInt(filters.sqftRateMax) || Infinity;
    const matchesRate = rate >= rateMin && rate <= rateMax;

    const reviews = parseInt(arch.reviews);
    const revMin = parseInt(filters.minReviews) || 0;
    const revMax = parseInt(filters.maxReviews) || Infinity;
    const matchesReviews = reviews >= revMin && reviews <= revMax;

    const matchesRating = filters.rating === 0 || arch.rating >= filters.rating;

    return (
      matchesName &&
      matchesSkills &&
      matchesLocation &&
      matchesRate &&
      matchesReviews &&
      matchesRating
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <HomeHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full bg-black py-8 px-4 rounded-md mb-8">
          <h1 className="text-4xl font-bold text-center text-white mb-6">
            Find Certified Architects
          </h1>
          <div className="flex justify-center gap-4">
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setActiveTab("freelancers")}
                color="white"
                className={`rounded-full font-medium ${
                  activeTab === "freelancers"
                    ? "bg-blue-700 text-white"
                    : "bg-blue-900 text-white hover:bg-blue-600"
                }`}
                size="md"
              >
                Freelancers
              </Button>
              <Button
                onClick={() => setActiveTab("projects")}
                color="white"
                className={`rounded-full font-medium ${
                  activeTab === "projects"
                    ? "bg-blue-700 text-white"
                    : "bg-blue-900 text-white hover:bg-blue-600"
                }`}
                size="md"
              >
                Projects
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4 h-[700px] bg-white rounded-xl shadow-md p-6 space-y-6 overflow-hidden">
            <h2 className="text-xl font-semibold text-[#0b1c38]">Filters</h2>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-800">Sqft Rate</span>
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      sqftRateMin: "",
                      sqftRateMax: "",
                    }))
                  }
                  className="text-sm text-blue-500"
                >
                  Clear
                </button>
              </div>
              <div className="flex gap-2">
                <Input
                  name="sqftRateMin"
                  placeholder="Min ₹/sqft"
                  value={filters.sqftRateMin}
                  onChange={handleFilterChange}
                />
                <Input
                  name="sqftRateMax"
                  placeholder="Max ₹/sqft"
                  value={filters.sqftRateMax}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Services */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-800">Services</span>
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, selectedSkills: [] }))
                  }
                  className="text-sm text-blue-500"
                >
                  Clear
                </button>
              </div>

              <div className="mb-2">
                <SearchBar placeholder="Search services..." />
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                {allSkills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="selectedSkills"
                      value={skill}
                      checked={filters.selectedSkills.includes(skill)}
                      onChange={handleFilterChange}
                    />
                    <label>{skill}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-800">Location</span>
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, selectedLocations: [] }))
                  }
                  className="text-sm text-blue-500"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                {allLocations.map((loc) => (
                  <div key={loc} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="selectedLocations"
                      value={loc}
                      checked={filters.selectedLocations.includes(loc)}
                      onChange={handleFilterChange}
                    />
                    <label>{loc}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-800">Rating</span>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, rating: 0 }))}
                  className="text-sm text-blue-500"
                >
                  Clear
                </button>
              </div>
              <div className="flex gap-1 text-lg cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, rating: star }))
                    }
                    className={
                      filters.rating >= star
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-800">Reviews</span>
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      minReviews: "",
                      maxReviews: "",
                    }))
                  }
                  className="text-sm text-blue-500"
                >
                  Clear
                </button>
              </div>
              <div className="flex gap-2">
                <Input
                  name="minReviews"
                  placeholder="Min"
                  value={filters.minReviews}
                  onChange={handleFilterChange}
                />
                <Input
                  name="maxReviews"
                  placeholder="Max"
                  value={filters.maxReviews}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "freelancers" ? (
              <>
                {/* Freelancer search + sort + filters UI stays unchanged */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                  <div className="flex flex-col w-full sm:w-1/2">
                    <label className="text-sm text-gray-600 mb-1">
                      Search for Architects
                    </label>
                    <SearchBar
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search architect name..."
                    />
                  </div>

                  <div className="w-full sm:w-1/2">
                    <DropDown
                      label="Sort by"
                      name="sort"
                      value={sort}
                      options={["Most Relevant", "Experience", "Charges"]}
                      onChange={(e) => setSort(e.target.value)}
                    />
                  </div>
                </div>

                <div className="text-gray-600 text-sm mb-4">
                  Showing {filteredArchitects.length} result
                  {filteredArchitects.length !== 1 && "s"}
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {filteredArchitects.map((arch) => (
                    <ArchitectCard key={arch.id} architect={arch} />
                  ))}
                </div>

                {filteredArchitects.length === 0 && (
                  <div className="text-center mt-12 text-gray-500">
                    No architects found based on your filters.
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Projects View */}
                <div className="text-xl font-semibold text-[#0b1c38] mb-6">
                  These are our Previous Projects
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {mockProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="text-lg font-bold text-[#0b1c38] mb-2">
                        {proj.title}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        📍 {proj.location}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        💰 Budget: {proj.budget}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        👤 Posted by: {proj.postedBy}
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* <div className="flex-1">
         
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            
              <div className="flex flex-col w-full sm:w-1/2">
                <label className="text-sm text-gray-600 mb-1">
                  Search for Architects
                </label>
                <SearchBar
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search architect name..."
                />
              </div>

    
              <div className="w-full sm:w-1/2">
                <DropDown
                  label="Sort by"
                  name="sort"
                  value={sort}
                  options={["Most Relevant", "Experience", "Charges"]}
                  onChange={(e) => setSort(e.target.value)}
                />
              </div>
            </div>

      
            <div className="text-gray-600 text-sm mb-4">
              Showing {filteredArchitects.length} result
              {filteredArchitects.length !== 1 && "s"}
            </div>

     
            <div className="grid grid-cols-1 gap-6">
              {filteredArchitects.map((arch) => (
                <ArchitectCard key={arch.id} architect={arch} />
              ))}
            </div>
            {filteredArchitects.length === 0 && (
              <div className="text-center mt-12 text-gray-500">
                No architects found based on your filters.
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default HomeArchitectListings;
