import { Construction } from 'lucide-react';

const placeholder = (title: string, desc: string) => () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-xl font-bold text-foreground font-display">{title}</h1>
      <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
    </div>
    <div className="bg-card rounded-xl border border-border p-12 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Construction className="w-7 h-7 text-primary/40" />
      </div>
      <h3 className="text-base font-medium text-foreground mb-1">Coming Soon</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        This page mirrors the proposal workflow configuration, scoped to monitoring request types.
      </p>
    </div>
  </div>
);

export const MonitoringRouting = placeholder('Monitoring Routing', 'Post-sanctioning routing rules for monitoring workflow');
export const MonitoringPermissions = placeholder('Monitoring Permissions', 'Role–action permissions specific to monitoring actions');
export const MonitoringApprovalMaster = placeholder('Monitoring Approval Master', 'Approval chain rules for monitoring request types');
