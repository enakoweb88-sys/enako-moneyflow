import * as React from "react";
import { Button } from "./button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "destructive" | "secondary";
  requireReason?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  requireReason = false,
  reasonLabel = "Reason for this action (required):",
  reasonPlaceholder = "Please enter a clear explanation for audit tracking...",
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) {
      setError("A written explanation is required before confirming.");
      return;
    }
    onConfirm(reason.trim());
  };

  const buttonVariant =
    variant === "destructive"
      ? "danger"
      : variant === "secondary"
        ? "outline"
        : "default";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {description}
          </p>

          {requireReason && (
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                {reasonLabel}
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                rows={3}
                placeholder={reasonPlaceholder}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001f5b] focus:border-[#001f5b] text-slate-900 placeholder:text-slate-400"
              />
              {error && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  {error}
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setReason("");
                setError("");
                onCancel();
              }}
            >
              {cancelLabel}
            </Button>
            <Button variant={buttonVariant} size="sm" onClick={handleConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
