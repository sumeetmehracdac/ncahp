import { Inbox, CheckCircle2, Send, Hash, Award } from "lucide-react";
import { KPIStat } from "./KPIStat";
import { TabKey } from "../types-ui";

interface Props {
  counts: Record<TabKey, number>;
  active: TabKey;
  onSelect: (k: TabKey) => void;
}

export function KPIStrip({ counts, active, onSelect }: Props) {
  return (
    <div className="flex justify-center">
      {active === "new" && (
        <KPIStat
          label="New Applications"
          value={counts.new}
          Icon={Inbox}
          accentClass="bg-teal-600"
          active={true}
          onClick={() => onSelect("new")}
          hint="Awaiting forward to CO"
        />
      )}
      {active === "evaluated" && (
        <KPIStat
          label="Evaluated"
          value={counts.evaluated}
          Icon={CheckCircle2}
          accentClass="bg-emerald-600"
          active={true}
          onClick={() => onSelect("evaluated")}
          hint="Recommended / Rejected"
        />
      )}
      {active === "forwarded" && (
        <KPIStat
          label="Forwarded to NCAHP"
          value={counts.forwarded}
          Icon={Send}
          accentClass="bg-orange-500"
          active={true}
          onClick={() => onSelect("forwarded")}
          hint="Pending NCAHP review"
        />
      )}
      {active === "uid" && (
        <KPIStat
          label="UID Generated"
          value={counts.uid}
          Icon={Hash}
          accentClass="bg-indigo-600"
          active={true}
          onClick={() => onSelect("uid")}
          hint="Ready for certificate"
        />
      )}
      {active === "certificate" && (
        <KPIStat
          label="Certificates Issued"
          value={counts.certificate}
          Icon={Award}
          accentClass="bg-emerald-700"
          active={true}
          onClick={() => onSelect("certificate")}
          hint="Completed registrations"
        />
      )}
    </div>
  );
}
