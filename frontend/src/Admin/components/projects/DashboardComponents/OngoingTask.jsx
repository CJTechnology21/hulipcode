import React from "react";
import DashboardCard from "./DashboardCard";

function OngoingTaskStatus() {
  const tasks = [
    { id: "Plumbing Work", location: "Washroom 2", assigned: "Rajesh Sharma", progress: 25 },
    { id: "Electrical Work", location: "Washroom 2", assigned: "Rajesh Sharma", progress: 25 },
    { id: "Plumbing Work", location: "Washroom 2", assigned: "Rajesh Sharma", progress: 25 },
    { id: "Plumbing Work", location: "Washroom 2", assigned: "Rajesh Sharma", progress: 25 },
  ];

  return (
    <DashboardCard title="Ongoing Task Status">
      <table className="w-full text-left">
        <thead>
          <tr className="text-sm text-gray-600">
            <th className="pb-2">Task ID</th>
            <th>Assigned</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, idx) => (
            <tr key={idx} className="border-b border-gray-200">
              <td className="py-2">
                <span className="font-bold">{task.id}</span>
                <br />
                <span className="text-red-600 text-sm">{task.location}</span>
              </td>
              <td>{task.assigned}</td>
              <td>
                <div className="w-20 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-2"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
                <span className="text-red-600 text-xs">{task.progress}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardCard>
  );
}

export default OngoingTaskStatus;
