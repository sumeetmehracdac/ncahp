import { useState } from "react";
import { Application } from "../types";
import { useSecretaryDashboardStore } from "../store/secretaryDashboardStore";
import { SectionContainer } from "../components/SectionContainer";
import { Button } from "@/components/ui/button";
import { Send, Mail, CheckCircle2, XCircle } from "lucide-react";
import { ConfirmActionDialog } from "../components/ConfirmActionDialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function EvaluatedApplicationsSection() {
  const recommended = useSecretaryDashboardStore((s) =>
    s.applications.filter((a) => a.bucket === "evaluated_recommended"),
  );
  const notRecommended = useSecretaryDashboardStore((s) =>
    s.applications.filter((a) => a.bucket === "evaluated_not_recommended"),
  );
  const moveTo = useSecretaryDashboardStore((s) => s.moveTo);

  const [activeTab, setActiveTab] = useState<"recommended" | "not_recommended">("recommended");

  const [forwardConfirm, setForwardConfirm] = useState<{ ids: string[]; label: string } | null>(
    null,
  );
  const [rejectConfirm, setRejectConfirm] = useState<{ ids: string[]; label: string } | null>(
    null,
  );

  const handleForward = () => {
    if (!forwardConfirm) return;
    moveTo(forwardConfirm.ids, "forwarded", { forwardedAt: new Date().toISOString() });
    toast.success(
      `${forwardConfirm.ids.length} application${forwardConfirm.ids.length > 1 ? "s" : ""} forwarded to Secretary, NCAHP`,
    );
  };

  const handleReject = () => {
    if (!rejectConfirm) return;
    // simulate sending letter; remove from pool by leaving them as not_recommended (no UI impact)
    toast.success(`Rejection letter sent for ${rejectConfirm.label}`, {
      description: "The applicant has been notified via registered email.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Toggle Tabs */}
      <div className="rounded-xl border border-border bg-card p-1.5 shadow-sm">
        <nav className="relative flex items-center gap-1">
          <button
            onClick={() => setActiveTab("recommended")}
            className={cn(
              "relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              activeTab === "recommended"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Recommended</span>
            <span
              className={cn(
                "ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                activeTab === "recommended"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-foreground",
              )}
            >
              {recommended.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("not_recommended")}
            className={cn(
              "relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              activeTab === "not_recommended"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <XCircle className="h-4 w-4" />
            <span>Not Recommended</span>
            <span
              className={cn(
                "ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                activeTab === "not_recommended"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-foreground",
              )}
            >
              {notRecommended.length}
            </span>
          </button>
        </nav>
      </div>

      {activeTab === "recommended" ? (
        <div className="rounded-xl border border-emerald-100 bg-card p-4 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-emerald-900">Recommended for Approval</h3>
            <p className="text-xs text-emerald-700">Forward these to the Secretary, NCAHP, for final UID and Certificate generation.</p>
          </div>
          <SectionContainer
            apps={recommended}
            renderAction={(app: Application) => (
              <Button
                size="sm"
                className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() =>
                  setForwardConfirm({ ids: [app.applicationId], label: app.applicationId })
                }
              >
                <Send className="h-3.5 w-3.5" />
                Forward to Secretary NCAHP
              </Button>
            )}
            bulkBar={(ids) => (
              <Button
                size="sm"
                className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setForwardConfirm({ ids, label: `${ids.length} applications` })}
              >
                <Send className="h-3.5 w-3.5" />
                Forward Selected
              </Button>
            )}
            emptyHint="No recommended applications."
          />
        </div>
      ) : (
        <div className="rounded-xl border border-rose-100 bg-card p-4 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-rose-900">Not Recommended (Rejected)</h3>
            <p className="text-xs text-rose-700">Issue official rejection letters with documented reasons to the applicants.</p>
          </div>
          <SectionContainer
            apps={notRecommended}
            renderAction={(app: Application) => (
              <Button
                size="sm"
                variant="destructive"
                className="gap-1.5"
                onClick={() =>
                  setRejectConfirm({ ids: [app.applicationId], label: app.applicationId })
                }
              >
                <Mail className="h-3.5 w-3.5" />
                Send Rejection Letter
              </Button>
            )}
            bulkBar={(ids) => (
              <Button
                size="sm"
                variant="destructive"
                className="gap-1.5"
                onClick={() => setRejectConfirm({ ids, label: `${ids.length} applications` })}
              >
                <Mail className="h-3.5 w-3.5" />
                Send Rejection (Selected)
              </Button>
            )}
            emptyHint="No rejected evaluations."
          />
        </div>
      )}

      <ConfirmActionDialog
        open={!!forwardConfirm}
        onOpenChange={(v) => !v && setForwardConfirm(null)}
        title="Forward to Secretary, NCAHP"
        description={
          <span>
            Forward <strong>{forwardConfirm?.label}</strong> to the Secretary, NCAHP for final
            approval and UID generation.
          </span>
        }
        confirmLabel="Forward to NCAHP"
        confirmTone="accent"
        onConfirm={handleForward}
      />
      <ConfirmActionDialog
        open={!!rejectConfirm}
        onOpenChange={(v) => !v && setRejectConfirm(null)}
        title="Send Rejection Letter"
        description={
          <span>
            A formal rejection letter will be issued for <strong>{rejectConfirm?.label}</strong>.
            The applicant will be notified by registered email.
          </span>
        }
        confirmLabel="Send Letter"
        confirmTone="danger"
        onConfirm={handleReject}
      />
    </div>
  );
}
