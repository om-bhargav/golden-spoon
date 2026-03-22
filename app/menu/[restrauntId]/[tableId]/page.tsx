"use client";

import { getMenuById } from "@/firebase/Menus";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { bookOrder, getOrdersForTable } from "@/firebase/Orders";
interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

interface CartItem extends MenuItem {
  qty: number;
}

export default function CustomerMenuPage() {
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway">("dine-in");
  const [paymentMode, setPaymentMode] = useState<"cash" | "upi">("upi");
  const [menu, setMenu] = useState<MenuSection[]>([]);
  const { restrauntId, tableId } = useParams();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getMenuById(restrauntId as string);
      setMenu(data as MenuSection[]);
    };
    if (restrauntId) {
      fetchData();
    }
  }, [restrauntId, tableId]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const fetchData = async () => {
    const orders = await getOrdersForTable(
      tableId as string,
      restrauntId as string
    );
    setOrders(orders as any);
  };
  const placeOrder = async () => {
    if (!cart.length) {
      alert("Please add items to cart");
      return;
    }
    await bookOrder(
      cart,
      tableId as string,
      restrauntId as string,
      totalAmount,
      orderType 
    );
    fetchData();
    alert(
      `Order Confirmed\nOrder Type: ${orderType}\nPayment: ${paymentMode.toUpperCase()}\nTotal: ₹${totalAmount}`
    );
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white px-6 py-16">
      <div className="max-w-7xl mx-auto flex gap-10">
        {/* MENU */}
        <div className="flex-1 w-full">
          <div className="lg:col-span-2 space-y-10">
            <h1 className="text-3xl font-extrabold">Menu</h1>

            {menu.map((section) => (
              <div
                key={section.id}
                className="bg-white/10 backdrop-blur rounded-3xl p-6 border border-white/10"
              >
                <h2 className="text-2xl font-bold mb-6">{section.title}</h2>

                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-black/40 p-4 rounded-xl"
                    >
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-400 text-sm">₹{item.price}</p>
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        className="bg-orange-500 px-4 py-2 rounded-xl font-semibold hover:bg-orange-600 transition"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* TABLE ORDERS */}
          <div className="mt-8 bg-white/10 backdrop-blur rounded-3xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

            {orders.length === 0 ? (
              <p className="text-gray-400 text-center">No orders placed yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="bg-black/40 p-4 rounded-xl">
                    {/* STATUS */}
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        Order ID: {order.id.slice(0, 6)}
                      </span>

                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          order.status === "PREPARING"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : order.status === "READY"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* ITEMS */}
                    <div className="space-y-1 text-sm">
                      {order.cart.map((item: any) => (
                        <div key={item.id} className="flex justify-between">
                          <span>
                            {item.name} × {item.qty}
                          </span>
                          <span>₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>

                    {/* TOTAL */}
                    <div className="flex justify-between mt-3 font-semibold text-sm border-t border-white/10 pt-2">
                      <span>Total</span>
                      <span>₹{order.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CART */}
        <div className="min-w-md bg-white/10 backdrop-blur rounded-3xl p-6 border border-white/10 h-fit sticky top-20">
          <h2 className="text-2xl font-bold mb-4">Orders For this table</h2>

          {/* ORDER TYPE */}
          <div className="flex gap-3 mb-6">
            {["dine-in", "takeaway"].map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type as any)}
                className={`flex-1 py-2 rounded-xl font-semibold transition ${
                  orderType === type
                    ? "bg-orange-500"
                    : "bg-black/40 border border-white/20"
                }`}
              >
                {type === "dine-in" ? "Dine In" : "Takeaway"}
              </button>
            ))}
          </div>

          {/* CART ITEMS */}
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center">No items added yet</p>
          ) : (
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      ₹{item.price} × {item.qty}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="px-3 py-1 bg-black/40 rounded"
                    >
                      −
                    </button>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-1 bg-black/40 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TOTAL */}
          <div className="border-t border-white/10 pt-4 mb-6">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          {/* PAYMENT OPTIONS */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Payment Method</h3>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMode === "cash"}
                  onChange={() => setPaymentMode("cash")}
                  className="accent-orange-500"
                />
                Cash
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMode === "upi"}
                  onChange={() => setPaymentMode("upi")}
                  className="accent-orange-500"
                />
                UPI
              </label>
            </div>
          </div>

          {/* UPI QR */}
          {paymentMode === "upi" && (
            <div className="text-center mb-6">
              <p className="text-gray-300 mb-2">Scan QR to Pay</p>
              <img
                src="/upi-qr.png"
                alt="UPI QR"
                className="mx-auto w-30 h-30 rounded-xl border border-white/20"
              />
            </div>
          )}

          {/* PLACE ORDER BUTTON */}
          <button
            onClick={placeOrder}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              paymentMode === "upi"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {paymentMode === "upi" ? "Pay via UPI" : "Place Cash Order"}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Secure payment • No extra charges
          </p>
        </div>
      </div>
    </main>
  );
}
