import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Application } from "../types";
import { FormTypeBadge } from "./FormTypeBadge";
import { StatusBadge } from "./StatusBadge";
import { format, formatDistanceToNow } from "date-fns";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  apps: Application[];
  selected: string[];
  onToggleSelect?: (id: string) => void;
  onToggleAll?: (checked: boolean) => void;
  selectable?: boolean;
  showStatus?: boolean;
  showUID?: boolean;
  showCertificate?: boolean;
  showForwardedAt?: boolean;
  renderAction: (app: Application) => ReactNode;
}

export function ApplicationTable({
  apps,
  selected,
  onToggleSelect,
  onToggleAll,
  selectable = true,
  showStatus = false,
  showUID = false,
  showCertificate = false,
  showForwardedAt = false,
  renderAction,
}: Props) {
  const allChecked = apps.length > 0 && apps.every((a) => selected.includes(a.applicationId));
  const someChecked = !allChecked && apps.some((a) => selected.includes(a.applicationId));

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {selectable && (
              <TableHead className="w-10">
                <Checkbox
                  checked={allChecked ? true : someChecked ? "indeterminate" : false}
                  onCheckedChange={(v) => onToggleAll?.(!!v)}
                  aria-label="Select all"
                />
              </TableHead>
            )}
            <TableHead className="w-[140px]">Application ID</TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Form / Category</TableHead>
            {showUID && <TableHead className="w-[200px]">UID</TableHead>}
            {showCertificate && <TableHead className="w-[200px]">Certificate</TableHead>}
            {showStatus && <TableHead className="w-[160px]">Status</TableHead>}
            <TableHead className="w-[140px]">
              {showForwardedAt ? "Forwarded" : showCertificate ? "Issued" : "Submitted"}
            </TableHead>
            <TableHead className="w-[280px] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((app) => {
            const isSelected = selected.includes(app.applicationId);
            const dateValue = showForwardedAt
              ? app.forwardedAt
              : showCertificate
                ? app.certificateIssuedAt
                : app.submittedAt;
            return (
              <TableRow
                key={app.applicationId}
                className={cn(
                  "group relative border-l-4 border-l-transparent transition-all",
                  isSelected && "bg-primary/5 border-l-primary",
                  "hover:border-l-accent hover:bg-muted/30",
                )}
              >
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelect?.(app.applicationId)}
                    />
                  </TableCell>
                )}
                <TableCell className="font-mono text-sm font-semibold text-primary">
                  {app.applicationId}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{app.applicantName}</div>
                  <div className="text-xs text-muted-foreground">
                    {app.profession} · {app.district}
                  </div>
                </TableCell>
                <TableCell>
                  <FormTypeBadge code={app.formCode} />
                </TableCell>
                {showUID && (
                  <TableCell>
                    {app.uid ? (
                      <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 font-mono text-xs font-semibold text-orange-800 ring-1 ring-inset ring-orange-200">
                        {app.uid}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                )}
                {showCertificate && (
                  <TableCell>
                    {app.certificateNo ? (
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 font-mono text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200">
                        {app.certificateNo}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                )}
                {showStatus && (
                  <TableCell>
                    <StatusBadge bucket={app.bucket} />
                  </TableCell>
                )}
                <TableCell>
                  {dateValue ? (
                    <div className="text-xs">
                      <div className="font-medium">
                        {format(new Date(dateValue), "d MMM yyyy")}
                      </div>
                      <div className="text-muted-foreground">
                        {formatDistanceToNow(new Date(dateValue), { addSuffix: true })}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">{renderAction(app)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
