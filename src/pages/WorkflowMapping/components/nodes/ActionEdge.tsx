import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react';

interface ActionEdgeData extends Record<string, unknown> {
  actionName: string;
  isSelected: boolean;
  hasError: boolean;
}

const ActionEdge = memo(({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, style,
}: EdgeProps) => {
  const edgeData = data as ActionEdgeData;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          strokeWidth: edgeData?.isSelected ? 3 : 2,
          stroke: edgeData?.hasError
            ? 'hsl(var(--destructive))'
            : edgeData?.isSelected
              ? 'hsl(var(--primary))'
              : 'hsl(var(--muted-foreground) / 0.4)',
        }}
      />
      <EdgeLabelRenderer>
        <div
          className={`absolute px-2 py-0.5 rounded-full text-[10px] font-medium pointer-events-auto cursor-pointer transition-colors ${
            edgeData?.isSelected
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card border border-border text-muted-foreground hover:bg-muted shadow-sm'
          }`}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          {edgeData?.actionName || '—'}
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

ActionEdge.displayName = 'ActionEdge';

export default ActionEdge;
