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
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      <KPIStat
        label="New Applications"
        value={counts.new}
        Icon={Inbox}
        accentClass="bg-teal-600"
        active={active === "new"}
        onClick={() => onSelect("new")}
        hint="Awaiting forward to CO"
      />
      <KPIStat
        label="Evaluated"
        value={counts.evaluated}
        Icon={CheckCircle2}
        accentClass="bg-emerald-600"
        active={active === "evaluated"}
        onClick={() => onSelect("evaluated")}
        hint="Recommended / Rejected"
      />
      <KPIStat
        label="Forwarded to NCAHP"
        value={counts.forwarded}
        Icon={Send}
        accentClass="bg-orange-500"
        active={active === "forwarded"}
        onClick={() => onSelect("forwarded")}
        hint="Pending NCAHP review"
      />
      <KPIStat
        label="UID Generated"
        value={counts.uid}
        Icon={Hash}
        accentClass="bg-indigo-600"
        active={active === "uid"}
        onClick={() => onSelect("uid")}
        hint="Ready for certificate"
      />
      <KPIStat
        label="Certificates Issued"
        value={counts.certificate}
        Icon={Award}
        accentClass="bg-emerald-700"
        active={active === "certificate"}
        onClick={() => onSelect("certificate")}
        hint="Completed registrations"
      />
    </div>
  );
}
