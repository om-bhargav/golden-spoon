"use client";

import { getChefOrders, updateChefOrderStatus } from "@/firebase/Orders";
import { useEffect, useState } from "react";

type OrderStatus = "PENDING";

interface Order {
  id: string;
  table: string;
  cart: string[];
  amount: number;
  status: OrderStatus;
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getChefOrders();
      setOrders((data! ?? []) as Order[]);
    };
    fetchData();
  },[]);

  // ✅ ACCEPT ORDER
  const acceptOrder = async (id: string) => {
    await updateChefOrderStatus(id,"PREPARING");
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black px-6 py-14">
      <div className="max-w-6xl mx-auto">
        {/* ORDERS */}
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/95 backdrop-blur rounded-3xl shadow-xl p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* ORDER INFO */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {order.id} • {order.table}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Items:
                    {order?.cart?.map((item: any) => {
                      return <span key={item.id} className="text-gray-500 mt-1">{item.name} x {item.qty}</span>;
                    })}
                  </p>

                  <p className="mt-2 font-semibold text-gray-700">
                    Bill Amount: ₹{order.amount}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4">
                  {order.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => acceptOrder(order.id)}
                        className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                      >
                        Accept
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-center text-gray-400">No orders available</p>
          )}
        </div>
      </div>
    </main>
  );
}
