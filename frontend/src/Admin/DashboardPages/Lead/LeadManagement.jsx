import { useState } from "react";

import Header from "../../components/Header";
import {
  FaAddressCard,
  FaClipboardList,
  FaLightbulb,
  FaFileAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar";

function Leads() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const leadModules = [
    {
      title: "Basic Details",
      subtitle: "Manage contact details etc.",
      icon: <FaAddressCard className="text-3xl" />,
      path: "/leads/leaddetails",
    },
    {
      title: "Quotations & Site Details",
      subtitle: "Generate BoQs and Capture Site Details",
      icon: <FaClipboardList className="text-3xl" />,
      path: "/quote",
    },
    {
      title: "Inspirations",
      subtitle: "View Images Liked by Client",
      icon: <FaLightbulb className="text-3xl" />,
      path: "/leads/inspirations",
    },
    {
      title: "Designs & Documents",
      subtitle: "Store All Your Artefacts",
      icon: <FaFileAlt className="text-3xl" />,
      path: "/leads/documents",
    },
    {
      title: "Financial Planning",
      subtitle: "Manage your cashflow",
      icon: <FaMoneyBillWave className="text-3xl" />,
      path: "/project/finance",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <SideBar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Lead Data"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-6 space-y-6">
          {/* Top Info (optional buttons can go here) */}
          <div className="flex items-center justify-end flex-wrap gap-4">
            {/* Example button (optional) */}
            {/* <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm shadow">Export</button> */}
          </div>

          {/* Lead Module Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {leadModules.map((mod, idx) => (
              <div
                key={idx}
                onClick={() => navigate(mod.path)}
                className="cursor-pointer bg-white border border-blue-200 hover:shadow-md transition-all rounded-xl p-5 flex flex-col items-center text-center hover:border-blue-400"
              >
                <div className="text-blue-500 mb-3">{mod.icon}</div>
                <h3 className="font-semibold text-gray-800">{mod.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{mod.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leads;
