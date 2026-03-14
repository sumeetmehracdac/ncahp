import { useCallback, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Save, Upload, CheckCircle, ArrowLeft, ChevronDown, Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkflowStore } from '../store/workflowStore';
import StepNode from '../components/nodes/StepNode';
import ActionEdge from '../components/nodes/ActionEdge';
import PropertiesPanel from '../components/PropertiesPanel';
import RulesTable from '../components/RulesTable';
import NodePalette from '../components/NodePalette';
import { toast } from 'sonner';

const nodeTypes = { stepNode: StepNode };
const edgeTypes = { actionEdge: ActionEdge };

const WorkflowEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const {
    workflows, applicationTypes, selectedElementId, isDirty,
    selectElement, setActiveWorkflow, saveWorkflow, publishWorkflow,
    runValidation, validationIssues, addStep, addTransition,
    showRulesTable, showValidation, updateStep,
  } = useWorkflowStore();

  const workflow = workflows.find(w => w.id === id);
  const appType = workflow ? applicationTypes.find(at => at.id === workflow.applicationTypeId) : null;

  // Build React Flow nodes from workflow steps
  const flowNodes = useMemo<Node[]>(() => {
    if (!workflow) return [];
    return workflow.steps.map(step => {
      const role = workflow.roles.find(r => r.id === step.roleId);
      const hasError = validationIssues.some(v => v.elementId === step.id);
      return {
        id: step.id,
        type: 'stepNode',
        position: step.position,
        data: {
          step,
          roleName: role?.name || 'Unassigned',
          roleColor: role?.color || '#e2e8f0',
          isSelected: selectedElementId === step.id,
          hasError,
        },
      };
    });
  }, [workflow, selectedElementId, validationIssues]);

  const flowEdges = useMemo<Edge[]>(() => {
    if (!workflow) return [];
    return workflow.transitions.map(tr => {
      const action = workflow.actions.find(a => a.id === tr.actionId);
      const hasError = validationIssues.some(v => v.elementId === tr.id);
      return {
        id: tr.id,
        source: tr.fromStepId,
        target: tr.toStepId,
        type: 'actionEdge',
        data: {
          actionName: action?.name || '—',
          isSelected: selectedElementId === tr.id,
          hasError,
        },
      };
    });
  }, [workflow, selectedElementId, validationIssues]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Sync when flowNodes/flowEdges change
  useEffect(() => { setNodes(flowNodes); }, [flowNodes, setNodes]);
  useEffect(() => { setEdges(flowEdges); }, [flowEdges, setEdges]);

  const onConnect = useCallback((connection: Connection) => {
    if (!workflow || !connection.source || !connection.target) return;
    const newId = `tr-${Date.now()}`;
    addTransition(workflow.id, {
      id: newId,
      fromStepId: connection.source,
      toStepId: connection.target,
      actionId: workflow.actions[0]?.id || 'act-forward',
    });
    toast.success('Transition created');
  }, [workflow, addTransition]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    selectElement(node.id, 'step');
  }, [selectElement]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    selectElement(edge.id, 'transition');
  }, [selectElement]);

  const onPaneClick = useCallback(() => {
    selectElement(null, null);
  }, [selectElement]);

  const onNodeDragStop = useCallback((_: React.MouseEvent, node: Node) => {
    if (!workflow) return;
    updateStep(workflow.id, node.id, { position: { x: node.position.x, y: node.position.y } });
  }, [workflow, updateStep]);

  // Drop handler for palette
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!workflow || !reactFlowWrapper.current) return;

    const type = event.dataTransfer.getData('application/workflow-node');
    if (!type) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = {
      x: event.clientX - bounds.left - 80,
      y: event.clientY - bounds.top - 20,
    };

    const newId = `step-${Date.now()}`;
    const stepType = type === 'task-external' ? 'task' : type as 'start' | 'task' | 'decision' | 'end';
    const category = type === 'task-external' ? 'external' : 'internal';

    addStep(workflow.id, {
      id: newId,
      type: stepType,
      name: stepType === 'start' ? 'Start' : stepType === 'end' ? 'End' : 'New Step',
      roleId: workflow.roles[0]?.id || '',
      category: stepType === 'task' ? category as 'internal' | 'external' : undefined,
      position,
    });

    toast.success('Step added to canvas');
  }, [workflow, addStep]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleSave = () => {
    if (!workflow) return;
    saveWorkflow(workflow.id);
    toast.success('Workflow saved as draft');
  };

  const handlePublish = () => {
    if (!workflow) return;
    runValidation(workflow.id);
    const issues = useWorkflowStore.getState().validationIssues;
    const errors = issues.filter(i => i.severity === 'error');
    if (errors.length > 0) {
      toast.error(`Cannot publish: ${errors.length} error(s) found`);
      return;
    }
    publishWorkflow(workflow.id);
    toast.success('Workflow published successfully');
  };

  const handleValidate = () => {
    if (!workflow) return;
    runValidation(workflow.id);
    const issues = useWorkflowStore.getState().validationIssues;
    if (issues.length === 0) {
      toast.success('No issues found');
    } else {
      toast.warning(`${issues.length} issue(s) found`);
    }
  };

  if (!workflow) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Workflow not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/workflows')}>
            ← Back to Catalog
          </Button>
        </div>
      </div>
    );
  }

  // Swimlane backgrounds
  const swimlanes = workflow.roles.map((role, idx) => ({
    role,
    y: idx * 120,
    height: 120,
  }));

  return (
    <div className="h-screen flex flex-col bg-muted">
      {/* Top Bar */}
      <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/workflows')} className="gap-1">
            <ArrowLeft className="w-4 h-4" /> Catalog
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h2 className="text-sm font-bold text-foreground truncate max-w-[400px]">{appType?.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-[10px] h-5">v{workflow.version}</Badge>
              <Badge
                variant="outline"
                className={`text-[10px] h-5 ${workflow.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
              >
                {workflow.status}
              </Badge>
              {isDirty && <Badge variant="outline" className="text-[10px] h-5 bg-orange-100 text-orange-700">Unsaved</Badge>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleValidate} className="gap-1">
            <Shield className="w-4 h-4" /> Validate
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} className="gap-1">
            <Save className="w-4 h-4" /> Save Draft
          </Button>
          <Button size="sm" onClick={handlePublish} className="gap-1 bg-primary text-primary-foreground">
            <Upload className="w-4 h-4" /> Publish
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Palette */}
        <div className="w-[200px] bg-card border-r border-border p-3 overflow-y-auto flex-shrink-0">
          <NodePalette />

          {/* Swimlane Legend */}
          <div className="mt-6 space-y-2">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
              Roles / Lanes
            </h3>
            {workflow.roles.map(role => (
              <div key={role.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md" style={{ backgroundColor: role.color + '40' }}>
                <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: role.color }} />
                <span className="text-[11px] font-medium text-foreground truncate">{role.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col">
          <div ref={reactFlowWrapper} className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              onNodeDragStop={onNodeDragStop}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              snapToGrid
              snapGrid={[16, 16]}
              className="bg-muted"
            >
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} className="opacity-40" />
              <Controls position="bottom-left" className="!shadow-md !rounded-lg !border !border-border" />
              <MiniMap
                position="bottom-left"
                style={{ left: 60, bottom: 10 }}
                className="!rounded-lg !border !border-border !shadow-md"
                maskColor="rgba(0,0,0,0.1)"
              />

              {/* Swimlane labels */}
              <Panel position="top-left" className="!m-0">
                <div className="flex flex-col">
                  {swimlanes.map(lane => (
                    <div
                      key={lane.role.id}
                      className="px-3 py-1 text-[10px] font-semibold border-b border-border/30"
                      style={{
                        height: lane.height,
                        backgroundColor: lane.role.color + '20',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {lane.role.name}
                    </div>
                  ))}
                </div>
              </Panel>
            </ReactFlow>
          </div>

          {/* Bottom Rules Table */}
          {(showRulesTable || showValidation) && <RulesTable workflow={workflow} />}

          {/* Toggle Bar */}
          {!showRulesTable && !showValidation && (
            <div className="border-t border-border bg-card px-4 py-1.5 flex items-center gap-4">
              <RulesTable workflow={workflow} />
            </div>
          )}
        </div>

        {/* Right Properties Panel */}
        <div className="w-[280px] bg-card border-l border-border flex-shrink-0 overflow-hidden">
          <PropertiesPanel workflow={workflow} />
        </div>
      </div>
    </div>
  );
};

export default WorkflowEditor;
