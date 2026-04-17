import { ApplicationBucket } from "../types";
import { cn } from "@/lib/utils";
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Send,
  Hash,
  Award,
} from "lucide-react";

const MAP: Record<
  ApplicationBucket,
  { label: string; cls: string; Icon: typeof Inbox }
> = {
  new: { label: "New", cls: "bg-teal-50 text-teal-700 ring-teal-200", Icon: Inbox },
  evaluated_recommended: {
    label: "Recommended",
    cls: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Icon: CheckCircle2,
  },
  evaluated_not_recommended: {
    label: "Not Recommended",
    cls: "bg-rose-50 text-rose-700 ring-rose-200",
    Icon: XCircle,
  },
  forwarded: {
    label: "Forwarded to NCAHP",
    cls: "bg-orange-50 text-orange-700 ring-orange-200",
    Icon: Send,
  },
  uid: { label: "UID Generated", cls: "bg-indigo-50 text-indigo-700 ring-indigo-200", Icon: Hash },
  certificate: {
    label: "Certified",
    cls: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    Icon: Award,
  },
};

export function StatusBadge({ bucket }: { bucket: ApplicationBucket }) {
  const { label, cls, Icon } = MAP[bucket];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
        cls,
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
