import React, { useState, useEffect } from "react";
import {
  HardDrive,
  Smartphone,
  Usb,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface Device {
  id: string;
  name: string;
  type: "drive" | "android" | "usb" | "pc";
  size?: string;
  status: "ready" | "warning" | "error";
  details: string;
}

interface DevicesResponse {
  phones?: { serial: string; name: string }[];
  pc_name?: string;
  drives?: {
    device: string;
    mountpoint: string;
    fstype: string;
    name: string;
  }[];
}

interface DeviceDetectionProps {
  setDevices: (devices: Device[]) => void;
}

export function DeviceDetection({ setDevices }: DeviceDetectionProps) {
  const [devices, setLocalDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/devices");
        const data: DevicesResponse = await res.json();
        let deviceList: Device[] = [];

        // Android phones
        if (data.phones && data.phones.length > 0) {
          deviceList = data.phones.map((phone) => ({
            id: phone.serial,
            name: `Phone: ${phone.name}`,
            type: "android" as "android",
            status: "ready" as "ready",
            details: "Connected via USB debugging",
          }));
        }

        if (data.drives && data.drives.length > 0) {
          deviceList = [
            ...deviceList,
            ...data.drives.map((drive) => {
              const cleanId = drive.device.endsWith("\\")
                ? drive.device
                : drive.device + "\\";
              const isSystem = cleanId.startsWith("C:");
              return {
                id: cleanId,
                name: cleanId,
                type: "drive" as "drive",
                status: isSystem
                  ? ("warning" as "warning")
                  : ("ready" as "ready"),
                details: isSystem
                  ? "Contains system files - use with caution"
                  : "Safe for wiping",
                size: "N/A", // ← add this so TypeScript knows size exists
              };
            }),
          ];
        }

        if (data.pc_name) {
          deviceList.unshift({
            id: "pc_name",
            name: data.pc_name,
            type: "pc" as "pc",
            status: "ready" as "ready",
            details: "This is the current Windows PC",
          });
        }

        setLocalDevices(deviceList);
        setDevices(deviceList);
      } catch (err) {
        console.error("Error fetching devices:", err);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  // ---------------- Helper functions ----------------
  const getIcon = (type: string) => {
    switch (type) {
      case "drive":
        return <HardDrive className="w-5 h-5" />;
      case "android":
        return <Smartphone className="w-5 h-5" />;
      case "usb":
        return <Usb className="w-5 h-5" />;
      case "pc":
        return <HardDrive className="w-5 h-5 text-gray-600" />;
      default:
        return <HardDrive className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  // ---------------- JSX UI ----------------
  return (
    <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-blue-600" />
          Detected Devices
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  {getIcon(device.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{device.name}</h4>
                    {getStatusIcon(device.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {device.details}
                  </p>
                  <div className="flex items-center gap-2">
                    {device.size && (
                      <Badge variant="secondary" className="text-xs">
                        {device.size}
                      </Badge>
                    )}
                    <Badge
                      className={`text-xs ${getStatusColor(device.status)}`}
                    >
                      {device.status.charAt(0).toUpperCase() +
                        device.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-3 mt-4 border-t">
          <p className="text-sm text-muted-foreground text-center">
            Total: {devices.length} device{devices.length !== 1 ? "s" : ""}{" "}
            detected
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
