"use client"

import { getHistoryOrders, updateChefOrderStatus } from "@/firebase/Orders"
import { useEffect, useState } from "react"

type OrderStatus = "PREPARING" | "READY" | "COMPLETED"

interface Order {
  id: string
  table: string
  cart: string[]
  amount: number
  chefPay: number
  status: OrderStatus
}

export default function ChefOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(()=>{
    const fetchData = async () => {
      const data = await getHistoryOrders();
      setOrders(data as Order[]);
    };
    fetchData();
  },[]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    await updateChefOrderStatus(id,status);
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    )
  }

  const statusColor = (status: OrderStatus) => {
    if (status === "PREPARING") return "bg-yellow-100 text-yellow-700"
    if (status === "READY") return "bg-blue-100 text-blue-700"
    return "bg-emerald-100 text-emerald-700"
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black px-6 py-16">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 mb-10">
          <h1 className="text-3xl font-extrabold text-gray-800">
            My Accepted Orders
          </h1>
          <p className="text-gray-500 mt-1">
            Track and manage the orders you’ve accepted
          </p>
        </div>

        {/* ORDERS */}
        {orders.length === 0 ? (
          <div className="bg-white/95 rounded-3xl p-10 text-center text-gray-600">
            No orders accepted yet
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/95 backdrop-blur rounded-3xl shadow-xl p-6"
              >
                {/* TOP */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {order.table}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                      order.status
                    )}`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                {/* ITEMS */}
                <ul className="text-sm text-gray-700 mb-4 list-disc list-inside space-y-1">
                  {order.cart.map((item: any, index) => (
                    <li key={index}>{item.name} x {item.qty}</li>
                  ))}
                </ul>

                {/* INFO */}
                <div className="flex justify-between text-sm mb-4">
                  <p className="text-gray-600">
                    Order Amount: ₹{order.amount}
                  </p>
                  <p className="font-semibold text-emerald-600">
                    Your Pay: ₹{order.chefPay}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">
                  {order.status === "PREPARING" && (
                    <button
                      onClick={() => updateStatus(order.id, "READY")}
                      className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      Mark as Ready
                    </button>
                  )}

                  {order.status === "READY" && (
                    <button
                      onClick={() => updateStatus(order.id, "COMPLETED")}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
                    >
                      Complete Order
                    </button>
                  )}

                  {order.status === "COMPLETED" && (
                    <div className="flex-1 text-center py-2 rounded-xl bg-gray-100 text-gray-500 text-sm font-semibold">
                      Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
