import React, { useState } from "react";
import { FileText, Download, Eye, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Device } from "./ActionButtons";
import { VerificationResult } from "./VerificationSection";

interface CertificateSectionProps {
  devices: Device[];
  verificationResults: VerificationResult[];
}

export function CertificateSection({
  devices,
  verificationResults,
}: CertificateSectionProps) {
  const [copied, setCopied] = useState(false);

  const certificateData = {
    certificate_id: `CERT-SW-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-001`,
    timestamp: new Date().toISOString(),
    operation_type: "Secure Wipe - DoD 5220.22-M Standard",
    devices: devices.map((d) => ({
      identifier: d.id,
      name: d.name,
      size_gb: d.size || "N/A",
      serial_number: d.id,
      wipe_method: "3-pass overwrite",
      verification_status:
        verificationResults.find((r) => r.id === d.id)?.status === "passed"
          ? "PASSED"
          : "FAILED",
    })),
    verification_tests: verificationResults.reduce((acc, r) => {
      acc[r.test] = r.status.toUpperCase();
      return acc;
    }, {} as Record<string, string>),
    compliance: {
      standard: "DoD 5220.22-M",
      nist_guidelines: "SP 800-88 Rev. 1",
      certification_level: "CONFIDENTIAL",
    },
    operator: "SecureWipe Pro Demo User",
    signature: "SHA256:a1b2c3d4e5f6...",
  };

  const jsonString = JSON.stringify(certificateData, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadPDF = () => {
    const element = document.createElement("a");
    const file = new Blob([`Certificate of Secure Wipe\n\n${jsonString}`], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `secure-wipe-certificate-${certificateData.certificate_id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadJSON = () => {
    const element = document.createElement("a");
    const file = new Blob([jsonString], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `secure-wipe-certificate-${certificateData.certificate_id}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-600" />
          Wipe Certificate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-orange-800 dark:text-orange-200">
              Certificate ID
            </h4>
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              {certificateData.certificate_id}
            </Badge>
          </div>
          <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
            Generated: {new Date(certificateData.timestamp).toLocaleString()}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-orange-600 dark:text-orange-400">
                Standard:
              </span>
              <p className="font-medium">
                {certificateData.compliance.standard}
              </p>
            </div>
            <div>
              <span className="text-orange-600 dark:text-orange-400">
                Level:
              </span>
              <p className="font-medium">
                {certificateData.compliance.certification_level}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Preview JSON Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Certificate Data (JSON)
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex-1"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy JSON
                      </>
                    )}
                  </Button>
                </div>
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {jsonString}
                  </pre>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={downloadJSON} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </Button>
            <Button
              onClick={downloadPDF}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="pt-3 border-t space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Devices Certified:</span>
            <span className="font-medium">
              {certificateData.devices.length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Verification Status:</span>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
              ALL PASSED
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
