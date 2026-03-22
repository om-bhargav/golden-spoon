"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Loader from "./Loader";
import { userStore } from "@/store/UserInfoStore";
import { getUser } from "@/firebase/Users";
import { usePathname } from "next/navigation";
const AuthWrapper = ({ children }: React.PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const { loginUser, resetUser } = userStore();
  const router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setLoading(true);
        if (currentUser) {
          const info = await getUser(currentUser.uid) as any;
          loginUser(info as any);
        } else {
          resetUser();
          if(pathName.startsWith("/u")){
            router.push("/");
          }
        }
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  return loading ? <Loader /> : children;
};
export default AuthWrapper;
