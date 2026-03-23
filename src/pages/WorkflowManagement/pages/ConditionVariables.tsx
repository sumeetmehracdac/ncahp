import { Sliders, BarChart3, Construction } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { conditionVariables, conditionRanges } from '../data/mockData';

const ConditionVariables = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-xl font-bold text-foreground font-display">Condition Variables</h1>
      <p className="text-sm text-muted-foreground mt-0.5">Define branching logic variables and their ranges</p>
    </div>
    <div className="grid grid-cols-3 gap-4">
      {conditionVariables.map((cv) => {
        const ranges = conditionRanges.filter((r) => r.variableId === cv.id);
        return (
          <div key={cv.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sliders className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{cv.displayLabel}</p>
                <code className="text-[10px] text-muted-foreground font-mono">{cv.name}</code>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{cv.description}</p>
            <Badge variant="outline" className="text-[10px] mr-1.5">{cv.dataType}</Badge>
            <Badge className="bg-primary/10 text-primary border-0 text-[10px]">{ranges.length} ranges</Badge>
            {ranges.length > 0 && (
              <div className="mt-3 flex gap-1">
                {ranges.map((r) => (
                  <div key={r.id} className="flex-1 h-2 rounded-full bg-primary/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/40 rounded-full" />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-1">
              {ranges.map((r) => (
                <span key={r.id} className="text-[9px] text-muted-foreground">{r.label}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default ConditionVariables;
