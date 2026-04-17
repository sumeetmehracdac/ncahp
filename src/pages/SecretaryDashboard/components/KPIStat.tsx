import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number;
  Icon: LucideIcon;
  accentClass: string; // tailwind classes for left accent + icon bg
  active?: boolean;
  onClick?: () => void;
  hint?: string;
}

export function KPIStat({ label, value, Icon, accentClass, active, onClick, hint }: Props) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.9, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative flex min-w-0 flex-1 items-center gap-4 overflow-hidden rounded-xl border bg-card/95 p-4 text-left shadow-sm backdrop-blur transition-all",
        "hover:shadow-md",
        active ? "border-primary/40 ring-2 ring-primary/20" : "border-border",
      )}
    >
      <span className={cn("absolute left-0 top-0 h-full w-1", accentClass)} />
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
          accentClass,
          "bg-opacity-15",
        )}
      >
        <Icon className="h-5 w-5 text-white drop-shadow" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <motion.div className="text-2xl font-bold leading-tight text-foreground">
          {rounded}
        </motion.div>
        {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
      </div>
    </motion.button>
  );
}
