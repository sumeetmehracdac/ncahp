import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, Shield, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import type { UserRoleMapping } from '../types';

interface ExistingMappingsTableProps {
  mappings: UserRoleMapping[];
  editingMappingId: string | null;
  onEdit: (mapping: UserRoleMapping) => void;
  onDelete?: (mappingId: string) => void;
  userName: string;
}

export function ExistingMappingsTable({
  mappings,
  editingMappingId,
  onEdit,
  onDelete,
  userName,
}: ExistingMappingsTableProps) {
  if (mappings.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-xl border shadow-sm overflow-hidden"
    >
      <div className="px-5 py-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">
              Current Role Mappings for {userName}
            </h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {mappings.length} mapping{mappings.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-primary text-primary-foreground hover:bg-primary">
            <TableHead className="text-primary-foreground font-semibold text-xs">
              Stakeholder Type
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold text-xs">
              Committee Type
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold text-xs">
              Committee
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold text-xs">
              Assigned Roles
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold text-xs">
              Status
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold text-xs text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {mappings.map((mapping, index) => {
              const isEditing = mapping.mappingId === editingMappingId;

              return (
                <motion.tr
                  key={mapping.mappingId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "border-b transition-colors",
                    isEditing
                      ? "bg-primary/5 border-l-4 border-l-primary"
                      : "hover:bg-muted/50"
                  )}
                >
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        mapping.status === 'ACTIVE' ? "bg-emerald-500" : "bg-muted-foreground"
                      )} />
                      {mapping.stakeholder.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {mapping.committee.committeeType.typeName}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>
                      {mapping.committee.committeeName}
                      {mapping.committee.state && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {mapping.committee.state.stateName}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <Badge variant="outline" className="text-xs">
                      {mapping.role.roleName}
                      {' '}(Default)
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={mapping.status === 'ACTIVE' ? 'default' : 'secondary'}
                      className={cn(
                        "text-[10px]",
                        mapping.status === 'ACTIVE' && "bg-emerald-100 text-emerald-700 border-emerald-200"
                      )}
                    >
                      {mapping.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(mapping)}
                        className={cn(
                          "h-8 w-8 p-0",
                          isEditing && "text-primary"
                        )}
                        title="Edit mapping"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>

                      {onDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              title="Delete mapping"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Role Mapping</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove{' '}
                                <strong>{mapping.role.roleName}</strong> assignment from{' '}
                                <strong>{mapping.committee.committeeName}</strong>?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(mapping.mappingId)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </TableBody>
      </Table>
    </motion.div>
  );
}
