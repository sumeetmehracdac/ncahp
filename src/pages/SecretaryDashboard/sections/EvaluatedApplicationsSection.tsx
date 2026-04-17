import { useState } from "react";
import { Application } from "../types";
import { useSecretaryDashboardStore } from "../store/secretaryDashboardStore";
import { SectionContainer } from "../components/SectionContainer";
import { Button } from "@/components/ui/button";
import { Send, Mail, CheckCircle2, XCircle } from "lucide-react";
import { ConfirmActionDialog } from "../components/ConfirmActionDialog";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function EvaluatedApplicationsSection() {
  const recommended = useSecretaryDashboardStore((s) =>
    s.applications.filter((a) => a.bucket === "evaluated_recommended"),
  );
  const notRecommended = useSecretaryDashboardStore((s) =>
    s.applications.filter((a) => a.bucket === "evaluated_not_recommended"),
  );
  const moveTo = useSecretaryDashboardStore((s) => s.moveTo);

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
      <Accordion
        type="multiple"
        defaultValue={["rec", "not"]}
        className="space-y-3"
      >
        {/* Recommended */}
        <AccordionItem
          value="rec"
          className="overflow-hidden rounded-xl border-0 ring-1 ring-emerald-200 bg-card"
        >
          <AccordionTrigger className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 px-5 py-3 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-emerald-900">Recommended</div>
                  <div className="text-xs text-emerald-700">
                    Forward to Secretary, NCAHP for final approval
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white">
                {recommended.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
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
          </AccordionContent>
        </AccordionItem>

        {/* Not Recommended */}
        <AccordionItem
          value="not"
          className="overflow-hidden rounded-xl border-0 ring-1 ring-rose-200 bg-card"
        >
          <AccordionTrigger className="bg-gradient-to-r from-rose-50 to-rose-100/50 px-5 py-3 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 text-white">
                  <XCircle className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-rose-900">Not Recommended</div>
                  <div className="text-xs text-rose-700">
                    Issue rejection letter with documented reason
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-xs font-bold text-white">
                {notRecommended.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>

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
