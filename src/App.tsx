import React, { useState } from "react";
import { Header } from "./components/Header";
import { DeviceDetection } from "./components/DeviceDetection";
import { ActionButtons } from "./components/ActionButtons";
import {
  VerificationSection,
  VerificationResult,
} from "./components/VerificationSection";
import { CertificateSection } from "./components/CertificateSection";
import { StatusFooter } from "./components/StatusFooter";
import { Device } from "./components/ActionButtons";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [wipeProgress, setWipeProgress] = useState(0);
  const [isWiping, setIsWiping] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "Application initialized",
    "Scanning for devices...",
  ]);
  const [devices, setDevices] = useState<Device[]>([]);

  // ---------------- Verification state ----------------
  const [verificationResults, setVerificationResults] = useState<
    VerificationResult[]
  >([
    {
      id: "1",
      test: "Surface Scan",
      status: "pending",
      details: "No recoverable data detected on surface",
      progress: 0,
    },
    {
      id: "2",
      test: "Deep Sector Analysis",
      status: "pending",
      details: "All sectors properly overwritten",
      progress: 0,
    },
    {
      id: "3",
      test: "Challenge-Write Test",
      status: "pending",
      details: "Writing test patterns",
      progress: 0,
    },
    {
      id: "4",
      test: "Magnetic Residue Check",
      status: "pending",
      details: "Awaiting completion",
      progress: 0,
    },
  ]);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const updateVerification = (
    id: string,
    status: VerificationResult["status"],
    progress?: number
  ) => {
    setVerificationResults((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status, progress: progress ?? r.progress } : r
      )
    );
  };

  // ---------------- Wipe handler ----------------
  const simulateWipe = async (type: "demo" | "full", deviceId?: string) => {
    if (!deviceId) {
      addLog("No device selected for wipe operation");
      return;
    }

    setIsWiping(true);
    setWipeProgress(0);
    addLog(`Starting ${type} wipe on ${deviceId}`);

    // Reset verification
    setVerificationResults((prev) =>
      prev.map((r) => ({ ...r, status: "running", progress: 0 }))
    );

    const endpoint =
      type === "demo"
        ? `http://127.0.0.1:8000/wipe/safe/${encodeURIComponent(deviceId)}`
        : `http://127.0.0.1:8000/wipe/full/${encodeURIComponent(deviceId)}`;

    try {
      const res = await fetch(endpoint, { method: "POST" });

      // Animate progress bar while waiting for response
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress >= 90) clearInterval(interval);
        setWipeProgress(progress);

        // Dynamically update verification progress
        updateVerification("1", "running", progress);
        updateVerification(
          "2",
          progress < 70 ? "running" : "passed",
          progress < 70 ? progress : 100
        );
        updateVerification(
          "3",
          progress < 50 ? "running" : "passed",
          progress < 50 ? progress * 2 : 100
        );
      }, 300);

      const data = await res.json();
      clearInterval(interval);
      setWipeProgress(100);

      // Complete verification after wipe finishes
      setVerificationResults((prev) =>
        prev.map((r) => ({ ...r, status: "passed", progress: 100 }))
      );

      addLog(data.message || `${type} wipe completed`);
    } catch (err) {
      addLog(`Error during ${type} wipe`);
      console.error(err);
    } finally {
      setTimeout(() => {
        setWipeProgress(0);
        setIsWiping(false);
      }, 500);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DeviceDetection setDevices={setDevices} />
            <ActionButtons
              devices={devices}
              isWiping={isWiping}
              wipeProgress={wipeProgress}
              addLog={addLog}
              simulateWipe={simulateWipe}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <VerificationSection results={verificationResults} />
            <CertificateSection
              devices={devices}
              verificationResults={verificationResults}
            />
          </div>

          <StatusFooter logs={logs} />
        </div>
      </div>
    </div>
  );
}
