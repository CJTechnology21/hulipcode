import { CalendarIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";

export default function CalendarButton({ leadsData, openModal }) {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const hasUpcoming = leadsData.some(lead => {
        if (!lead.reminder?.date || !lead.reminder?.time) return false;
        const reminderDateTime = new Date(`${lead.reminder.date} ${lead.reminder.time}`);
        return reminderDateTime > now;
      });
      setShowBadge(hasUpcoming);
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000); // check every min
    return () => clearInterval(interval);
  }, [leadsData]);

  return (
    <div className="relative cursor-pointer" onClick={openModal}>
      <CalendarIcon className="w-8 h-8 text-gray-700" />
      {showBadge && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          1
        </span>
      )}
    </div>
  );
}
