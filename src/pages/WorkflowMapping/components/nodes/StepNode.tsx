import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { User, Building2, Cog, Play, Square } from 'lucide-react';
import { Step } from '../../types';

interface StepNodeData extends Record<string, unknown> {
  step: Step;
  roleName: string;
  roleColor: string;
  isSelected: boolean;
  hasError: boolean;
}

const categoryIcons = {
  internal: User,
  external: Building2,
  system: Cog,
  notification: Cog,
};

const StepNode = memo(({ data }: NodeProps) => {
  const nodeData = data as StepNodeData;
  const { step, roleName, roleColor, isSelected, hasError } = nodeData;

  if (step.type === 'start') {
    return (
      <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all ${
        isSelected ? 'ring-[3px] ring-primary' : ''
      } ${hasError ? 'ring-[3px] ring-destructive' : ''}`}
        style={{ backgroundColor: '#22c55e' }}
      >
        <Play className="w-6 h-6 text-white fill-white" />
        <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-primary !border-2 !border-background" />
      </div>
    );
  }

  if (step.type === 'end') {
    return (
      <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all ${
        isSelected ? 'ring-[3px] ring-primary' : ''
      } ${hasError ? 'ring-[3px] ring-destructive' : ''}`}
        style={{ backgroundColor: step.name.toLowerCase().includes('reject') ? '#ef4444' : '#6366f1' }}
      >
        <Square className="w-5 h-5 text-white fill-white" />
        <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-primary !border-2 !border-background" />
      </div>
    );
  }

  const Icon = categoryIcons[step.category || 'internal'];

  return (
    <div
      className={`min-w-[160px] max-w-[220px] rounded-xl shadow-md border-2 transition-all bg-card ${
        isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
      } ${hasError ? 'border-destructive ring-2 ring-destructive/20' : ''}`}
      style={{ borderLeftColor: roleColor, borderLeftWidth: '4px' }}
    >
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-primary !border-2 !border-background" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-primary !border-2 !border-background" />

      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs font-semibold text-foreground truncate">{step.name}</span>
        </div>
        <div className="text-[10px] text-muted-foreground truncate">{roleName}</div>
      </div>
    </div>
  );
});

StepNode.displayName = 'StepNode';

export default StepNode;
