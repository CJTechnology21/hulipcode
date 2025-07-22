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

function HomeArchitectDetails() {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };
  return (
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
            Archiect Namee — architect@gamil.com
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

            {/* Invite & Contact Buttons, moved slightly left */}
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
      {/* ✅ SEO content added below your layout */}
      <div className="px-10 py-4 text-black bg-white ml-14">
        <div className="flex items-center gap-6 text-yellow-500 font-semibold text-xl">
          {/* Rating */}
          <span className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={30} />
            ))}
            <span className="text-black ml-2 text-2xl">4.9</span>
          </span>

          {/* Messages Count */}
          <span className="flex items-center space-x-2 text-gray-400">
            <FaRegCommentDots className="text-gray-400" size={32} />
            <span className="text-black text-xl">7209</span>
          </span>

          {/* Price */}
          <span className="flex items-center space-x-2 text-black text-xl">
            <HiMiniCurrencyDollar className="text-green-600" size={32} />
            <span>10.0</span>
          </span>

          {/* Completion */}
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
            2000+ satisfied clients. Glowing Reviews! Elevate Your Business with
            Expertise in SEO ✌
          </p>

          <p className="font-medium text-base mt-4">
            I specialize in innovative solutions and seamless project execution
            across a wide range of construction disciplines.
          </p>
          <ul className="list-none mt-4 space-y-2">
            <li className="flex items-start">
              <FaStar className="text-yellow-500 mt-1 mr-2" />
              Why Elite Information Tech?
            </li>
            <li className="flex items-start">
              <FaStar className="text-yellow-500 mt-1 mr-2" />
              7000+ Freelancer.com Reviews (#1 in SEO, Internet Marketing
              Category | #Top 2 in all categories)
            </li>
            <li className="flex items-start">
              <FaStar className="text-yellow-500 mt-1 mr-2" />
              15+ Years of Professional Experience
            </li>
            <li className="flex items-start">
              <FaStar className="text-yellow-500 mt-1 mr-2" />
              2000+ Satisfied Clients
            </li>
            <li className="flex items-start">
              <FaStar className="text-yellow-500 mt-1 mr-2" />
              24x7 Customer Support
            </li>
            <li className="flex items-start">
              <FaStar className="text-yellow-500 mt-1 mr-2" />
              Assured Job Completion On Time & On Budget
            </li>
          </ul>
        </div>
        <div className="w-96 h-auto ml-[910px] -mt-[400px] rounded-md border border-black p-4 bg-white sticky ">
          {/* <div className=" w-96 h-auto ml-[910px] -mt-64 rounded-md border border-black p-4"> */}
          {/* Heading */}
          <h2 className="text-xl font-semibold mb-4">Verifications</h2>

          {/* Icon Row */}
          <div className="flex justify-between items-center text-green-600 text-xl mb-6 px-4">
            <FaUser />
            <FaEnvelope />
            <FaPhoneAlt />
            <SiGmail />
            <FaFacebookF />
          </div>

          {/* Stats Rows */}
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
          {/* end */}
        </div>
      </div>
    </div>
  );
}

export default HomeArchitectDetails;
