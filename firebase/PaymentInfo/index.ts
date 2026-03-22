import  {collection,getDoc,addDoc,setDoc, doc, getDocs, updateDoc} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userStore } from "@/store/UserInfoStore";
export async  function getPaymentInfo(){
    const id = userStore.getState().user?.id;
    if(id){
        const data = await getDoc(doc(db,"paymentinfo",id));
        if(!data.exists()){
            return {}
        }
        return {id: data.id,...data.data()};
    }
    return {};
}

export async  function getPaymentsInfo(){
    const data = await getDocs(collection(db,"paymentinfo"));
    return data.docs.map((paymentInfo)=>{
        return {id: paymentInfo.id, ...paymentInfo.data()}
    });
}

export async  function savePaymentInfo(data: any){
    const id = userStore.getState().user?.id;
    if(id){
        const paymentExists: any = await getPaymentInfo();
        if(Object.keys(paymentExists).length>0){
            await updateDoc(doc(db,"paymentinfo",id),data);
        }else{
            await setDoc(doc(db,"paymentinfo",id),data);
        }
    }
    return {};
}