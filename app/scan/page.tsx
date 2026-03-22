"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function ScanQRPage() {

  const qrRef = useRef<Html5Qrcode | null>(null);
  const scanningRef = useRef(false);
  const isScannerRunning = useRef(false);

  const [status, setStatus] = useState<"scanning" | "error">("scanning");
  const [message, setMessage] = useState("Initializing camera...");

  // ---------- CLEAR UI ----------
  const clearScannerUI = () => {
    const el = document.getElementById("qr-reader");
    if (el) el.innerHTML = "";
  };

  // ---------- SAFE STOP ----------
  const safeStopScanner = async () => {
    try {
      if (qrRef.current) {
        try {
          if (qrRef.current.getState() === 2) {
            await qrRef.current.stop();
          }
        } catch {}

        try {
          await qrRef.current.clear();
        } catch {}
      }

      isScannerRunning.current = false;
    } catch {}
  };

  // ---------- REDIRECT ----------
  const redirectTo = async (url: string) => {
    if (scanningRef.current) return;
    scanningRef.current = true;

    await safeStopScanner();
    // console.log(url);
    window.location.href = url;
  };

  // ---------- START CAMERA ----------
  const startScanner = async () => {
    try {
      if (isScannerRunning.current) return;

      clearScannerUI();

      const scanner = new Html5Qrcode("qr-reader");
      qrRef.current = scanner;

      setMessage("Requesting camera permission...");

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },

        // ✅ SUCCESS
        (decodedText) => {
          redirectTo(decodedText);
        },

        // ❌ IGNORE NOISE
        () => {}
      );

      isScannerRunning.current = true;

      setStatus("scanning");
      setMessage("Scanning QR code...");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Camera access denied or not available.");
    }
  };

  // ---------- IMAGE UPLOAD ----------
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await safeStopScanner();
      clearScannerUI();

      const scanner = new Html5Qrcode("qr-reader");
      qrRef.current = scanner;

      setMessage("Reading QR from image...");

      const decodedText = await scanner.scanFile(file, false);

      redirectTo(decodedText);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Unable to read QR. Try clearer image.");
    }
  };

  // ---------- INIT ----------
  useEffect(() => {
    startScanner();

    return () => {
      safeStopScanner();
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Scan Table QR</h1>

        <p
          className={`mb-6 ${
            status === "error" ? "text-red-500" : "text-gray-600"
          }`}
        >
          {message}
        </p>

        {/* QR SCANNER */}
        <div
          id="qr-reader"
          className="w-full max-h-[280px] border rounded-xl overflow-hidden mb-6"
        />

        {/* FALLBACK */}
        <p className="text-sm text-gray-500 mb-3">Camera not working?</p>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-3 file:px-4
            file:rounded-xl file:border-0
            file:bg-orange-500 file:text-white
            hover:file:bg-orange-600"
        />
      </div>
    </main>
  );
}
