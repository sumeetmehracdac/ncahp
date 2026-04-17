import { Shield, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

export function DashboardHeader() {
  const now = new Date();
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 text-white shadow-xl"
      style={{
        background:
          "linear-gradient(135deg, hsl(180 84% 15%) 0%, hsl(180 79% 24%) 45%, hsl(25 95% 45%) 100%)",
      }}
    >
      {/* subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* glow blob */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-60 w-60 rounded-full bg-teal-200/20 blur-3xl" />

      <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
            <Shield className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/80">
              <span className="rounded-full bg-white/15 px-2 py-0.5 ring-1 ring-white/25">
                NCAHP
              </span>
              <span>National Commission for Allied & Healthcare Professionals</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">
              Secretary Dashboard
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Uttar Pradesh State Council
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {format(now, "EEEE, d MMM yyyy")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary font-bold">
            DR
          </div>
          <div className="text-sm">
            <div className="font-semibold">Dr. Rajesh Kumar</div>
            <div className="text-xs text-white/75">Secretary · NCAHP-UP</div>
            <div className="mt-0.5 text-[11px] text-white/60">
              Last login: {format(now, "d MMM, h:mm a")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
