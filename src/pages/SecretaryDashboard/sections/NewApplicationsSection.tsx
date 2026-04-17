import { useState } from "react";
import { Application } from "../types";
import { useSecretaryDashboardStore } from "../store/secretaryDashboardStore";
import { SectionContainer } from "../components/SectionContainer";
import { Button } from "@/components/ui/button";
import { Forward } from "lucide-react";
import { ConfirmActionDialog } from "../components/ConfirmActionDialog";
import { toast } from "sonner";

export function NewApplicationsSection() {
  const apps = useSecretaryDashboardStore((s) =>
    s.applications.filter((a) => a.bucket === "new"),
  );
  const moveTo = useSecretaryDashboardStore((s) => s.moveTo);
  const [confirm, setConfirm] = useState<{ ids: string[]; label: string } | null>(null);

  const handleConfirm = () => {
    if (!confirm) return;
    // Forwarded to Coordinating Officer → in this mock they become evaluated next
    // We'll randomly split them: 70% recommended, 30% not, to populate Evaluated tab
    confirm.ids.forEach((id) => {
      const bucket = Math.random() > 0.3 ? "evaluated_recommended" : "evaluated_not_recommended";
      moveTo([id], bucket);
    });
    toast.success(
      `${confirm.ids.length} application${confirm.ids.length > 1 ? "s" : ""} forwarded to Coordinating Officer`,
      { description: "They will appear under Evaluated once reviewed." },
    );
  };

  const renderAction = (app: Application) => (
    <Button
      size="sm"
      className="gap-1.5"
      onClick={() => setConfirm({ ids: [app.applicationId], label: app.applicationId })}
    >
      <Forward className="h-3.5 w-3.5" />
      Forward to Coordinating Officer
    </Button>
  );

  return (
    <>
      <SectionContainer
        apps={apps}
        renderAction={renderAction}
        bulkBar={(ids) => (
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setConfirm({ ids, label: `${ids.length} applications` })}
          >
            <Forward className="h-3.5 w-3.5" />
            Forward Selected to CO
          </Button>
        )}
        emptyHint="No new applications awaiting forward."
      />
      <ConfirmActionDialog
        open={!!confirm}
        onOpenChange={(v) => !v && setConfirm(null)}
        title="Forward to Coordinating Officer"
        description={
          <span>
            You are about to forward <strong>{confirm?.label}</strong> to the Coordinating
            Officer for evaluation. This action cannot be undone.
          </span>
        }
        confirmLabel="Forward"
        confirmTone="primary"
        onConfirm={handleConfirm}
      />
    </>
  );
}
