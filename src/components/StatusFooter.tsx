import React, { useState } from "react";
import { Terminal, HelpCircle, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Info } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Badge } from "./ui/badge";

interface StatusFooterProps {
  logs: string[];
}

export function StatusFooter({ logs }: StatusFooterProps) {
  const [logsExpanded, setLogsExpanded] = useState(false);
  const [helpExpanded, setHelpExpanded] = useState(false);

  const helpContent = [
    {
      title: "Safe Demo Mode",
      description:
        "Simulates the wipe process without actually modifying any data. Perfect for testing and demonstrations.",
    },
    {
      title: "Full Wipe",
      description:
        "Permanently destroys all data using DoD 5220.22-M standard. Requires confirmation by typing 'WIPE OK'.",
    },
    {
      title: "Verification",
      description:
        "Performs multiple tests to ensure data has been completely and securely erased.",
    },
    {
      title: "Certificates",
      description:
        "Generates compliance certificates in JSON and PDF formats for audit purposes.",
    },
    {
      title: "Dark Mode",
      description:
        "Toggle between light and dark themes using the moon/sun icon in the header.",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Status Logs */}
      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
        <Collapsible open={logsExpanded} onOpenChange={setLogsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-green-600" />
                  Status Logs
                  <Badge variant="secondary" className="text-xs">
                    {logs.length} entries
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  {logsExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <ScrollArea className="h-32 w-full rounded-md border bg-slate-50 dark:bg-slate-900 p-3">
                <div className="space-y-1 font-mono text-xs">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="text-slate-700 dark:text-slate-300"
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                <span>Auto-scroll enabled</span>
                <span>Real-time updates</span>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Help Information */}
      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
        <Collapsible open={helpExpanded} onOpenChange={setHelpExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  Help & Information
                </div>
                <Button variant="ghost" size="sm">
                  {helpExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpContent.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                  >
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>SecureWipe Pro v2.1.0</span>
                  <span>
                    Demo Environment - No actual data will be modified
                  </span>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Copyright Footer */}
      <div className="text-center text-xs text-muted-foreground pt-2">
        © 2025 SecureWipe Pro. Team:{" "}
        <span className="font-bold">Lazy Debuggers</span>. All rights reserved.
        <div className="mt-2 text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <Info className="w-4 h-4" />
          <span>
            Author: <span className="font-bold">Sanjay Kumar Sutar</span>
          </span>
        </div>
      </div>
    </div>
  );
}
