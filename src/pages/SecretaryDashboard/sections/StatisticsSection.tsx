import { useMemo } from "react";
import { useSecretaryDashboardStore } from "../store/secretaryDashboardStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle2, UserPlus, Award } from "lucide-react";
import { Application } from "../types";

export function StatisticsSection() {
  const apps = useSecretaryDashboardStore((s) => s.applications);

  const stats = useMemo(() => {
    const total = apps.length;
    const recommended = apps.filter((a) => a.bucket === "evaluated_recommended").length;
    const notRecommended = apps.filter((a) => a.bucket === "evaluated_not_recommended").length;
    const forwarded = apps.filter((a) => a.bucket === "forwarded").length;
    const uid = apps.filter((a) => a.bucket === "uid").length;
    const certificate = apps.filter((a) => a.bucket === "certificate").length;
    const newApps = apps.filter((a) => a.bucket === "new").length;

    // Funnel Data
    const funnelData = [
      { name: "New", value: newApps },
      { name: "Evaluated", value: recommended + notRecommended },
      { name: "Forwarded", value: forwarded },
      { name: "UID Gen.", value: uid },
      { name: "Certified", value: certificate },
    ];

    // Evaluation Stats
    const evaluationData = [
      { name: "Recommended", value: recommended },
      { name: "Not Recommended", value: notRecommended },
    ];

    // Top Professions
    const profCount = apps.reduce((acc, app) => {
      if (app.profession) {
        acc[app.profession] = (acc[app.profession] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const professionData = Object.entries(profCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // top 5

    return {
      total,
      funnelData,
      evaluationData,
      professionData,
      recommendedRate: total > 0 ? Math.round((recommended / total) * 100) : 0,
    };
  }, [apps]);

  const COLORS = ["#10b981", "#f43f5e", "#f59e0b", "#3b82f6", "#8b5cf6"];
  const EVAL_COLORS = ["#10b981", "#f43f5e"];

  return (
    <div className="space-y-6">
      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recommendedRate}%</div>
            <p className="text-xs text-muted-foreground">Of processed applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Profession</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">
              {stats.professionData[0]?.name || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.professionData[0]?.value || 0} applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Action</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.funnelData[0].value + stats.funnelData[1].value}
            </div>
            <p className="text-xs text-muted-foreground">New & Evaluated combined</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Funnel Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Application Funnel</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.funnelData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evaluation Stats */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Evaluation Outcomes</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.evaluationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.evaluationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EVAL_COLORS[index % EVAL_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Breakdown By Profession */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Professions</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.professionData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  width={150} // Ensure labels fit
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24}>
                  {stats.professionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
