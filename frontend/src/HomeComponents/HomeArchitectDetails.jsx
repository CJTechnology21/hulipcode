import React, { useState } from "react";
import Button from "../components/Button";
import {
  FaBackward,
  FaShare,
  FaRegHeart,
  FaStar,
  FaRegCommentDots,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebookF,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { LuOrigami } from "react-icons/lu";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { HiMiniCurrencyDollar } from "react-icons/hi2";
import { TbCircleDashed } from "react-icons/tb";
import { SiGmail } from "react-icons/si";

const portfolioProjects = [
  {
    title: "Modern Villa",
    image:
      "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=",
  },
  {
    title: "Urban Design",
    image:
      "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=",
  },
  {
    title: "Interior Concept",
    image:
      "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=",
  },
  {
    title: "Landscape",
    image:
      "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=",
  },
  {
    title: "Eco Building",
    image:
      "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=",
  },
  {
    title: "Luxury Tower",
    image:
      "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=",
  },
  {
    title: "Office Space",
    image:
      "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=",
  },
  {
    title: "Boutique Hotel",
    image:
      "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=",
  },
  {
    title: "Green Campus",
    image:
      "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=",
  },
  {
    title: "Museum Concept",
    image:
      "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=",
  },
  {
    title: "Eco Villa",
    image:
      "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=",
  },
  {
    title: "Contemporary Loft",
    image:
      "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=",
  },
];

function HomeArchitectDetails() {
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleToggle = () => setExpanded(!expanded);
  const [showAll, setShowAll] = useState(false);

  const showMoreProjects = () => {
    if (showAll) {
      setVisibleCount(6);
      setShowAll(false);
    } else {
      setVisibleCount(portfolioProjects.length);
      setShowAll(true);
    }
  };

  const openModal = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setModalOpen(false);
  };
  return (
    <div className="w-full">
      {/* Top Banner */}
      <div className="w-full bg-black text-white h-64 mt-0">
        <Button className="ml-6 mb-4">
          <FaBackward />
        </Button>
        <div className="w-40 h-40 bg-blue-300 rounded-md ml-20 mt-36">
          <img
            className="object-fit h-40 w-40 rounded-md"
            src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            alt=""
          />
        </div>
        <div className="mt-6 ml-20">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold font-mono text-red-400 whitespace-nowrap">
              Architect Name — architect@gmail.com
            </h2>
            <div className="flex items-center space-x-3 ml-6">
              <Button color="blue" size="lg" variant="icon">
                <MdVerified size={28} />
              </Button>
              <Button color="gold" size="lg" variant="icon">
                <LuOrigami size={28} />
              </Button>
              <Button color="black" size="lg" variant="icon">
                <HiOutlineDotsHorizontal size={28} />
              </Button>
              <Button color="red" size="lg" variant="icon">
                <FaRegHeart size={28} />
              </Button>
              <Button color="green" size="lg" variant="icon">
                <FaShare size={28} />
              </Button>
              <div className="ml-2 flex space-x-3">
                <Button color="pink" size="lg" className="px-6 py-2 rounded-md">
                  Invite to Bid
                </Button>
                <Button
                  variant="filled"
                  color="pink"
                  size="lg"
                  className="px-6 py-2 rounded-md bg-pink-700 text-white hover:bg-pink-800"
                >
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white text-black px-10 py-4 flex justify-between mt-36 ml-6">
        {/* Left Side */}
        <div className="ml-4 mr-8 max-w-[60%]">
          <div className="flex items-center gap-6 text-yellow-500 font-semibold text-xl">
            <span className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={30} />
              ))}
              <span className="text-black ml-2 text-2xl">4.9</span>
            </span>
            <span className="flex items-center space-x-2 text-gray-400">
              <FaRegCommentDots size={32} />
              <span className="text-black text-xl">7209</span>
            </span>
            <span className="flex items-center space-x-2 text-black text-xl">
              <HiMiniCurrencyDollar className="text-green-600" size={32} />
              <span>10.0</span>
            </span>
            <span className="flex items-center space-x-2 text-black text-xl">
              <TbCircleDashed className="text-blue-700" size={32} />
              <span>100%</span>
            </span>
          </div>

          <div className="mt-6">
            <h2 className="font-bold text-2xl">
              Project Manager, Civil Architect
            </h2>
            <p className="font-semibold text-lg flex items-center space-x-2 mt-4">
              <span>7000+</span>
              <FaStar className="text-yellow-500" />
              <span>Reviews</span>
            </p>
            <p className="font-semibold text-lg mt-4">
              2000+ satisfied clients. Glowing Reviews! Elevate Your Business
              with Expertise in SEO ✌
            </p>
            <p className="font-medium text-base mt-4">
              I specialize in innovative solutions and seamless project
              execution across a wide range of construction disciplines.
            </p>
            <div className="mt-4">
              <p
                className={`font-medium text-base transition-all duration-300 ${
                  expanded ? "" : "line-clamp-3"
                }`}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga ad
                reprehenderit dolores delectus dolorem sequi distinctio magni
                suscipit ratione illum, magnam quas deserunt enim earum...
              </p>
              <button
                onClick={handleToggle}
                className="text-blue-600 hover:underline mt-2 text-sm"
              >
                {expanded ? "Show Less" : "Read More...."}
              </button>
            </div>
            <ul className="list-none mt-4 space-y-2">
              {[
                "Why Elite Information Tech?",
                "7000+ Freelancer.com Reviews (#1 in SEO, Internet Marketing)",
                "15+ Years of Professional Experience",
                "2000+ Satisfied Clients",
                "24x7 Customer Support",
                "Assured Job Completion On Time & On Budget",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <FaStar className="text-yellow-500 mt-1 mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side Verifications */}
        <div className="w-96 h-64 rounded-md border border-black p-4 bg-white shadow-md mt-10 mr-24">
          <h2 className="text-xl font-semibold mb-4">Verifications</h2>
          <div className="flex justify-between items-center text-green-600 text-xl mb-6 px-4">
            <FaUser />
            <FaEnvelope />
            <FaPhoneAlt />
            <SiGmail />
            <FaFacebookF />
          </div>
          <div className="space-y-3 px-2 text-gray-700">
            <div className="flex justify-between">
              <span>On Time</span>
              <span>98%</span>
            </div>
            <div className="flex justify-between">
              <span>On Budget</span>
              <span>95%</span>
            </div>
            <div className="flex justify-between">
              <span>Accept Rate</span>
              <span>93%</span>
            </div>
            <div className="flex justify-between">
              <span>Repeat Hire Rate</span>
              <span>88%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="w-full px-10 py-8 mt-6">
        <h2 className="text-2xl font-bold mb-6">Portfolio</h2>
        <div className="grid grid-cols-3 gap-10 max-w-[1400px] mx-auto">
          {portfolioProjects.slice(0, visibleCount).map((project, i) => (
            <div
              key={i}
              onClick={() => openModal(project)}
              className="relative group overflow-hidden rounded-xl shadow-md h-[250px] cursor-pointer"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2 text-lg font-semibold opacity-0 group-hover:opacity-100 transition">
                {project.title}
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}

        {portfolioProjects.length > 6 && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={showMoreProjects}
              variant="custom"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {showAll ? "Show Less" : "Show More"}
            </Button>
          </div>
        )}
      </div>
      {modalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full relative flex gap-6">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-red-600 text-xl"
              onClick={closeModal}
            >
              ✕
            </button>

            {/* Left: Image */}
            <div className="w-1/2">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Right: Content */}
            <div className="w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">
                {selectedProject.title}
              </h2>
              <p className="text-gray-700 mb-4">
                This is a detailed view of{" "}
                <strong>{selectedProject.title}</strong>. You can add a full
                project description, timeline, team members, design philosophy,
                or anything else you want to showcase here.
              </p>
              <div className="mt-auto">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeArchitectDetails;
