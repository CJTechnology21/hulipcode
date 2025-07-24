import React from "react";
import BarGraph from "../components/ArchitechDashboard/BarGraph";
import ExpensePieChart from "../components/ArchitechDashboard/ExpenseChart";
import Activitytable from "../components/ArchitechDashboard/Activitytable";
import ArchitectExpense from "../components/ArchitechDashboard/ArchitectExpense";
import TopOwners from "../components/MainDhasboard/TopOwners";
import Layout from "../components/Layout";

export default function ArchitectDashboard() {
  return (
    <Layout title="Architect Dashbaord">
      <main className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex flex-col gap-6 flex-[2]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BarGraph />
              <ExpensePieChart />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="order-1 md:order-none">
                <Activitytable />
              </div>
              <div className="order-2 md:order-none">
                <ArchitectExpense />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[320px]">
            <TopOwners />
          </div>
        </div>
      </main>
    </Layout>
  );
}
