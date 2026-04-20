import { useSecretaryDashboardStore } from "../store/secretaryDashboardStore";
import { SectionContainer } from "../components/SectionContainer";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "sonner";

export function ForwardedSection() {
  const apps = useSecretaryDashboardStore((s) =>
    s.applications.filter((a) => a.bucket === "forwarded"),
  );

  return (
    <SectionContainer
      apps={apps}
      selectable={false}
      hideActionBar={true}
      showForwardedAt
      renderAction={(app) => (
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() =>
            toast.info(`Acknowledgement for ${app.applicationId}`, {
              description: "Received by NCAHP HQ. Awaiting review.",
            })
          }
        >
          <FileText className="h-3.5 w-3.5" />
          View Acknowledgement
        </Button>
      )}
      emptyHint="No proposals currently forwarded to NCAHP."
    />
  );
}
