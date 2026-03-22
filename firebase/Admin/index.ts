import {
  collection,
  getDocs
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ERROR_MESSAGE } from "@/lib/constants";

export async function getAnalytics() {
  try {
    const orders = await getDocs(collection(db, "orders"));
    const tables = await getDocs(collection(db, "tables"));
    const restraunts = await getDocs(collection(db, "restraunts"));
    return {
      totalOrders: orders.size,
      totalRestraunts: restraunts.size,
      revenue: orders.docs
        .map((order) => {
          const orderData = order.data();
          return orderData.amount;
        })
        .reduce((acc, value) => acc + value),
      activeTables: tables.size,
      pendingOrders: orders.docs.filter((order) => {
        const orderData = order.data();
        return orderData.status === "PENDING";
      }).length,
    };
    return {};
  } catch (error: any) {
    throw Error(ERROR_MESSAGE);
  }
}