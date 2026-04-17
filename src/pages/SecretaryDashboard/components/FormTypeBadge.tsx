import { FORM_META, FormCode } from "../types";
import { cn } from "@/lib/utils";

const PALETTE: Record<FormCode, string> = {
  "1A": "bg-teal-50 text-teal-800 ring-teal-200",
  "1B": "bg-blue-50 text-blue-800 ring-blue-200",
  "1C": "bg-indigo-50 text-indigo-800 ring-indigo-200",
  "2A": "bg-amber-50 text-amber-800 ring-amber-200",
  "3A": "bg-orange-50 text-orange-800 ring-orange-200",
  "3B": "bg-rose-50 text-rose-800 ring-rose-200",
  "3C": "bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-200",
  "4A": "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

interface Props {
  code: FormCode;
  showDescription?: boolean;
  className?: string;
}

export function FormTypeBadge({ code, showDescription, className }: Props) {
  const meta = FORM_META[code];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
        PALETTE[code],
        className,
      )}
      title={`${meta.formLabel} · ${meta.category} — ${meta.description}`}
    >
      <span className="font-bold tracking-tight">{meta.formLabel}</span>
      <span className="opacity-60">·</span>
      <span className="font-medium">{meta.category.replace(" Registration", "")}</span>
      {showDescription && (
        <span className="ml-1 hidden font-normal opacity-75 md:inline">
          — {meta.description}
        </span>
      )}
    </span>
  );
}
