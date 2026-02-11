import { useState } from 'react';
import { ModuleLayout } from '../components/ModuleLayout';
import { SC_ADMIN, NCAHP_ADMIN, MOCK_RELAXATION_APPLICATIONS, STATE_COUNCILS } from '../data/mockData';
import type { RelaxationApplication, AdminContext, RelaxationApplicationStatus } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

// Toggle admin for demo — SC submits, NCAHP reviews
const DEMO_ADMIN: AdminContext = NCAHP_ADMIN;

const STATUS_CONFIG: Record<RelaxationApplicationStatus, { icon: React.ElementType; color: string; bg: string }> = {
  PENDING: { icon: Clock, color: 'text-amber-700', bg: 'bg-amber-100' },
  APPROVED: { icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-100' },
  REJECTED: { icon: XCircle, color: 'text-red-700', bg: 'bg-red-100' },
};

export default function RelaxationApplicationsPage() {
  const admin = DEMO_ADMIN;
  const isNCahp = admin.adminType === 'NCAHP';

  const [applications, setApplications] = useState<RelaxationApplication[]>(MOCK_RELAXATION_APPLICATIONS);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [reviewItem, setReviewItem] = useState<RelaxationApplication | null>(null);
  const [formDesc, setFormDesc] = useState('');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = isNCahp
    ? applications
    : applications.filter(a => a.stateCouncilId === admin.stateCouncilId);

  const byStatus = statusFilter === 'all'
    ? filtered
    : filtered.filter(a => a.status === statusFilter);

  const handleSubmit = () => {
    if (!formDesc.trim()) { toast.error('Description is required'); return; }
    const entry: RelaxationApplication = {
      relaxationApplicationId: applications.length + 100,
      stateCouncilId: admin.stateCouncilId!,
      stateCouncil: STATE_COUNCILS.find(sc => sc.stateCouncilId === admin.stateCouncilId),
      description: formDesc.trim(),
      status: 'PENDING',
      adminRemarks: null,
      approvedRelaxationId: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setApplications(prev => [...prev, entry]);
    toast.success('Application submitted');
    setFormDesc('');
    setSubmitOpen(false);
  };

  const handleReview = (status: 'APPROVED' | 'REJECTED') => {
    if (!reviewItem) return;
    if (status === 'REJECTED' && !reviewRemarks.trim()) {
      toast.error('Remarks are required for rejection');
      return;
    }
    setApplications(prev => prev.map(a =>
      a.relaxationApplicationId === reviewItem.relaxationApplicationId
        ? { ...a, status, adminRemarks: reviewRemarks.trim() || null, updatedAt: new Date().toISOString() }
        : a
    ));
    toast.success(`Application ${status.toLowerCase()}`);
    setReviewItem(null);
    setReviewRemarks('');
  };

  return (
    <ModuleLayout
      adminContext={admin}
      title="Relaxation Applications"
      subtitle={isNCahp
        ? 'Review relaxation requests from state councils.'
        : 'Submit and track relaxation requests to NCAHP.'
      }
      actions={
        !isNCahp ? (
          <Button onClick={() => setSubmitOpen(true)} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" /> New Application
          </Button>
        ) : undefined
      }
    >
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(['PENDING', 'APPROVED', 'REJECTED'] as RelaxationApplicationStatus[]).map(status => {
          const cfg = STATUS_CONFIG[status];
          const Icon = cfg.icon;
          const count = filtered.filter(a => a.status === status).length;
          return (
            <Card key={status} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(status)}>
              <CardContent className="pt-5 pb-4 flex items-center gap-3">
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', cfg.bg)}>
                  <Icon className={cn('h-5 w-5', cfg.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{status}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="APPROVED">Approved</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>State Council</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byStatus.map(item => {
                const cfg = STATUS_CONFIG[item.status];
                const Icon = cfg.icon;
                return (
                  <TableRow key={item.relaxationApplicationId}>
                    <TableCell className="tabular-nums">#{item.relaxationApplicationId}</TableCell>
                    <TableCell>{item.stateCouncil?.councilName ?? '—'}</TableCell>
                    <TableCell className="max-w-[300px] truncate text-sm">{item.description}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(cfg.bg, cfg.color, 'hover:' + cfg.bg, 'gap-1')}>
                        <Icon className="h-3.5 w-3.5" /> {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {item.adminRemarks ?? '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      {isNCahp && item.status === 'PENDING' ? (
                        <Button
                          variant="outline" size="sm"
                          onClick={() => { setReviewItem(item); setReviewRemarks(''); }}
                        >
                          Review
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => { setReviewItem(item); setReviewRemarks(item.adminRemarks ?? ''); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {byStatus.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Submit Dialog (SC only) */}
      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Relaxation Request</DialogTitle>
            <DialogDescription>Describe the relaxation you'd like NCAHP to add.</DialogDescription>
          </DialogHeader>
          <div>
            <Label>Description *</Label>
            <Textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={4}
              placeholder="e.g. Discount for senior citizens above 60 years in our state..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-teal-600 hover:bg-teal-700">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog (NCAHP) */}
      <Dialog open={!!reviewItem} onOpenChange={open => !open && setReviewItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {reviewItem?.status === 'PENDING' ? 'Review Application' : 'Application Details'}
            </DialogTitle>
            <DialogDescription>
              From: {reviewItem?.stateCouncil?.councilName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <Label className="text-xs text-muted-foreground">Description</Label>
              <p className="text-sm mt-1">{reviewItem?.description}</p>
            </div>
            {(isNCahp && reviewItem?.status === 'PENDING') ? (
              <div>
                <Label>Admin Remarks</Label>
                <Textarea value={reviewRemarks} onChange={e => setReviewRemarks(e.target.value)} rows={3}
                  placeholder="Remarks (required for rejection)..." />
              </div>
            ) : reviewItem?.adminRemarks ? (
              <div className="rounded-lg bg-muted/50 p-3">
                <Label className="text-xs text-muted-foreground">Admin Remarks</Label>
                <p className="text-sm mt-1">{reviewItem.adminRemarks}</p>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            {isNCahp && reviewItem?.status === 'PENDING' ? (
              <>
                <Button variant="outline" className="text-destructive" onClick={() => handleReview('REJECTED')}>
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
                <Button onClick={() => handleReview('APPROVED')} className="bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setReviewItem(null)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModuleLayout>
  );
}
