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

function TotalExpenses() {
  const data = {
    labels: ["Vendors", "Staff", "Subcontracts", "Other Petty"],
    datasets: [
      {
        label: "Expenses",
        data: [12, 2, 16, 4],
        backgroundColor: ["#d4cc6a", "#b3d765", "#69b3d7", "#8731b7"],
      },
    ],
  };

  const options = { responsive: true, plugins: { legend: { display: false } } };

  return (
    <DashboardCard title="Total Expenses">
      <Bar data={data} options={options} />
    </DashboardCard>
  );
}

export default TotalExpenses;
