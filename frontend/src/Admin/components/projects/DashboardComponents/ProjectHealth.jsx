import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DashboardCard from "./DashboardCard";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProjectHealth() {
  const data = {
    labels: ["Project Value", "Total Received", "Total Expense", "Final BOQ"],
    datasets: [
      {
        label: "Values",
        data: [8, 12, 16, 20],
        backgroundColor: ["#d4cc6a", "#b3d765", "#69b3d7", "#8731b7"],
      },
    ],
  };

  const options = { responsive: true, plugins: { legend: { display: false } } };

  return (
    <DashboardCard title="Project Health">
      <Bar data={data} options={options} />
    </DashboardCard>
  );
}

export default ProjectHealth;
