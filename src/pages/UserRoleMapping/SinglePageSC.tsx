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
    Info,
    ListOrdered,
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
import { ProgressRing } from './components/ProgressRing';
import { FlowSummary } from './components/FlowSummary';
import { useSinglePageForm } from './hooks/useSinglePageForm';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-32 w-full rounded-2xl mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-48 rounded-xl" />
                    <Skeleton className="h-48 rounded-xl" />
                    <Skeleton className="h-48 rounded-xl" />
                    <Skeleton className="h-48 rounded-xl" />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default function SinglePageSC() {
    const [isLoading, setIsLoading] = useState(true);

    // Use SC (State Council) admin context
    const {
        formData,
        isSubmitting,
        submitSuccess,
        currentUserContext,
        adminType,
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
        const timer = setTimeout(() => setIsLoading(false), 600);
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

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30">
            <Header />

            {/* Compact Hero */}
            <section className="relative bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                <div className="container mx-auto px-6 py-10 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                                    <Link2 className="h-5 w-5" />
                                </div>
                                <Badge variant="secondary" className="bg-emerald-800 text-white border-0 text-xs gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {currentUserContext.stakeholder.state?.stateName || 'State'} Council Admin
                                </Badge>
                                <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                                    Single-Page Flow
                                </Badge>
                                <Link
                                    to="/user-role-mapping/single-page/ho"
                                    className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <Shield className="w-3.5 h-3.5" />
                                    View as HO Admin
                                </Link>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-3">
                                User-Role-Committee Mapping
                            </h1>
                            <p className="text-sm text-white/95 max-w-lg leading-relaxed">
                                As State Council Admin, you can assign users to roles in <strong>State Council</strong> and <strong>External</strong> stakeholder types only.
                            </p>
                        </motion.div>

                        {/* Stats & Progress */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-6"
                        >
                            <div className="hidden md:flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                                    <Users className="h-4 w-4" />
                                    <span>{availableUsers.length} Users</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                                    <Building className="h-4 w-4" />
                                    <span>{availableCommittees.length}+ Committees</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl">
                                <ProgressRing progress={progress.percentage} size={48} strokeWidth={4} />
                                <div className="text-sm">
                                    <p className="font-semibold">{progress.completed}/5 Complete</p>
                                    <p className="text-white/70 text-xs">Steps completed</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* RBAC Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="mt-4"
                    >
                        <Alert className="bg-amber-500/20 border-amber-400/30 text-white">
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                                <strong>RBAC Restriction:</strong> NCAHP Head Office stakeholder type is not available for State Council admins.
                            </AlertDescription>
                        </Alert>
                    </motion.div>

                    {/* Flow Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 pt-6 border-t border-white/20"
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
            <section className="container mx-auto px-6 py-10">
                <AnimatePresence mode="wait">
                    {submitSuccess ? (
                        /* Success State */
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-2xl mx-auto text-center py-16"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                className="relative inline-block mb-6"
                            >
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="absolute -top-2 -right-2"
                                >
                                    <PartyPopper className="w-8 h-8 text-amber-500" />
                                </motion.div>
                            </motion.div>

                            <h2 className="text-3xl font-serif font-bold text-foreground mb-3">
                                Assignment Created!
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                <strong className="text-foreground">{selectedUser?.fullName}</strong> has been assigned as{' '}
                                <strong className="text-foreground">{selectedRoles.map(r => r.roleName).join(', ')}</strong> to{' '}
                                <strong className="text-foreground">{selectedCommittee?.committeeName}</strong>.
                            </p>

                            <div className="flex items-center justify-center gap-4">
                                <Button variant="outline" size="lg" className="gap-2">
                                    <Eye className="w-4 h-4" />
                                    View All Mappings
                                </Button>
                                <Button size="lg" onClick={resetForm} className="gap-2">
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                                {/* User Selection */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-card rounded-2xl border shadow-sm p-6"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-foreground">Step 1</span>
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

                                {/* Stakeholder Selection - SC Admin sees only SC + External */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className={cn(
                                        "bg-card rounded-2xl border shadow-sm p-6 transition-opacity",
                                        !formData.userId && "opacity-60"
                                    )}
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-foreground">Step 2</span>
                                        <Badge variant="outline" className="ml-2 text-xs bg-amber-50 text-amber-700 border-amber-200">
                                            SC + EXT only
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
                                        "bg-card rounded-2xl border shadow-sm p-6 transition-opacity",
                                        !formData.stakeholderId && "opacity-60"
                                    )}
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center text-white">
                                            <Layers className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-foreground">Step 3</span>
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
                                        emptyMessage="No committee types for selected stakeholder"
                                    />
                                </motion.div>

                                {/* Committee Selection */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className={cn(
                                        "bg-card rounded-2xl border shadow-sm p-6 transition-opacity",
                                        !formData.committeeTypeId && "opacity-60"
                                    )}
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                                            <Building className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-foreground">Step 4</span>
                                        {selectedCommittee && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                                    </div>

                                    {/* State filtering notice for SC admin */}
                                    {formData.stakeholderId && selectedStakeholder?.stakeholderType === 'STATE_COUNCIL' && (
                                        <Alert className="mb-4 py-2 bg-amber-50 border-amber-200">
                                            <MapPin className="h-3.5 w-3.5 text-amber-600" />
                                            <AlertDescription className="text-xs text-amber-700">
                                                Showing committees for {currentUserContext.stakeholder.state?.stateName} only
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

                            {/* Role Selection - Full Width, Multi-Select */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className={cn(
                                    "bg-card rounded-2xl border shadow-sm p-6 mb-10 transition-opacity",
                                    !formData.committeeId && "opacity-60"
                                )}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white">
                                        <UserCheck className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-foreground">Step 5 - Select Role(s)</span>
                                    <Badge variant="outline" className="ml-2 text-xs">Multi-Select</Badge>
                                    {formData.roleIds.length > 0 && (
                                        <Badge className="ml-auto bg-emerald-100 text-emerald-700 border-emerald-200">
                                            {formData.roleIds.length} selected
                                        </Badge>
                                    )}
                                </div>

                                {/* Role Grid - Multi-Select */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                                                transition={{ delay: 0.3 + index * 0.03 }}
                                                className={cn(
                                                    "relative p-4 rounded-xl text-left transition-all duration-200",
                                                    "border-2 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
                                                    isSelected
                                                        ? "border-emerald-500 bg-emerald-50 shadow-md"
                                                        : "border-border hover:border-emerald-500/50 bg-background"
                                                )}
                                            >
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
                                                    >
                                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                                    </motion.div>
                                                )}

                                                <p className={cn(
                                                    "font-medium text-sm mb-1",
                                                    isSelected ? "text-emerald-700" : "text-foreground"
                                                )}>
                                                    {role.roleName}
                                                </p>
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {role.description}
                                                </p>
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {!formData.committeeId && (
                                    <p className="text-sm text-muted-foreground text-center mt-4">
                                        Select a committee to choose roles
                                    </p>
                                )}
                            </motion.div>

                            {/* Validity & Submit */}
                            <AnimatePresence>
                                {isFormComplete && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: 20, height: 0 }}
                                        className="bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-emerald-50 rounded-2xl border-2 border-emerald-200 p-6"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
                                            {/* Validity Inputs */}
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="validFrom" className="flex items-center gap-2 text-sm">
                                                        <Calendar className="w-4 h-4 text-emerald-600" />
                                                        Valid From
                                                    </Label>
                                                    <Input
                                                        id="validFrom"
                                                        type="date"
                                                        value={formData.validFrom}
                                                        onChange={(e) => updateFormData('validFrom', e.target.value)}
                                                        className="bg-background"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="validUntil" className="flex items-center gap-2 text-sm">
                                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                                        Valid Until (Optional)
                                                    </Label>
                                                    <Input
                                                        id="validUntil"
                                                        type="date"
                                                        value={formData.validUntil}
                                                        onChange={(e) => updateFormData('validUntil', e.target.value)}
                                                        min={formData.validFrom}
                                                        className="bg-background"
                                                        placeholder="Indefinite"
                                                    />
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <Button
                                                size="lg"
                                                onClick={submitForm}
                                                disabled={isSubmitting}
                                                className="gap-2 h-12 px-8 text-base font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all whitespace-nowrap"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <motion.div
                                                            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        />
                                                        Creating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-5 h-5" />
                                                        Create Assignment
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        {/* Summary Preview */}
                                        <Separator className="my-4" />
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
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
