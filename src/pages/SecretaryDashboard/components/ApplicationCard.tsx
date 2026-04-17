import { Application } from "../types";
import { FormTypeBadge } from "./FormTypeBadge";
import { StatusBadge } from "./StatusBadge";
import { format, formatDistanceToNow } from "date-fns";
import { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Briefcase, Calendar, Hash, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  app: Application;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  selectable?: boolean;
  renderAction: (app: Application) => ReactNode;
}

export function ApplicationCard({
  app,
  selected,
  onToggleSelect,
  selectable = true,
  renderAction,
}: Props) {
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        selected ? "border-primary ring-2 ring-primary/20" : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {selectable && (
            <Checkbox
              checked={selected}
              onCheckedChange={() => onToggleSelect?.(app.applicationId)}
            />
          )}
          <span className="font-mono text-sm font-bold text-primary">{app.applicationId}</span>
        </div>
        <StatusBadge bucket={app.bucket} />
      </div>

      <div>
        <div className="text-base font-semibold leading-tight">{app.applicantName}</div>
        <div className="mt-1">
          <FormTypeBadge code={app.formCode} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground">
        {app.profession && (
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {app.profession}
          </span>
        )}
        {app.district && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {app.district}
          </span>
        )}
        <span className="inline-flex items-center gap-1 col-span-2">
          <Calendar className="h-3 w-3" />
          {format(new Date(app.submittedAt), "d MMM yyyy")} ·{" "}
          {formatDistanceToNow(new Date(app.submittedAt), { addSuffix: true })}
        </span>
        {app.uid && (
          <span className="col-span-2 inline-flex items-center gap-1 font-mono text-orange-700">
            <Hash className="h-3 w-3" /> {app.uid}
          </span>
        )}
        {app.certificateNo && (
          <span className="col-span-2 inline-flex items-center gap-1 font-mono text-emerald-700">
            <Award className="h-3 w-3" /> {app.certificateNo}
          </span>
        )}
      </div>

      <div className="mt-1 flex justify-end border-t border-border pt-3">
        {renderAction(app)}
      </div>
    </div>
  );
}
