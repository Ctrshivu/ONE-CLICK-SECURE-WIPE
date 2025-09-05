import React, { useState } from "react";
import { Play, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";

export interface Device {
  id: string;
  name: string;
  type: "drive" | "android" | "usb" | "pc";
  size?: string; // ← added optional size
  status?: "ready" | "warning" | "error"; // optional to match DeviceDetection
  details?: string; // optional for consistency
}
interface ActionButtonsProps {
  devices: Device[];
  isWiping: boolean;
  wipeProgress: number;
  addLog: (message: string) => void;
  simulateWipe: (type: "demo" | "full", deviceId?: string) => void;
}

export function ActionButtons({
  devices,
  isWiping,
  wipeProgress,
  addLog,
  simulateWipe,
}: ActionButtonsProps) {
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [confirmationText, setConfirmationText] = useState("");
  const [showFullWipeDialog, setShowFullWipeDialog] = useState(false);

  const handleDemoWipe = () => {
    simulateWipe("demo", selectedDevice);
  };

  const handleFullWipe = () => {
    if (!selectedDevice) {
      addLog("Select a device before running destructive wipe");
      return;
    }
    if (confirmationText === "WIPE OK") {
      simulateWipe("full", selectedDevice);
      setShowFullWipeDialog(false);
      setConfirmationText("");
    } else {
      addLog("Type 'WIPE OK' to confirm destructive wipe");
    }
  };

  const selectableDevices = devices.filter((d) => d.type !== "pc");

  return (
    <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-green-600" />
          Wipe Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Selector */}
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <select
            className="p-2 border rounded-md flex-1"
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            <option value="" disabled>
              Select Drive
            </option>
            {selectableDevices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Safe Wipe */}
        <div className="space-y-2">
          <Button
            onClick={handleDemoWipe}
            disabled={isWiping}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            Safe Wipe
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Deletes temporary files only
          </p>
        </div>

        {/* Full Destructive Wipe */}
        <div className="space-y-2">
          <Dialog
            open={showFullWipeDialog}
            onOpenChange={setShowFullWipeDialog}
          >
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isWiping || !selectedDevice}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all"
                size="lg"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Full Destructive Wipe
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Confirm Destructive Operation
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    This will permanently destroy ALL files on the selected
                    drive. This action cannot be undone.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="confirmation">
                    Type "WIPE OK" to confirm:
                  </Label>
                  <Input
                    id="confirmation"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Type WIPE OK here"
                    className="font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowFullWipeDialog(false);
                      setConfirmationText("");
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleFullWipe}
                    disabled={confirmationText !== "WIPE OK"}
                    className="flex-1"
                  >
                    Confirm Wipe
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <p className="text-xs text-muted-foreground text-center">
            Permanently destroys all data - requires confirmation
          </p>
        </div>

        {/* Progress Bar */}
        {isWiping && <Progress value={wipeProgress} className="w-full" />}

        {/* Verify Wipe */}
        <div className="space-y-2">
          <Button
            onClick={() =>
              selectedDevice
                ? addLog(`Verification for ${selectedDevice} triggered`)
                : addLog("Select device first for verification")
            }
            disabled={isWiping || !selectedDevice}
            variant="outline"
            className="w-full border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900"
            size="lg"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Verify Wipe Completion
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Confirms all files have been securely deleted
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
