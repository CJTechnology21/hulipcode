import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  FaStar,
  FaCommentDots,
  FaMoneyBillWave,
  FaHeart,
} from "react-icons/fa";
import { MdVerified, MdOutlineLocationOn } from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";
import { HiChartBar } from "react-icons/hi";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

function ArchitectCard({ architect }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full bg-white border rounded-xl shadow-sm p-4 md:p-6 flex flex-col md:flex-row items-start justify-between gap-4 hover:shadow-md transition">
        {/* Left: Image */}
        <div
          className="w-full md:w-[180px] h-[200px] md:h-[180px] flex-shrink-0 cursor-pointer"
          onClick={() => navigate(`/architectsdetails`)}
        >
          <img
            src={architect.image}
            alt={architect.name}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* Center: Info */}
        <div className="flex flex-col gap-3 flex-grow w-full">
          {/* Name + Username + Icons */}
          <div className="flex flex-wrap items-center gap-2 text-lg font-bold">
            <span>{architect.name}</span>
            <span className="text-gray-500 font-medium text-base">
              @{architect.username}
            </span>
            <MdVerified className="text-blue-500" title="Verified" />
            <GiCheckMark className="text-yellow-500" title="Preferred" />
            <HiChartBar className="text-gray-500" title="Top Rated" />
          </div>

          {/* Tagline */}
          <div className="text-md font-semibold text-gray-800">
            {architect.tagline}
          </div>

          {/* Bio */}
          <div className="text-sm text-gray-600 line-clamp-2">
            {architect.bio}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {architect.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-800"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-gray-700 text-sm mt-2">
            <span className="flex items-center gap-1">
              <FaStar className="text-pink-500" /> {architect.rating}
            </span>
            <span className="flex items-center gap-1">
              <FaCommentDots /> {architect.reviews}
            </span>
            <span className="flex items-center gap-1">
              <FaMoneyBillWave /> {architect.score}
            </span>
            <span className="flex items-center gap-1">
              🔵 {architect.successRate}%
            </span>
            <span className="flex items-center gap-1">
              <MdOutlineLocationOn />
              <img
                src={architect.flagUrl}
                alt={architect.location}
                className="w-5 h-4 object-cover inline-block"
              />
              {architect.location}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col justify-between items-end w-full md:w-[180px] h-full gap-4">
          <div className="text-right w-full md:text-right">
            <div className="text-xl font-bold">${architect.rate} USD</div>
            <div className="text-sm text-gray-500">per hour</div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Button
              className="w-full bg-[#ed914f] border border-[#b59d8b] hover:bg-[#e97f2e] text-white text-sm rounded-full py-2 font-medium shadow-sm transition"
              variant="custom"
            >
              Invite to Bid
            </Button>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full"
              onClick={() => setIsOpen(true)}
              variant="custom"
            >
              Contact
            </Button>
          </div>

          <FaHeart className="text-gray-400 hover:text-pink-500 cursor-pointer text-xl self-center md:self-end" />
        </div>
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-gray-900 mb-4"
                  >
                    {architect.name}'s Profile
                  </Dialog.Title>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <strong>Username:</strong> @{architect.username}
                    </div>
                    <div>
                      <strong>Location:</strong> {architect.location}
                    </div>
                    <div>
                      <strong>Experience:</strong> {architect.experience}
                    </div>
                    <div>
                      <strong>Charges:</strong> ${architect.rate}/hr
                    </div>
                    <div>
                      <strong>Rating:</strong> {architect.rating} ({architect.reviews} reviews)
                    </div>
                    <div className="col-span-full">
                      <strong>Skills:</strong> {architect.skills.join(", ")}
                    </div>
                    <div className="col-span-full">
                      <strong>Bio:</strong> {architect.bio}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                    variant="custom"
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-full py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default ArchitectCard;
