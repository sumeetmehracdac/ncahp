import { motion } from 'framer-motion';
import { Table, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkflowStore } from '../store/workflowStore';
import { Workflow } from '../types';

interface Props {
  workflow: Workflow;
}

const RulesTable = ({ workflow }: Props) => {
  const { selectedElementId, selectElement, showRulesTable, showValidation, toggleRulesTable, toggleValidation, validationIssues } = useWorkflowStore();

  return (
    <div className="border-t border-border bg-card">
      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border">
        <button
          onClick={toggleRulesTable}
          className={`px-4 py-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            showRulesTable ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          Rules Table
          <Badge variant="outline" className="text-[10px] h-5">{workflow.transitions.length}</Badge>
        </button>
        <button
          onClick={toggleValidation}
          className={`px-4 py-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            showValidation ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Validation
          {validationIssues.length > 0 && (
            <Badge variant="destructive" className="text-[10px] h-5">{validationIssues.length}</Badge>
          )}
        </button>
      </div>

      {/* Rules Table Content */}
      {showRulesTable && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="max-h-[250px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">From State</th>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Role</th>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Action</th>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Condition</th>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">To State</th>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {workflow.transitions.map(tr => {
                const fromStep = workflow.steps.find(s => s.id === tr.fromStepId);
                const toStep = workflow.steps.find(s => s.id === tr.toStepId);
                const action = workflow.actions.find(a => a.id === tr.actionId);
                const role = fromStep ? workflow.roles.find(r => r.id === fromStep.roleId) : null;
                const isActive = selectedElementId === tr.id;

                return (
                  <tr
                    key={tr.id}
                    onClick={() => selectElement(tr.id, 'transition')}
                    className={`cursor-pointer transition-colors ${
                      isActive ? 'bg-primary/10' : 'hover:bg-muted/30'
                    }`}
                  >
                    <td className="px-3 py-2 font-medium">{fromStep?.name || '—'}</td>
                    <td className="px-3 py-2">
                      {role && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: role.color }} />
                          {role.name}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className="text-[10px]">{action?.name || '—'}</Badge>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground font-mono">{tr.condition || '—'}</td>
                    <td className="px-3 py-2 font-medium">{toStep?.name || '—'}</td>
                    <td className="px-3 py-2 text-muted-foreground">{tr.sla || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Validation Content */}
      {showValidation && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="max-h-[250px] overflow-y-auto p-3 space-y-2">
          {validationIssues.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-emerald-600 font-medium">✓ No blocking issues found</p>
              <p className="text-xs text-muted-foreground mt-1">You can publish when ready.</p>
            </div>
          ) : (
            validationIssues.map(issue => (
              <div
                key={issue.id}
                onClick={() => issue.elementId && selectElement(issue.elementId, issue.elementType || null)}
                className={`flex items-start gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                  issue.severity === 'error' ? 'bg-red-50 hover:bg-red-100' : 'bg-amber-50 hover:bg-amber-100'
                }`}
              >
                <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                  issue.severity === 'error' ? 'text-red-600' : 'text-amber-600'
                }`} />
                <span className={`text-xs ${issue.severity === 'error' ? 'text-red-700' : 'text-amber-700'}`}>
                  {issue.message}
                </span>
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};

export default RulesTable;
