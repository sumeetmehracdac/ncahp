import { useSecretaryDashboardStore } from "../store/secretaryDashboardStore";
import { SectionContainer } from "../components/SectionContainer";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";

export function CertificatesSection() {
  const apps = useSecretaryDashboardStore((s) =>
    s.applications.filter((a) => a.bucket === "certificate"),
  );

  return (
    <SectionContainer
      apps={apps}
      selectable={false}
      showUID
      showCertificate
      renderAction={(app) => (
        <div className="flex justify-end gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => toast.info(`Opening certificate ${app.certificateNo}`)}
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => toast.success(`Downloading ${app.certificateNo}.pdf`)}
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </Button>
        </div>
      )}
      emptyHint="No certificates issued yet."
    />
  );
}
