import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Link2,
    Users,
    Building2,
    Layers,
    Building,
    UserCheck,
    CheckCircle2,
    PartyPopper,
    Plus,
    Eye,
    Calendar,
    ArrowRight,
    Shield,
    MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FlowSelector } from './components/FlowSelector';
import { FlowSummary } from './components/FlowSummary';
import { FloatingProgressBar, createStepsConfig } from './components/FloatingProgressBar';
import { useSinglePageForm } from './hooks/useSinglePageForm';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-6">
                <Skeleton className="h-24 w-full rounded-2xl mb-6" />
                <Skeleton className="h-16 w-full max-w-4xl mx-auto rounded-2xl mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <Skeleton className="h-40 rounded-xl" />
                    <Skeleton className="h-40 rounded-xl" />
                    <Skeleton className="h-40 rounded-xl" />
                    <Skeleton className="h-40 rounded-xl" />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default function SinglePageSC() {
    const [isLoading, setIsLoading] = useState(true);

    const {
        formData,
        isSubmitting,
        submitSuccess,
        currentUserContext,
        progress,
        isFormComplete,
        availableUsers,
        availableStakeholders,
        availableCommitteeTypes,
        availableCommittees,
        availableRoles,
        selectedUser,
        selectedStakeholder,
        selectedCommitteeType,
        selectedCommittee,
        selectedRoles,
        updateFormData,
        submitForm,
        resetForm
    } = useSinglePageForm('SC');

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Convert to selector options
    const userOptions = availableUsers.map(u => ({
        id: u.userId,
        label: u.fullName,
        sublabel: u.email,
        color: 'bg-blue-500 text-white'
    }));

    const stakeholderOptions = availableStakeholders.map(s => ({
        id: s.stakeholderId,
        label: s.name,
        sublabel: s.state?.stateName,
        badge: s.stakeholderType === 'NCAHP_HO' ? 'National' : s.stakeholderType === 'STATE_COUNCIL' ? 'State' : 'External',
        color: s.stakeholderType === 'NCAHP_HO' ? 'bg-indigo-500 text-white' : s.stakeholderType === 'STATE_COUNCIL' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
    }));

    const committeeTypeOptions = availableCommitteeTypes.map(ct => ({
        id: ct.committeeTypeId,
        label: ct.typeName,
        sublabel: ct.description,
        color: 'bg-violet-500 text-white'
    }));

    const committeeOptions = availableCommittees.map(c => ({
        id: c.committeeId,
        label: c.committeeName,
        sublabel: c.state?.stateName || 'National',
        badge: c.state?.stateCode,
        color: 'bg-amber-500 text-white'
    }));

    const stepsConfig = createStepsConfig(formData);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30">
            <Header />

            {/* Compact Hero - Matches HO style */}
            <section className="relative bg-gradient-to-r from-primary via-primary to-primary/95 text-primary-foreground overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                <div className="container mx-auto px-6 py-8 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                                    <Link2 className="h-5 w-5" />
                                </div>
                                <Badge variant="secondary" className="bg-emerald-600 text-white border-0 text-xs gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {currentUserContext.stakeholder.state?.stateName || 'State'} Council Admin
                                </Badge>
                                <Link
                                    to="/user-role-mapping/ho"
                                    className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <Shield className="w-3.5 h-3.5" />
                                    View as HO Admin
                                </Link>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2 text-white">
                                User-Role-Committee Mapping
                            </h1>
                            <p className="text-sm text-white/90 max-w-lg leading-relaxed">
                                Assign users to roles within your state council and external stakeholders.
                            </p>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-4"
                        >
                            <div className="hidden md:flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                                    <Users className="h-4 w-4" />
                                    <span>{availableUsers.length} Users</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                                    <Building className="h-4 w-4" />
                                    <span>{availableCommittees.length}+ Committees</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Flow Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 pt-5 border-t border-white/20"
                    >
                        <FlowSummary
                            user={selectedUser}
                            stakeholder={selectedStakeholder}
                            committeeType={selectedCommitteeType}
                            committee={selectedCommittee}
                            roles={selectedRoles}
                            isComplete={isFormComplete}
                        />
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-6 py-6">
                {/* Floating Progress Bar */}
                <FloatingProgressBar
                    steps={stepsConfig}
                    progress={progress}
                    className="mb-6"
                />

                <AnimatePresence mode="wait">
                    {submitSuccess ? (
                        /* Success State */
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-2xl mx-auto text-center py-12"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                className="relative inline-block mb-5"
                            >
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="absolute -top-1 -right-1"
                                >
                                    <PartyPopper className="w-7 h-7 text-amber-500" />
                                </motion.div>
                            </motion.div>

                            <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                                Assignment Created!
                            </h2>
                            <p className="text-muted-foreground mb-6 text-sm">
                                <strong className="text-foreground">{selectedUser?.fullName}</strong> has been assigned as{' '}
                                <strong className="text-foreground">{selectedRoles.map(r => r.roleName).join(', ')}</strong> to{' '}
                                <strong className="text-foreground">{selectedCommittee?.committeeName}</strong>.
                            </p>

                            <div className="flex items-center justify-center gap-3">
                                <Button variant="outline" size="default" className="gap-2">
                                    <Eye className="w-4 h-4" />
                                    View Mappings
                                </Button>
                                <Button size="default" onClick={resetForm} className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Create Another
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        /* Form State */
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Selection Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                                {/* User Selection */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-card rounded-xl border shadow-sm p-5"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                                            <Users className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium text-sm text-foreground">Step 1</span>
                                        {selectedUser && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                                    </div>

                                    <FlowSelector
                                        label="Select User"
                                        placeholder="Choose a user to assign..."
                                        options={userOptions}
                                        value={formData.userId}
                                        onChange={(v) => updateFormData('userId', v)}
                                        icon={<Users className="w-5 h-5" />}
                                    />
                                </motion.div>

                                {/* Stakeholder Selection */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className={cn(
                                        "bg-card rounded-xl border shadow-sm p-5 transition-opacity",
                                        !formData.userId && "opacity-50"
                                    )}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                                            <Building2 className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium text-sm text-foreground">Step 2</span>
                                        <Badge variant="outline" className="ml-1 text-[10px] bg-amber-50 text-amber-700 border-amber-200 px-1.5 py-0">
                                            SC + EXT
                                        </Badge>
                                        {selectedStakeholder && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                                    </div>

                                    <FlowSelector
                                        label="Select Stakeholder Level"
                                        placeholder="Choose stakeholder type..."
                                        options={stakeholderOptions}
                                        value={formData.stakeholderId}
                                        onChange={(v) => updateFormData('stakeholderId', v)}
                                        disabled={!formData.userId}
                                        icon={<Building2 className="w-5 h-5" />}
                                        emptyMessage="Select a user first"
                                    />
                                </motion.div>

                                {/* Committee Type Selection */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className={cn(
                                        "bg-card rounded-xl border shadow-sm p-5 transition-opacity",
                                        !formData.stakeholderId && "opacity-50"
                                    )}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center text-white">
                                            <Layers className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium text-sm text-foreground">Step 3</span>
                                        {selectedCommitteeType && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                                    </div>

                                    <FlowSelector
                                        label="Select Committee Type"
                                        placeholder="Choose committee type..."
                                        options={committeeTypeOptions}
                                        value={formData.committeeTypeId}
                                        onChange={(v) => updateFormData('committeeTypeId', v)}
                                        disabled={!formData.stakeholderId}
                                        icon={<Layers className="w-5 h-5" />}
                                        emptyMessage="No committee types available"
                                    />
                                </motion.div>

                                {/* Committee Selection */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className={cn(
                                        "bg-card rounded-xl border shadow-sm p-5 transition-opacity",
                                        !formData.committeeTypeId && "opacity-50"
                                    )}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                                            <Building className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium text-sm text-foreground">Step 4</span>
                                        {selectedCommittee && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                                    </div>

                                    {/* State filtering notice for SC admin */}
                                    {formData.stakeholderId && selectedStakeholder?.stakeholderType === 'STATE_COUNCIL' && (
                                        <Alert className="mb-3 py-2 bg-amber-50 border-amber-200">
                                            <MapPin className="h-3 w-3 text-amber-600" />
                                            <AlertDescription className="text-[11px] text-amber-700">
                                                Showing {currentUserContext.stakeholder.state?.stateName} committees only
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <FlowSelector
                                        label="Select Committee"
                                        placeholder="Choose specific committee..."
                                        options={committeeOptions}
                                        value={formData.committeeId}
                                        onChange={(v) => updateFormData('committeeId', v)}
                                        disabled={!formData.committeeTypeId}
                                        icon={<Building className="w-5 h-5" />}
                                        emptyMessage="Select committee type first"
                                    />
                                </motion.div>
                            </div>

                            {/* Role Selection - Full Width */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className={cn(
                                    "bg-card rounded-xl border shadow-sm p-5 mb-6 transition-opacity",
                                    !formData.committeeId && "opacity-50"
                                )}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center text-white">
                                        <UserCheck className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-medium text-sm text-foreground">Step 5 - Select Role(s)</span>
                                    <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0">Multi-Select</Badge>
                                    {formData.roleIds.length > 0 && (
                                        <Badge className="ml-auto bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                                            {formData.roleIds.length} selected
                                        </Badge>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                                    {availableRoles.map((role, index) => {
                                        const isSelected = formData.roleIds.includes(role.roleId);

                                        return (
                                            <motion.button
                                                key={role.roleId}
                                                type="button"
                                                onClick={() => formData.committeeId && updateFormData('roleIds', role.roleId)}
                                                disabled={!formData.committeeId}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.3 + index * 0.02 }}
                                                className={cn(
                                                    "relative p-3 rounded-lg text-left transition-all duration-200",
                                                    "border hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
                                                    isSelected
                                                        ? "border-primary bg-primary/5 shadow-sm"
                                                        : "border-border hover:border-primary/40 bg-background"
                                                )}
                                            >
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                                                    >
                                                        <CheckCircle2 className="w-2.5 h-2.5 text-primary-foreground" />
                                                    </motion.div>
                                                )}

                                                <p className={cn(
                                                    "font-medium text-xs mb-0.5",
                                                    isSelected ? "text-primary" : "text-foreground"
                                                )}>
                                                    {role.roleName}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground line-clamp-1">
                                                    {role.description}
                                                </p>
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {!formData.committeeId && (
                                    <p className="text-xs text-muted-foreground text-center mt-3">
                                        Select a committee to choose roles
                                    </p>
                                )}
                            </motion.div>

                            {/* Submit */}
                            <AnimatePresence>
                                {isFormComplete && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: 20, height: 0 }}
                                        className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl border-2 border-primary/20 p-5"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-end gap-5">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="validFrom" className="flex items-center gap-2 text-xs">
                                                        <Calendar className="w-3.5 h-3.5 text-primary" />
                                                        Valid From
                                                    </Label>
                                                    <Input
                                                        id="validFrom"
                                                        type="date"
                                                        value={formData.validFrom}
                                                        onChange={(e) => updateFormData('validFrom', e.target.value)}
                                                        className="bg-background h-9 text-sm"
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="validUntil" className="flex items-center gap-2 text-xs">
                                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                        Valid Until (Optional)
                                                    </Label>
                                                    <Input
                                                        id="validUntil"
                                                        type="date"
                                                        value={formData.validUntil}
                                                        onChange={(e) => updateFormData('validUntil', e.target.value)}
                                                        min={formData.validFrom}
                                                        className="bg-background h-9 text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                size="lg"
                                                onClick={submitForm}
                                                disabled={isSubmitting}
                                                className="gap-2 h-10 px-6 text-sm font-semibold rounded-lg shadow-lg shadow-primary/25 hover:shadow-xl transition-all whitespace-nowrap"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <motion.div
                                                            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        />
                                                        Creating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Create Assignment
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        <Separator className="my-4" />
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                                            <span>Assignment:</span>
                                            <span className="font-medium text-foreground">{selectedUser?.fullName}</span>
                                            <ArrowRight className="w-3 h-3" />
                                            <span className="font-medium text-foreground">{selectedRoles.map(r => r.roleName).join(', ')}</span>
                                            <ArrowRight className="w-3 h-3" />
                                            <span className="font-medium text-foreground truncate">{selectedCommittee?.committeeName}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <Footer />
        </div>
    );
}
