"use client"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Menu, X, LayoutDashboard, User, History, ClipboardList, MenuIcon, Banknote, Users,Scale, LogOut, Table, HandPlatter } from "lucide-react"
import { SITE_NAME } from "@/lib/constants"
import { Button } from "./ui/button"
import { logOutUser } from "@/firebase/Users"
import { userStore } from "@/store/UserInfoStore"
export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const {user} = userStore();
  const links = [
    { name: "Dashboard", href: "/u", icon: LayoutDashboard,role: ["ADMIN"] },
    { name: "Orders", href: "/u/orders", icon: ClipboardList,role: ["CHEF"] },
    { name: "Menu", href: "/u/menu", icon: MenuIcon,role: ["ADMIN","CHEF"] },
    { name: "Withdrawal Requests", href: "/u/payments", icon: Banknote,role: ["ADMIN"] },
    { name: "Users", href: "/u/users", icon: Users,role: ["ADMIN"] },
    { name: "Tables", href: "/u/tables", icon: HandPlatter,role: ["ADMIN"] },
    { name: "Balance", href: "/u/balance", icon: Scale, role: ["CHEF"] },
    { name: "history", href: "/u/history", icon: History, role: ["CHEF","ADMIN"] },
    { name: "Profile", href: "/u/profile", icon: User, role:["ADMIN","CHEF"] },
  ]?.filter(({role})=>{
    return role.includes(user?.role?.toUpperCase() || "USER");
  });
  const pathName = usePathname();
  const router = useRouter();
  return (
    <>
      {/* Hamburger Button (Mobile Only) */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-6 left-6 z-50 bg-emerald-600 text-white p-3 rounded-xl shadow-lg"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed! flex! flex-col justify-between items-start top-0 left-0 h-full w-72 text-white bg-background p-6 shadow-2xl transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:block`}
      >
        {/* Close Button (Mobile) */}
        <div className="flex justify-between items-center mb-10 md:hidden">
          <h2 className="text-xl font-bold">{SITE_NAME}</h2>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
          <div className="space-y-4 w-full">
        {/* Logo / Title (Desktop) */}
        <Link href={"/"}>
        <h2 className="hidden md:block text-2xl font-extrabold mb-12">
          {SITE_NAME}
        </h2>
        </Link>

        {/* Links */}
        <nav className="space-y-3 w-full">
          {links.map((link) => {
            const Icon = link.icon
            const active = pathName.endsWith(link.href)
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-emerald-600/20 ${active && "bg-emerald-600/20"} hover:text-emerald-400 transition`} 
              >
                <Icon size={20} />
                {link.name}
              </Link>
            )
          })}
        </nav>
        </div>
        <Button variant={"destructive"} onClick={async ()=>{await logOutUser();router.push("/");}} className="w-full text-lg py-5!"><LogOut /> Logout</Button>
      </aside>
    </>
  )
}