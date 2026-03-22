"use client";

import { getAnalytics } from "@/firebase/Admin";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRestraunts: 0,
    revenue: 0,
    activeTables: 0,
    pendingOrders: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      const analysis = await getAnalytics();
      setStats(analysis as any);
    };
    fetchData();
  });

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto space-y-8">
        {/* HEADER */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Welcome back 👋 Here’s what’s happening today.
          </p>
        </div>

        {/* METRICS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Orders" value={stats.totalOrders} />
          <StatCard title="Total Restraunts" value={stats.totalRestraunts} />
          <StatCard title="Revenue" value={stats.revenue} />
          <StatCard title="Active Tables" value={stats.activeTables} />
        </div>

        {/* SECOND SECTION */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* RECENT ORDERS */}
          <div className="lg:col-span-2 bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Recent Orders
            </h2>

            <div className="space-y-4">
              <OrderItem
                table="Table 5"
                items="2x Pasta, 1x Coke"
                status="Preparing"
              />
              <OrderItem
                table="Table 2"
                items="1x Pizza, 2x Juice"
                status="Served"
              />
              <OrderItem table="Table 8" items="3x Burger" status="Pending" />
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Quick Actions
            </h2>

            <div className="flex flex-col gap-4">
              <button className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition">
                Add New Menu Item
              </button>

              <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
                View All Orders
              </button>

              <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
                Manage Tables
              </button>
            </div>

            {/* Pending Orders Highlight */}
            <div className="mt-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-emerald-600">
                {stats.pendingOrders}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

function OrderItem({
  table,
  items,
  status,
}: {
  table: string;
  items: string;
  status: string;
}) {
  const statusColor =
    status === "Served"
      ? "text-green-600"
      : status === "Preparing"
      ? "text-amber-600"
      : "text-red-500";

  return (
    <div className="flex justify-between items-center p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition">
      <div>
        <p className="font-semibold text-gray-800">{table}</p>
        <p className="text-sm text-gray-500">{items}</p>
      </div>
      <span className={`font-semibold ${statusColor}`}>{status}</span>
    </div>
  );
}
