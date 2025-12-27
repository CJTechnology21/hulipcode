import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HomeHeader from "../HomeComponents/HomeHeader";
import { getAllPortfolioProfiles } from "../services/portfolioProfileServices";
import { addToShortlist, checkMultipleShortlisted } from "../services/shortlistServices";
import { useAuth } from "../context/AuthContext";
import { FaChevronLeft, FaChevronRight, FaBookmark, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

function Professional() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Property Types");
  const [viewMode, setViewMode] = useState("projects"); // "firms" or "projects"
  const [imageIndices, setImageIndices] = useState({}); // Track current image index for each professional
  const [shortlistedMap, setShortlistedMap] = useState({}); // Map of professionalId -> shortlisted status
  const autoSlideIntervals = useRef({}); // Store interval IDs for auto-sliding

  const propertyTypes = ["All Property Types", "HDB", "Commercial", "Condo", "Terrace", "Landed"];

  useEffect(() => {
    loadProfessionals();
  }, [user]); // Reload when user changes (login/logout)

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      const data = await getAllPortfolioProfiles();
      setProfessionals(data || []);
      // Initialize image indices for all portfolio profiles
      const indices = {};
      data.forEach((prof, profIndex) => {
        // Use portfolio profile images if available, otherwise use first project images
        const images = prof.images && prof.images.length > 0 
          ? prof.images 
          : (prof.projects && prof.projects.length > 0 && prof.projects[0].images 
              ? prof.projects[0].images 
              : []);
        if (images.length > 0) {
          indices[profIndex] = 0;
        }
      });
      setImageIndices(indices);

      // Load shortlist status if user is logged in
      if (user && data.length > 0) {
        try {
          const professionalIds = data
            .map(prof => prof.architectId?._id?.toString())
            .filter(id => id);
          
          if (professionalIds.length > 0) {
            const shortlistStatus = await checkMultipleShortlisted(professionalIds);
            setShortlistedMap(shortlistStatus);
          }
        } catch (error) {
          console.error("Error loading shortlist status:", error);
          // Don't show error toast, just continue without shortlist status
        }
      }
    } catch (error) {
      console.error("Error loading professionals:", error);
      toast.error("Failed to load professionals");
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-slide effect - runs when professionals data changes
  useEffect(() => {
    if (loading || professionals.length === 0) return;

    // Clear any existing intervals
    Object.values(autoSlideIntervals.current).forEach(interval => clearInterval(interval));
    autoSlideIntervals.current = {};

    // Small delay to ensure state is fully updated
    const timeoutId = setTimeout(() => {
      // Set up auto-sliding for each portfolio profile with multiple images
      professionals.forEach((prof, profIndex) => {
        // Use portfolio profile images if available, otherwise use first project images
        const images = prof.images && prof.images.length > 0 
          ? prof.images 
          : (prof.projects && prof.projects.length > 0 && prof.projects[0].images 
              ? prof.projects[0].images 
              : []);
        
        if (images.length > 1) {
          const intervalId = setInterval(() => {
            setImageIndices((prev) => {
              const currentIndex = prev[profIndex] || 0;
              const maxIndex = images.length - 1;
              const nextIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
              return {
                ...prev,
                [profIndex]: nextIndex
              };
            });
          }, 3000); // Change image every 3 seconds
          
          autoSlideIntervals.current[profIndex] = intervalId;
        }
      });
    }, 100);

    // Cleanup on unmount or when professionals change
    return () => {
      clearTimeout(timeoutId);
      Object.values(autoSlideIntervals.current).forEach(interval => clearInterval(interval));
      autoSlideIntervals.current = {};
    };
  }, [professionals, loading]);

  const handleImageNavigation = (profIndex, direction) => {
    const prof = professionals[profIndex];
    if (!prof) return;

    // Get images from portfolio profile or first project
    const images = prof.images && prof.images.length > 0 
      ? prof.images 
      : (prof.projects && prof.projects.length > 0 && prof.projects[0].images 
          ? prof.projects[0].images 
          : []);

    // Pause auto-sliding when user manually navigates
    if (autoSlideIntervals.current[profIndex]) {
      clearInterval(autoSlideIntervals.current[profIndex]);
      delete autoSlideIntervals.current[profIndex];
      
      // Resume auto-sliding after 5 seconds
      setTimeout(() => {
        if (images.length > 1) {
          const intervalId = setInterval(() => {
            setImageIndices((prev) => {
              const currentIndex = prev[profIndex] || 0;
              const maxIndex = images.length - 1;
              const nextIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
              return {
                ...prev,
                [profIndex]: nextIndex
              };
            });
          }, 3000);
          autoSlideIntervals.current[profIndex] = intervalId;
        }
      }, 5000);
    }
    
    if (images.length === 0) return;

    setImageIndices((prev) => {
      const currentIndex = prev[profIndex] || 0;
      const maxIndex = images.length - 1;
      
      if (direction === "next") {
        return { ...prev, [profIndex]: currentIndex < maxIndex ? currentIndex + 1 : 0 };
      } else {
        return { ...prev, [profIndex]: currentIndex > 0 ? currentIndex - 1 : maxIndex };
      }
    });
  };

  const getDisplayImage = (prof, profIndex) => {
    // Use portfolio profile images if available, otherwise use first project images
    const images = prof.images && prof.images.length > 0 
      ? prof.images 
      : (prof.projects && prof.projects.length > 0 && prof.projects[0].images 
          ? prof.projects[0].images 
          : []);
    
    if (images.length === 0) return null;
    const currentIndex = imageIndices[profIndex] || 0;
    return images[currentIndex];
  };

  const getProjectTags = (prof) => {
    const tags = [];
    if (prof.projects && prof.projects.length > 0) {
      const types = new Set();
      prof.projects.forEach((project) => {
        if (project.type && project.type !== "All Property Types") {
          types.add(project.type);
        }
      });
      return Array.from(types).slice(0, 3); // Max 3 tags
    }
    return tags;
  };

  const getRepresentativeProject = (prof) => {
    // Get the first/most recent project for display
    if (prof.projects && prof.projects.length > 0) {
      return prof.projects[0];
    }
    return null;
  };

  const filteredProfessionals = professionals.filter((prof) => {
    // Search filter
    const matchesSearch =
      !searchTerm ||
      prof.portfolioName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.architectId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter - check if any project matches the type
    const matchesType =
      filterType === "All Property Types" ||
      (prof.projects && prof.projects.some((p) => p.type === filterType));

    return matchesSearch && matchesType;
  });

  const handleShortlist = async (prof) => {
    // Check if user is logged in
    if (!user) {
      toast.info("Please login to shortlist professionals");
      navigate("/login");
      return;
    }

    try {
      const professionalId = prof.architectId?._id;
      const portfolioProfileId = prof._id;

      if (!professionalId || !portfolioProfileId) {
        toast.error("Invalid professional data");
        return;
      }

      await addToShortlist(professionalId.toString(), portfolioProfileId.toString());
      
      // Update shortlisted status in local state
      setShortlistedMap(prev => ({
        ...prev,
        [professionalId.toString()]: true
      }));

      toast.success("Professional shortlisted successfully!");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.info("Please login to shortlist professionals");
        navigate("/login");
      } else {
        const message = error.response?.data?.message || "Failed to shortlist professional";
        toast.error(message);
      }
    }
  };

  const handleViewProjects = (prof) => {
    navigate(`/architectsdetails`, { 
      state: { 
        architectId: prof.architectId._id,
        portfolioProfile: prof 
      } 
    });
  };

  if (loading) {
    return (
      <div>
        <HomeHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading professionals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />
      
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">HUELIP's ID Directory</h1>
              <p className="text-gray-600 mt-1">Explore trusted interior designers on HUELIP</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("firms")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === "firms"
                      ? "bg-teal-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  View by ID Firms
                </button>
                <button
                  onClick={() => setViewMode("projects")}
                  className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                    viewMode === "projects"
                      ? "bg-teal-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>✓</span> View by Projects
                </button>
              </div>

              {/* Search */}
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={`Search from ${professionals.length} Professionals`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="outline-none text-sm w-48"
                />
              </div>

              {/* Filter */}
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter Projects
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Dropdown (can be expanded later) */}
      {filterType !== "All Property Types" && (
        <div className="bg-white border-b px-4 py-2">
          <div className="max-w-7xl mx-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-teal-500 rounded px-3 py-1 text-sm"
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredProfessionals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No professionals found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((prof, index) => {
              const displayImage = getDisplayImage(prof, index);
              const tags = getProjectTags(prof);
              const representativeProject = getRepresentativeProject(prof);
              
              // Get images from portfolio profile or first project
              const images = prof.images && prof.images.length > 0 
                ? prof.images 
                : (prof.projects && prof.projects.length > 0 && prof.projects[0].images 
                    ? prof.projects[0].images 
                    : []);
              
              const imageCount = images.length;
              const currentImageIndex = imageIndices[index] || 0;

              return (
                <div
                  key={prof._id || prof.architectId?._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative"
                >
                  {/* Image Section with Carousel */}
                  {displayImage ? (
                    <div className="relative h-64 bg-gray-100 group overflow-hidden">
                      <img
                        key={`${prof._id}-${currentImageIndex}`}
                        src={displayImage}
                        alt={prof.portfolioName || prof.architectId?.name}
                        className="w-full h-full object-cover transition-opacity duration-500"
                      />
                      
                      {/* Navigation Arrows */}
                      {imageCount > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageNavigation(index, "prev");
                            }}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-opacity-90"
                          >
                            <FaChevronLeft size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageNavigation(index, "next");
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-opacity-90"
                          >
                            <FaChevronRight size={16} />
                          </button>
                          
                          {/* Pagination Dots */}
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {Array.from({ length: Math.min(imageCount, 8) }).map((_, dotIndex) => (
                              <div
                                key={dotIndex}
                                className={`w-2 h-2 rounded-full ${
                                  dotIndex === currentImageIndex
                                    ? "bg-white"
                                    : "bg-white bg-opacity-50"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}

                  {/* Content Section - Fixed Layout */}
                  <div className="p-5 pb-20">
                    {/* Portfolio Name */}
                    <h3 className="font-bold text-xl text-gray-900 mb-1">
                      {prof.portfolioName || prof.architectId?.name || "Professional"}
                    </h3>
                    
                    {/* Completed Projects */}
                    <p className="text-sm font-semibold text-gray-600 mb-3 uppercase">
                      {prof.completedProjects || 0} COMPLETED PROJECTS
                    </p>
                    
                    {/* Address */}
                    {prof.address && (
                      <p className="text-sm text-gray-700 mb-4">
                        {prof.address}
                      </p>
                    )}
                    
                    {/* Representative Project Details */}
                    {representativeProject && (
                      <>
                        <p className="text-sm text-gray-600 mb-1">
                          {representativeProject.name || prof.architectId?.name}
                        </p>
                        <p className="text-sm text-gray-500 mb-3">
                          {representativeProject.budget && `Renovated for ₹${representativeProject.budget.toLocaleString()}`}
                          {representativeProject.timeframe && ` • ${representativeProject.timeframe}`}
                        </p>
                      </>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-gray-100 text-teal-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fixed Position Buttons at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => handleShortlist(prof)}
                      className={`flex-1 px-4 py-2.5 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        shortlistedMap[prof.architectId?._id?.toString()] 
                          ? "bg-teal-600 text-white hover:bg-teal-700" 
                          : "bg-teal-500 text-white hover:bg-teal-600"
                      }`}
                    >
                      <FaBookmark size={14} />
                      {shortlistedMap[prof.architectId?._id?.toString()] ? "Shortlisted" : "Shortlist"}
                    </button>
                    <button
                      onClick={() => handleViewProjects(prof)}
                      className="flex-1 bg-white text-gray-700 border border-gray-300 px-4 py-2.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaEye size={14} />
                      View Projects
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Professional;

