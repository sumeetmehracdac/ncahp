import { Play, Square, User, Building2, Cog, Diamond } from 'lucide-react';

const paletteItems = [
  { type: 'start', label: 'Start', icon: Play, color: '#22c55e' },
  { type: 'task', label: 'Review Step', icon: User, color: 'hsl(var(--primary))' },
  { type: 'task-external', label: 'External Org Step', icon: Building2, color: '#f97316' },
  { type: 'decision', label: 'Decision Gateway', icon: Diamond, color: '#8b5cf6' },
  { type: 'end', label: 'End', icon: Square, color: '#6366f1' },
];

const NodePalette = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/workflow-node', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="space-y-2">
      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
        Node Palette
      </h3>
      <div className="space-y-1">
        {paletteItems.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              draggable
              onDragStart={e => onDragStart(e, item.type)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors"
            >
              <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: item.color + '20' }}>
                <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
              </div>
              <span className="text-xs font-medium text-foreground">{item.label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 px-1">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Drag items onto the canvas to create new steps. Connect steps by dragging from one handle to another.
        </p>
      </div>
    </div>
  );
};

export default NodePalette;
