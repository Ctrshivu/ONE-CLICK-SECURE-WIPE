import React from "react";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

export interface VerificationResult {
  id: string;
  test: string;
  status: "passed" | "failed" | "running" | "pending";
  details: string;
  progress?: number;
}

interface VerificationSectionProps {
  results: VerificationResult[];
}

export function VerificationSection({ results }: VerificationSectionProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "running":
        return (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        );
      case "pending":
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const passedTests = results.filter((r) => r.status === "passed").length;
  const totalTests = results.length;

  return (
    <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-600" />
            Verification Results
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {passedTests}/{totalTests} tests completed
          </span>
          <Progress
            value={(passedTests / totalTests) * 100}
            className="flex-1"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {results.map((result) => (
          <div
            key={result.id}
            className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <div>
                  <h4 className="font-medium">{result.test}</h4>
                  <p className="text-sm text-muted-foreground">
                    {result.details}
                  </p>
                </div>
              </div>
              <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
              </Badge>
            </div>

            {result.status === "running" && result.progress !== undefined && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{result.progress}%</span>
                </div>
                <Progress value={result.progress} className="h-2" />
              </div>
            )}
          </div>
        ))}

        <div className="pt-3 mt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Status:</span>
            <div className="flex items-center gap-2">
              {passedTests === totalTests ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 font-medium">
                    All Verified
                  </span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-blue-600 font-medium">In Progress</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
