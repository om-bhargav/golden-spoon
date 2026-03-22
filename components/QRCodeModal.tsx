"use client"

import QRCode from "react-qr-code"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QrCode } from "lucide-react"
import { Button } from "./ui/button"

export default function QRModal({link}:{link: string}) {
  return (
    <Dialog>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button size={"lg"} className="bg-emerald-600 hover:bg-emerald-700 px-3 py-2 font-semibold text-white">
          <QrCode/> QR Code
        </Button>
      </DialogTrigger>

      {/* Modal Content */}
      <DialogContent className="sm:max-w-md bg-slate-900 border border-white/10 text-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Scan to Pay
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <div className="bg-white p-4 rounded-xl">
            <QRCode
              size={200}
              value={link}
              viewBox="0 0 256 256"
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}