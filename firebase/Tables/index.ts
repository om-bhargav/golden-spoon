import type {RestaurantTable} from "@/types/RestrauntTable";
import { collection, addDoc, setDoc, doc, getDoc, updateDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userStore } from "@/store/UserInfoStore";
export async function getTables(){
    const id = userStore.getState().user?.restraunt_id;
    if(id){
        const tableData = await getDocs(collection(db,"tables"));
        return tableData.docs.map((table)=>{
            return {id: table.id,...table.data()}
        }).filter((table: any)=>{
            return table.restraunt_id === id
        })
    }
    return [];
}

export async function createTable(data: any){
    const id = userStore.getState().user?.restraunt_id;
    if(id){
        const createdDocRef = await addDoc(collection(db,"tables"),{...data,restraunt_id: id});
        const createdTable = await getDoc(doc(db,"tables",createdDocRef.id));
        return {id: createdTable.id, ...createdTable.data()}
    }
    return {};
}


export async function deleteTable(id: string){
    await deleteDoc(doc(db,"tables",id));
}