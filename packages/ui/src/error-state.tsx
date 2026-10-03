import * as React from "react";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "An unexpected error occurred",
  message = "We encountered an error loading this data. Please verify your connection or try again.",
  onRetry,
}) => {
  return (
    <div className="p-6 bg-white rounded-xl border border-rose-200 text-center">
      <div className="text-sm font-bold text-rose-800 uppercase tracking-wider">
        {title}
      </div>
      <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
};
