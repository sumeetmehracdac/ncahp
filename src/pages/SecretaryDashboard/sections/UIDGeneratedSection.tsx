import { useState } from "react";
import { useSecretaryDashboardStore } from "../store/secretaryDashboardStore";
import { SectionContainer } from "../components/SectionContainer";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { ConfirmActionDialog } from "../components/ConfirmActionDialog";
import { toast } from "sonner";

export function UIDGeneratedSection() {
  const apps = useSecretaryDashboardStore((s) =>
    s.applications.filter((a) => a.bucket === "uid"),
  );
  const generateCertificate = useSecretaryDashboardStore((s) => s.generateCertificate);
  const [confirm, setConfirm] = useState<{ id: string; uid?: string } | null>(null);

  return (
    <>
      <SectionContainer
        apps={apps}
        showUID
        selectable={false}
        renderAction={(app) => (
          <Button
            size="sm"
            className="gap-1.5 bg-success text-success-foreground hover:bg-success/90"
            onClick={() => setConfirm({ id: app.applicationId, uid: app.uid })}
          >
            <Award className="h-3.5 w-3.5" />
            Generate Certificate
          </Button>
        )}
        emptyHint="No UIDs awaiting certificate generation."
      />
      <ConfirmActionDialog
        open={!!confirm}
        onOpenChange={(v) => !v && setConfirm(null)}
        title="Generate Registration Certificate"
        description={
          <span>
            Issue a registration certificate for application{" "}
            <strong>{confirm?.id}</strong>{" "}
            {confirm?.uid && (
              <>
                with UID <code className="rounded bg-muted px-1">{confirm.uid}</code>
              </>
            )}
            ?
          </span>
        }
        confirmLabel="Generate Certificate"
        confirmTone="success"
        onConfirm={() => {
          if (!confirm) return;
          generateCertificate(confirm.id);
          toast.success(`Certificate generated for ${confirm.id}`);
        }}
      />
    </>
  );
}
