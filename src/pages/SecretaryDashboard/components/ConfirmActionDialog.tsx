import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  confirmTone?: "primary" | "danger" | "accent" | "success";
  onConfirm: () => void;
}

const TONE: Record<NonNullable<Props["confirmTone"]>, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  accent: "bg-accent text-accent-foreground hover:bg-accent/90",
  success: "bg-success text-success-foreground hover:bg-success/90",
};

export function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  confirmTone = "primary",
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription asChild>
            <div className="text-sm text-muted-foreground">{description}</div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <button
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors ${TONE[confirmTone]}`}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
