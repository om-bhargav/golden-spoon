import { collection, addDoc, setDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userStore } from "@/store/UserInfoStore";

export async function getMenuItems(){
    const restrauntId = userStore.getState().user?.restraunt_id;
    if(restrauntId){
    
    }
    return [];
}

export async function createMenu(){
    
}

export async function createMenuItem(){

}

export async function deleteMenu(){

}

export async function deleteMenuItem(){

}