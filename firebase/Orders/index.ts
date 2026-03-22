import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  deleteDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userStore } from "@/store/UserInfoStore";
import { ERROR_MESSAGE, getRandomString } from "@/lib/constants";
const ORDERS = "orders";
const PAY_PER_ORDER = 15;
export async function getChefOrders() {
  try {
    const restrauntId = userStore.getState().user?.restraunt_id;
    if (restrauntId) {
      const collectionRef = collection(db, ORDERS);
      const orders = await getDocs(collectionRef);
      const updatedOrders = await Promise.all(
        orders.docs.map(async (order: any) => {
          const result = { id: order.id, ...order.data() };
          const tableInfo = await getDoc(doc(db, "tables", result.tableId));
          if (tableInfo.exists()) {
            const tableData = tableInfo.data();
            return { ...result, table: tableData.name };
          }
          return null;
        })
      );
      // return updatedOrders;
      return updatedOrders.filter((order: any) => {
        return (
          order &&
          order.restrauntId === restrauntId &&
          order.status === "PENDING"
        );
      });
    }
  } catch (error: any) {
    throw Error(error.message);
  }
}

export async function updateChefOrderStatus(orderId: string, status: string) {
  try {
    const userId = userStore.getState().user?.id;
    if (!userId) return false;
    const userDocRef = doc(db, "users", userId);
    const docRef = doc(db, ORDERS, orderId);
    await updateDoc(docRef, {
      status: status,
      assignedTo: userId,
    });
    const orderInfo: any = (await getDoc(docRef)).data();
    const amount = (PAY_PER_ORDER / 100) * orderInfo.amount;
    if (status === "PREPARING") {
      await updateDoc(userDocRef, {
        balance: increment(amount),
      });
    }
    return true;
  } catch (error: any) {
    throw Error(ERROR_MESSAGE);
  }
}

export async function bookOrder(
  cart: any,
  tableId: string,
  restrauntId: string,
  totalAmount: number,
  orderType: "dine-in" | "takeaway"
) {
  try {
    await addDoc(collection(db, ORDERS), {
      cart,
      tableId,
      restrauntId,
      status: "PENDING",
      amount: totalAmount,
      assignedTo: null,
      orderType
    });
    return true;
  } catch (error: any) {
    throw Error(ERROR_MESSAGE);
  }
}

export async function getOrdersForTable(tableId: string, restrauntId: string) {
  try {
    const collectionRef = collection(db, ORDERS);
    const orders = await getDocs(collectionRef);
    return orders.docs
      .map((order) => {
        return { id: order.id, ...order.data() };
      })
      .filter((order: any) => {
        return (order.restrauntId === restrauntId && order.tableId === tableId && order.status!=="COMPLETED");
      });
  } catch (error: any) {
    throw Error(ERROR_MESSAGE);
  }
}

export async function getHistoryOrders() {
  try {
    const userId = userStore.getState().user?.id;
    if (userId) {
      const collectionRef = collection(db, ORDERS);
      const orders = await getDocs(collectionRef);
      return orders.docs
        .map((order: any) => {
          const result = { id: order.id, ...order.data() };
          const amount = (PAY_PER_ORDER / 100) * parseInt(result.amount);
          return { ...result, chefPay: amount };
        })
        .filter((order: any) => {
          return (
            (order.assignedTo === userId && order.status === "PREPARING") ||
            order.status === "READY" ||
            order.status === "COMPLETED"
          );
        });
    }
    return null;
  } catch (error: any) {
    throw Error(ERROR_MESSAGE);
  }
}
