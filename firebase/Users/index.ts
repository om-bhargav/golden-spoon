import { User } from "@/types/User";
import { collection, addDoc, setDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "@/lib/firebase";
import { auth,secondaryAuth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { userStore } from "@/store/UserInfoStore";
function generatePassword(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}
export async function createUser(user: User,role: string="CHEF",type: string="default") {
  const { email, password, ...restData } = user;
  const  date = Date.now();
  const newUser = await createUserWithEmailAndPassword(type==="default" ? auth:secondaryAuth, email, password );
  const data: any = { ...restData, email,role:role.toUpperCase(),createdAt: date,balance: 0 };
  if(userStore.getState().user?.restraunt_id){
      data["restraunt_id"] = userStore.getState().user?.restraunt_id;
  }
  await setDoc(doc(db, "users", newUser.user.uid), data);
  if(type!=="default"){
    await signOut(secondaryAuth);
  }
  return newUser.user.uid;
}

export async function updateUser(user: User,userId: string) {
  const docRef = doc(db,"users",userId);
  await updateDoc(docRef,user as any);
  return userId;
}

export async function signInUser(email: string, password: string) {
  const user = await signInWithEmailAndPassword(auth, email, password);
  return user.user.uid;
}

export async function getUser(id: string) {
  const data = await getDoc(doc(db, "users", id));
  return { id: data.id, ...data.data() };
}

export async function logOutUser(){
  await signOut(auth);
}

export async function getUsers(restrauntId: string){
  const users = await getDocs(collection(db,"users"));
  return users.docs.map((user)=>{
    return {id:user.id,...user.data()}
  })
}