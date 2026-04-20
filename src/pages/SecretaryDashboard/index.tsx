import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardHeader } from "./components/DashboardHeader";
import { KPIStrip } from "./components/KPIStrip";
import { useSecretaryDashboardStore } from "./store/secretaryDashboardStore";
import { TabKey } from "./types-ui";
import { NewApplicationsSection } from "./sections/NewApplicationsSection";
import { EvaluatedApplicationsSection } from "./sections/EvaluatedApplicationsSection";
import { ForwardedSection } from "./sections/ForwardedSection";
import { UIDGeneratedSection } from "./sections/UIDGeneratedSection";
import { CertificatesSection } from "./sections/CertificatesSection";
import { StatisticsSection } from "./sections/StatisticsSection";
import { Inbox, CheckCircle2, Send, Hash, Award, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TABS: { key: TabKey; label: string; Icon: typeof Inbox }[] = [
  { key: "new", label: "New Applications", Icon: Inbox },
  { key: "evaluated", label: "Evaluated", Icon: CheckCircle2 },
  { key: "forwarded", label: "Forwarded to NCAHP", Icon: Send },
  { key: "uid", label: "UID Generated", Icon: Hash },
  { key: "certificate", label: "Certificates", Icon: Award },
  { key: "stats", label: "Statistics", Icon: BarChart3 },
];

export default function SecretaryDashboardPage() {
  const apps = useSecretaryDashboardStore((s) => s.applications);
  const [active, setActive] = useState<TabKey>("new");

  const counts = useMemo(
    () => ({
      new: apps.filter((a) => a.bucket === "new").length,
      evaluated: apps.filter(
        (a) =>
          a.bucket === "evaluated_recommended" || a.bucket === "evaluated_not_recommended",
      ).length,
      forwarded: apps.filter((a) => a.bucket === "forwarded").length,
      uid: apps.filter((a) => a.bucket === "uid").length,
      certificate: apps.filter((a) => a.bucket === "certificate").length,
    }),
    [apps],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/40 via-background to-muted/20">
      <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 md:px-6 md:py-8">
        <DashboardHeader />

        {/* Tab bar — desktop pills */}
        <div className="hidden rounded-xl border border-border bg-card p-1.5 shadow-sm md:block">
          <nav className="relative flex items-center gap-1">
            {TABS.map((t) => {
              const isActive = active === t.key;
              const Icon = t.Icon;
              const badge =
                t.key === "evaluated"
                  ? counts.evaluated
                  : t.key === "new"
                    ? counts.new
                    : t.key === "forwarded"
                      ? counts.forwarded
                      : t.key === "uid"
                        ? counts.uid
                        : counts.certificate;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={cn(
                    "relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-primary shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="h-4 w-4" />
                  <span>{t.label}</span>
                  <span
                    className={cn(
                      "ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile tab selector */}
        <div className="md:hidden">
          <Select value={active} onValueChange={(v) => setActive(v as TabKey)}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TABS.map((t) => (
                <SelectItem key={t.key} value={t.key}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <KPIStrip counts={counts} active={active} onSelect={setActive} />

        {/* Section body */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {active === "new" && <NewApplicationsSection />}
            {active === "evaluated" && <EvaluatedApplicationsSection />}
            {active === "forwarded" && <ForwardedSection />}
            {active === "uid" && <UIDGeneratedSection />}
            {active === "certificate" && <CertificatesSection />}
            {active === "stats" && <StatisticsSection />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
