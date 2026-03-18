import { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, ChevronDown, Save, Send, Copy,
  Play, Square, Settings2, MousePointerClick,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkflowStore } from '../store/workflowStore';
import StepConfigurator from '../components/StepConfigurator';
import CopyWorkflowDialog from '../components/CopyWorkflowDialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const WorkflowDesigner = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    applicationTypes, roles, actionDefs, workflows,
    ensureWorkflow, addStep, removeStep, updateStep, updateStepActions, publishWorkflow,
  } = useWorkflowStore();

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [copyOpen, setCopyOpen] = useState(false);

  const appType = applicationTypes.find((at) => at.id === id);
  const workflow = workflows.find((w) => w.applicationTypeId === id);

  useEffect(() => {
    if (id && !workflow) ensureWorkflow(id);
  }, [id, workflow, ensureWorkflow]);

  useEffect(() => {
    if (workflow && workflow.steps.length > 0 && !selectedStepId) {
      const sorted = [...workflow.steps].sort((a, b) => a.order - b.order);
      setSelectedStepId(sorted[0].id);
    }
  }, [workflow, selectedStepId]);

  if (!appType || !workflow) return null;

  const sortedSteps = [...workflow.steps].sort((a, b) => a.order - b.order);
  const selectedStep = sortedSteps.find((s) => s.id === selectedStepId) || null;

  const handleAddStep = () => {
    const newId = addStep(workflow.id);
    setSelectedStepId(newId);
    toast.success('Step added');
  };

  const handleDeleteStep = (stepId: string) => {
    removeStep(workflow.id, stepId);
    setSelectedStepId(null);
    toast.success('Step removed');
  };

  const handleSave = () => {
    toast.success('Workflow saved as draft');
  };

  const handlePublish = () => {
    publishWorkflow(workflow.id);
    toast.success('Workflow published successfully');
  };

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header - Teal branded */}
      <header className="sticky top-0 z-20 bg-primary text-primary-foreground shadow-md">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/workflows')}
              className="shrink-0 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="h-6 w-px bg-white/20" />
            <div className="min-w-0">
              <h1 className="text-sm font-semibold truncate">
                {appType.name}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge
                  className={cn(
                    'text-[9px] border-0',
                    workflow.status === 'published'
                      ? 'bg-emerald-400/20 text-emerald-100'
                      : 'bg-accent/30 text-accent-foreground'
                  )}
                >
                  {workflow.status}
                </Badge>
                <span className="text-[10px] text-primary-foreground/50">
                  v{workflow.version}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {workflow.steps.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCopyOpen(true)}
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
              >
                <Copy className="w-4 h-4 mr-1.5" /> Copy
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
            >
              <Save className="w-4 h-4 mr-1.5" /> Save
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              className="bg-accent hover:bg-accent/90 text-accent-foreground border-0"
            >
              <Send className="w-4 h-4 mr-1.5" /> Publish
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex gap-8 items-start">
          {/* Left: Pipeline */}
          <div className="w-[340px] shrink-0">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Pipeline
                </h2>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {sortedSteps.length} step{sortedSteps.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div>
                <AnimatePresence mode="popLayout">
                  {sortedSteps.map((step, i) => {
                    const role = roles.find((r) => r.id === step.roleId);
                    const isSelected = selectedStepId === step.id;

                    return (
                      <Fragment key={step.id}>
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            'relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-150',
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                              : 'border-border bg-card hover:border-primary/30 hover:shadow-md'
                          )}
                          onClick={() => setSelectedStepId(step.id)}
                        >
                          {/* Left accent strip */}
                          {isSelected && (
                            <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-primary" />
                          )}

                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                                step.type === 'start' && 'bg-emerald-500/15',
                                step.type === 'terminal' && 'bg-destructive/10',
                                step.type === 'process' && 'bg-primary/10'
                              )}
                            >
                              {step.type === 'start' ? (
                                <Play className="w-3.5 h-3.5 text-emerald-600" />
                              ) : step.type === 'terminal' ? (
                                <Square className="w-3.5 h-3.5 text-destructive" />
                              ) : (
                                <Settings2 className="w-3.5 h-3.5 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">
                                {step.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                                  style={{
                                    backgroundColor: (role?.color || '#888') + '18',
                                    color: role?.color || '#888',
                                  }}
                                >
                                  {role?.name || 'Unassigned'}
                                </span>
                                {step.type !== 'terminal' && (
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <span className={cn(
                                      'w-1.5 h-1.5 rounded-full',
                                      step.actions.length > 0 ? 'bg-accent' : 'bg-muted-foreground/30'
                                    )} />
                                    {step.actions.length} action{step.actions.length !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Connector */}
                        {i < sortedSteps.length - 1 && (
                          <div className="flex justify-center py-1">
                            <div className="flex flex-col items-center">
                              <div className="w-px h-3 bg-primary/20" />
                              <ChevronDown className="w-3.5 h-3.5 text-primary/30" />
                            </div>
                          </div>
                        )}
                      </Fragment>
                    );
                  })}
                </AnimatePresence>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 h-10 border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50"
                onClick={handleAddStep}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Step
              </Button>
            </div>
          </div>

          {/* Right: Configurator */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {selectedStep ? (
                <motion.div
                  key={selectedStep.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.15 }}
                >
                  <StepConfigurator
                    step={selectedStep}
                    allSteps={sortedSteps}
                    roles={roles}
                    actionDefs={actionDefs}
                    onUpdate={(updates) =>
                      updateStep(workflow.id, selectedStep.id, updates)
                    }
                    onUpdateActions={(actions) =>
                      updateStepActions(workflow.id, selectedStep.id, actions)
                    }
                    onDelete={() => handleDeleteStep(selectedStep.id)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-[400px] text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <MousePointerClick className="w-7 h-7 text-primary/40" />
                  </div>
                  <h3 className="text-base font-medium text-foreground">Select a Step</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    Click on any step in the pipeline to configure its role, actions, and routing
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <CopyWorkflowDialog
        open={copyOpen}
        onOpenChange={setCopyOpen}
        sourceAppTypeId={id || ''}
      />
    </div>
  );
};

export default WorkflowDesigner;
