import React from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

export default function ReminderModal({
  reminderModalId,
  leadsData,
  reminderDate,
  setReminderDate,
  reminderTime,
  setReminderTime,
  handleReminderSave,
  onClose
}) {
  if (!reminderModalId) return null;

  const lead = leadsData.find((l) => l.id === reminderModalId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Set Reminder</h2>

        {/* Date Picker */}
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium">Date</label>
          <Input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
          />
        </div>

        {/* Time Picker */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Time</label>
          <Input
            type="time"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>

        {/* Existing Reminder Display */}
        <div className="text-xs text-gray-600 mb-4">
          {lead?.reminder?.date ? (
            <div className="bg-gray-100 p-2 rounded text-sm">
              Existing Reminder:{" "}
              <span className="font-medium text-black">
                {lead.reminder.date} at {lead.reminder.time}
              </span>
            </div>
          ) : (
            "No previous reminder."
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
          variant="custom"
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReminderSave}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
