import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeHeader from "./HomeHeader";
import { getPortfolioProfileByArchitectId } from "../services/portfolioProfileServices";
import { getPortfoliosByArchitectId } from "../services/portfolioServices";
import { FaChevronLeft, FaChevronRight, FaFacebook, FaInstagram, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

function HomeArchitectDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [portfolioProfile, setPortfolioProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [otherProjectsStartIndex, setOtherProjectsStartIndex] = useState(0);
  const autoSlideInterval = useRef(null);

  // Handle viewing a project from other projects section
  const handleViewProject = (projectIndex) => {
    setCurrentProjectIndex(projectIndex);
    setCurrentImageIndex(0);
    // Scroll to top of project section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get architect ID from location state or URL params
  const architectId = location.state?.architectId || location.state?.portfolioProfile?.architectId?._id;

  useEffect(() => {
    if (architectId) {
      loadData();
    } else {
      toast.error("Professional not found");
      navigate("/professional");
    }
  }, [architectId]);

  // Auto-slide images for the main project
  useEffect(() => {
    const currentProject = projects[currentProjectIndex];
    if (currentProject && currentProject.images && currentProject.images.length > 1) {
      // Reset image index when project changes
      setCurrentImageIndex(0);
      
      autoSlideInterval.current = setInterval(() => {
        setCurrentImageIndex((prev) => {
          const maxIndex = currentProject.images.length - 1;
          return prev < maxIndex ? prev + 1 : 0;
        });
      }, 3000);
    }

    return () => {
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
      }
    };
  }, [projects, currentProjectIndex]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, projectsData] = await Promise.all([
        getPortfolioProfileByArchitectId(architectId),
        getPortfoliosByArchitectId(architectId)
      ]);
      
      setPortfolioProfile(profileData);
      setProjects(projectsData || []);
      
      if (projectsData && projectsData.length > 0) {
        setCurrentProjectIndex(0);
        setCurrentImageIndex(0);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load professional details");
      navigate("/professional");
    } finally {
      setLoading(false);
    }
  };

  const handleImageNavigation = (direction) => {
    const currentProject = projects[currentProjectIndex];
    if (!currentProject || !currentProject.images || currentProject.images.length === 0) return;
    
    const maxIndex = currentProject.images.length - 1;
    
    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    } else {
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    }
    
    // Reset auto-slide timer
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleOtherProjectsNavigation = (direction) => {
    if (projects.length <= 1) return;
    const maxIndex = projects.length - 1;
    if (direction === "next") {
      setOtherProjectsStartIndex((prev) => (prev < maxIndex - 2 ? prev + 1 : 0));
    } else {
      setOtherProjectsStartIndex((prev) => (prev > 0 ? prev - 1 : maxIndex - 2));
    }
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    // TODO: Implement enquiry submission
    toast.success("Enquiry submitted successfully!");
    setEnquiryForm({ name: "", email: "", phone: "" });
  };

  if (loading) {
    return (
      <div>
        <HomeHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading professional details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolioProfile || projects.length === 0) {
    return (
      <div>
        <HomeHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">No projects found for this professional</p>
        </div>
      </div>
    );
  }

  const currentProject = projects[currentProjectIndex] || projects[0];
  // Get other projects (all except the currently displayed one)
  const otherProjects = projects.filter((_, index) => index !== currentProjectIndex);
  const currentImage = currentProject?.images?.[currentImageIndex] || currentProject?.images?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/professional")}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <FaChevronLeft /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Portfolio Profile Info */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Portfolio Name and Completed Projects */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {portfolioProfile.portfolioName || portfolioProfile.architectId?.name}
              </h1>
              <p className="text-gray-600">
                {portfolioProfile.completedProjects || 0} Completed Projects
              </p>
            </div>

            {/* About Us */}
            {portfolioProfile.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">About us</h2>
                <p className="text-gray-700 text-sm">
                  {portfolioProfile.description}
                </p>
              </div>
            )}

            {/* Address */}
            {portfolioProfile.address && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Address</h2>
                <p className="text-gray-700 text-sm">{portfolioProfile.address}</p>
              </div>
            )}

            {/* Socials */}
            {(portfolioProfile.socialLinks?.facebook || portfolioProfile.socialLinks?.instagram) && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Socials</h2>
                <div className="flex gap-4">
                  {portfolioProfile.socialLinks.facebook && (
                    <a
                      href={portfolioProfile.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaFacebook size={24} />
                    </a>
                  )}
                  {portfolioProfile.socialLinks.instagram && (
                    <a
                      href={portfolioProfile.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-800"
                    >
                      <FaInstagram size={24} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Accreditations */}
            {portfolioProfile.accreditations && portfolioProfile.accreditations.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Accreditations</h2>
                <div className="space-y-2">
                  {portfolioProfile.accreditations.map((acc, index) => (
                    <div key={index} className="bg-gray-100 px-3 py-2 rounded text-sm">
                      {acc}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Send an enquiry form */}
            <div className="bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Send an enquiry</h2>
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Your Phone Number"
                  value={enquiryForm.phone}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors"
                >
                  Next
                </button>
              </form>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCheck className="text-teal-500" />
                  <span>Non-obligatory consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheck className="text-teal-500" />
                  <span>1-on-1 with an interior designer</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheck className="text-teal-500" />
                  <span>Open discussion about your home</span>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Right Side - Current Project */}
          <div className="lg:w-2/3 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentProject.name}
            </h2>

            {/* Main Project Image */}
            {currentImage && (
              <div className="relative mb-4">
                <img
                  src={currentImage}
                  alt={currentProject.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {currentProject.images && currentProject.images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation("prev")}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={() => handleImageNavigation("next")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Project Budget and Timeframe */}
            <div className="flex gap-6 mb-4">
              <div>
                <span className="text-gray-600">PROJECT BUDGET</span>
                <p className="text-lg font-semibold">
                  ${currentProject.budget?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-gray-600">PROJECT TIMEFRAME</span>
                <p className="text-lg font-semibold">{currentProject.timeframe || "N/A"}</p>
              </div>
            </div>

            {/* Image Thumbnails */}
            {currentProject.images && currentProject.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {currentProject.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded overflow-hidden border-2 ${
                      index === currentImageIndex
                        ? "border-teal-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${currentProject.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Tags */}
            {currentProject.type && (
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-teal-600 rounded-full text-sm">
                  {currentProject.type}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-teal-600 rounded-full text-sm">
                  Modern
                </span>
                <span className="px-3 py-1 bg-gray-100 text-teal-600 rounded-full text-sm">
                  Scandinavian
                </span>
              </div>
            )}

            {/* Other Projects Section - Bottom of Right Side */}
            {otherProjects.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Other Projects by {portfolioProfile.portfolioName || portfolioProfile.architectId?.name} ({otherProjects.length})
                  </h2>
                  {otherProjects.length > 3 && (
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-600">PREV/NEXT</span>
                    </div>
                  )}
                </div>

                <div className="relative">
                  {otherProjects.length > 3 && (
                    <>
                      <button
                        onClick={() => handleOtherProjectsNavigation("prev")}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-50"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={() => handleOtherProjectsNavigation("next")}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-50"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
                    {otherProjects
                      .slice(otherProjectsStartIndex, otherProjectsStartIndex + 3)
                      .map((project) => {
                        // Find the actual index of this project in the original projects array
                        const actualIndex = projects.findIndex(p => p._id === project._id);
                        return (
                        <div
                          key={project._id}
                          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                        >
                          {project.images && project.images.length > 0 && (
                            <div className="relative h-48 group">
                              <img
                                src={project.images[0]}
                                alt={project.name}
                                className="w-full h-full object-cover"
                              />
                              {project.images.length > 1 && (
                                <>
                                  <button
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                                  >
                                    <FaChevronLeft size={12} />
                                  </button>
                                  <button
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                                  >
                                    <FaChevronRight size={12} />
                                  </button>
                                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                    {Array.from({ length: Math.min(project.images.length, 5) }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-white bg-opacity-70"
                                      />
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                          <div className="p-4">
                            <p className="text-sm text-gray-600 mb-1">
                              {portfolioProfile.portfolioName || portfolioProfile.architectId?.name}
                            </p>
                            <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                            <p className="text-sm text-gray-500 mb-3">
                              {project.budget && `Renovated for $${project.budget.toLocaleString()}`}
                              {project.timeframe && ` • ${project.timeframe}`}
                            </p>
                            {project.type && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-2 py-1 bg-gray-100 text-teal-600 text-xs rounded">
                                  {project.type}
                                </span>
                              </div>
                            )}
                            <button 
                              onClick={() => handleViewProject(actualIndex)}
                              className="w-full bg-teal-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-teal-600 transition-colors"
                            >
                              View Projects
                            </button>
                          </div>
                        </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeArchitectDetails;
