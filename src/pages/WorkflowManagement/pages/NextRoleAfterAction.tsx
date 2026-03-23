import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { routingRules, roles, actions, schemes } from '../data/mockData';

const NextRoleAfterAction = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-xl font-bold text-foreground font-display">Next Role After Action</h1>
      <p className="text-sm text-muted-foreground mt-0.5">Define routing rules — which role receives the application after each action</p>
    </div>
    <div className="space-y-3">
      {routingRules.map((rule) => {
        const action = actions.find((a) => a.id === rule.actionId);
        const curRole = roles.find((r) => r.id === rule.currentRoleId);
        const nextRoles = rule.nextRoleIds.map((id) => roles.find((r) => r.id === id)).filter(Boolean);
        const scheme = schemes.find((s) => s.id === rule.scheme);
        return (
          <div key={rule.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/20 transition-all">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: curRole?.color }} />
                <span className="text-sm font-medium">{curRole?.name}</span>
              </div>
              <Badge className="bg-accent/10 text-accent border-0 text-[10px]">{action?.name}</Badge>
              <ArrowRight className="w-4 h-4 text-primary/40" />
              <div className="flex gap-1.5">
                {nextRoles.map((r) => (
                  <div key={r!.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: r!.color + '15', color: r!.color }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r!.color }} />
                    {r!.name}
                  </div>
                ))}
              </div>
              <Badge variant="outline" className="text-[10px] ml-auto">{scheme?.name}</Badge>
            </div>
            {rule.comments && (
              <p className="text-xs text-muted-foreground mt-2 pl-5">{rule.comments}</p>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default NextRoleAfterAction;
