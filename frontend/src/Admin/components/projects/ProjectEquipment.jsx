import React, { useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { BsCalendar3 } from "react-icons/bs";
import SearchBar from "../../../components/SearchBar"; 
import Button from "../../../components/Button"; 

const days = [
  { date: 27, label: "Sun" },
  { date: 28, label: "Mon" },
  { date: 29, label: "Tue" },
];

export default function ProjectEquipment() {
  const [selectedDate, setSelectedDate] = useState(27);

  return (
    <div className="bg-gray-100 min-h-screen py-6 w-full">
      <div className="w-full px-6 2xl:px-32">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-6">
          <div className="w-full max-w-sm">
            <SearchBar placeholder="Search Equipment" />
          </div>
          <Button
            color="blue"
            size="sm"
            variant="custom"
            className="ml-4 bg-red-600 text-white hover:bg-red-700"
          >
            Add Equipment +
          </Button>
        </div>

        {/* Date Picker Row */}
        <div className="flex items-center gap-4 mb-10">
          <button className="p-2 rounded hover:bg-gray-200">
            <MdKeyboardArrowLeft size={24} />
          </button>

          <div className="flex gap-2 bg-white rounded-lg px-2 py-1 shadow-sm">
            {days.map((day) => (
              <div
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`px-3 py-2 rounded cursor-pointer text-center ${
                  selectedDate === day.date
                    ? "bg-black text-white"
                    : "text-black"
                }`}
              >
                <div className="text-sm font-medium">{day.date}</div>
                <div className="text-xs">{day.label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 border bg-white px-3 py-2 rounded-md shadow-sm">
            <BsCalendar3 className="text-gray-600" />
            <span className="text-sm font-medium">Jul</span>
          </div>

          <button className="p-2 rounded hover:bg-gray-200">
            <MdKeyboardArrowRight size={24} />
          </button>
        </div>

        {/* No Equipment Message (Left aligned) */}
        <div className="mt-16">
          <h2 className="text-lg font-semibold mb-2">No Equipment list</h2>
          <p className="text-sm text-gray-500 mb-4">
            Create a equipment list so you can start tracking equipments
          </p>
          <Button
            color="blue"
            size="md"
            className="bg-red-600 text-white hover:bg-red-700"
          >
            New Equipment +
          </Button>
        </div>
      </div>
    </div>
  );
}
