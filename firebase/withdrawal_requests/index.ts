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
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userStore } from "@/store/UserInfoStore";
import { ERROR_MESSAGE, getRandomString } from "@/lib/constants";
const WITHDRAWAL_REQUESTS = "withdrawal_requests";
const MINIMUM_LIMIT = 100;
export async function makeRequest() {
  try {
    const userId = userStore.getState().user?.id;
    const restrauntId = userStore.getState().user?.restraunt_id;
    if(userId){
        const docRef = doc(db,"users",userId);
        const userInfo = await getDoc(docRef);
        if(userInfo.exists()){
            const userInfoData = userInfo.data();
            const balance = parseInt(userInfoData.balance);
            if(balance < MINIMUM_LIMIT){
                throw Error(`Least Amount to be make withdraw request is ${MINIMUM_LIMIT}`);
            }
            await addDoc(collection(db,WITHDRAWAL_REQUESTS),{
                user_id: userId,
                restraunt_id: restrauntId,
                amount: balance,
                status: "PENDING"
            });      
            return true;      
        }
    } 
    return false;
  } catch(error: any) {
    throw Error(error.message || ERROR_MESSAGE);
  }
}

export async function updatePaymentRequestStatus(request_id: string,status: "APPROVED" | "REJECTED") {
  try {
    const docRef = doc(db,WITHDRAWAL_REQUESTS,request_id);
    await updateDoc(docRef,{status: status});
    const docData: any = (await getDoc(docRef)).data();
    await updateDoc(doc(db,"users",docData.user_id),{balance: 0});
    return true;
  } catch {
    throw Error(ERROR_MESSAGE);
  }
}

export async function getRequests() {
  try {
    const restrauntId = userStore.getState().user?.restraunt_id;
    if(restrauntId){
        const requests = await getDocs(collection(db,WITHDRAWAL_REQUESTS));
        const fullRequests = await Promise.all(requests.docs.map(async (request)=>{
            const data: any = { id: request.id,...request.data()} ;
            const userId = data.user_id;
            const paymentInfo = (await getDoc(doc(db,"paymentinfo",userId))).data();
            const userDetails =  (await getDoc(doc(db,"users",userId))).data();
            return {...data,bankDetails: paymentInfo,userDetails};
        }))
        return fullRequests.filter((request: any)=>{
            return request.restraunt_id === restrauntId && request.status==="PENDING";
        });
    }
    return null;
  } catch {
    throw Error(ERROR_MESSAGE);
  }
}
