import { useRef, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Monitor,
    Users,
    FlaskConical,
    Plane,
    ShieldAlert,
    MoreHorizontal,
    Building,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Save,
    RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BUDGET_STEPS, BudgetMasterData } from '../types';
import BudgetEquipment from './steps/BudgetEquipment';
import BudgetPersonnel from './steps/BudgetPersonnel';
import BudgetConsumables from './steps/BudgetConsumables';
import BudgetTravel from './steps/BudgetTravel';
import BudgetContingency from './steps/BudgetContingency';
import BudgetOtherCost from './steps/BudgetOtherCost';
import BudgetOverhead from './steps/BudgetOverhead';

// Step icons mapping
const STEP_ICONS = {
    1: Monitor,
    2: Users,
    3: FlaskConical,
    4: Plane,
    5: ShieldAlert,
    6: MoreHorizontal,
    7: Building,
};

interface BudgetMasterProps {
    data: BudgetMasterData;
    updateData: <K extends keyof BudgetMasterData>(field: K, value: BudgetMasterData[K]) => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    onBack: () => void;
}

const BudgetMaster = ({ data, updateData, currentStep, setCurrentStep, onBack }: BudgetMasterProps) => {
    const progressBarRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [highestStepReached, setHighestStepReached] = useState(currentStep);

    // Check scroll state
    const checkProgressBarScroll = useCallback(() => {
        const el = progressBarRef.current;
        if (el) {
            setCanScrollLeft(el.scrollLeft > 0);
            setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
        }
    }, []);

    useEffect(() => {
        checkProgressBarScroll();
        window.addEventListener('resize', checkProgressBarScroll);
        return () => window.removeEventListener('resize', checkProgressBarScroll);
    }, [checkProgressBarScroll, currentStep]);

    const scrollProgressBar = (direction: 'left' | 'right') => {
        const el = progressBarRef.current;
        if (el) {
            const scrollAmount = 150;
            el.scrollTo({
                left: direction === 'left' ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
            setTimeout(checkProgressBarScroll, 350);
        }
    };

    const goToStep = (step: number) => {
        if (step <= highestStepReached || step === currentStep + 1) {
            setCurrentStep(step);
            if (step > highestStepReached) {
                setHighestStepReached(step);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const nextStep = () => {
        if (currentStep < BUDGET_STEPS.length) {
            goToStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    };

    const renderStepContent = () => {
        const commonProps = { data, updateData };

        switch (currentStep) {
            case 1:
                return <BudgetEquipment {...commonProps} />;
            case 2:
                return <BudgetPersonnel {...commonProps} />;
            case 3:
                return <BudgetConsumables {...commonProps} />;
            case 4:
                return <BudgetTravel {...commonProps} />;
            case 5:
                return <BudgetContingency {...commonProps} />;
            case 6:
                return <BudgetOtherCost {...commonProps} />;
            case 7:
                return <BudgetOverhead {...commonProps} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Proposal Details
                </Button>
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    Step {currentStep} of {BUDGET_STEPS.length}
                </span>
            </div>

            {/* Premium Progress Tracker */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-border p-4 overflow-hidden"
            >
                <div className="flex items-center gap-2">
                    {/* Left scroll button */}
                    {canScrollLeft && (
                        <button
                            onClick={() => scrollProgressBar('left')}
                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                        </button>
                    )}

                    {/* Progress bar container */}
                    <div
                        ref={progressBarRef}
                        onScroll={checkProgressBarScroll}
                        className="flex-1 overflow-x-auto scrollbar-hide"
                    >
                        <div className="flex items-center min-w-max gap-1">
                            {BUDGET_STEPS.map((step, index) => {
                                const isActive = step.id === currentStep;
                                const isCompleted = step.id < currentStep;
                                const isAccessible = step.id <= highestStepReached || step.id === currentStep + 1;
                                const StepIcon = STEP_ICONS[step.id as keyof typeof STEP_ICONS];

                                return (
                                    <div key={step.id} className="flex items-center">
                                        <motion.button
                                            onClick={() => isAccessible && goToStep(step.id)}
                                            disabled={!isAccessible}
                                            whileHover={isAccessible ? { scale: 1.02 } : {}}
                                            whileTap={isAccessible ? { scale: 0.98 } : {}}
                                            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${isActive
                                                ? 'bg-gradient-to-r from-accent to-accent-hover text-white shadow-lg shadow-accent/30'
                                                : isCompleted
                                                    ? 'bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer'
                                                    : isAccessible
                                                        ? 'bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer'
                                                        : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
                                                }`}
                                        >
                                            {/* Pulse animation for active step */}
                                            {isActive && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-xl bg-accent/20"
                                                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            )}

                                            <span className="relative flex items-center gap-2">
                                                {isCompleted ? (
                                                    <CheckCircle2 className="w-5 h-5" />
                                                ) : (
                                                    <StepIcon className="w-5 h-5" />
                                                )}
                                                <span className="text-sm font-medium hidden md:block">{step.title}</span>
                                                <span className="text-sm font-medium md:hidden">{step.shortTitle}</span>
                                            </span>
                                        </motion.button>

                                        {/* Connector line */}
                                        {index < BUDGET_STEPS.length - 1 && (
                                            <div className={`w-6 lg:w-10 h-1 mx-1 rounded-full transition-colors ${step.id < currentStep
                                                ? 'bg-primary'
                                                : step.id === currentStep
                                                    ? 'bg-gradient-to-r from-accent to-border'
                                                    : 'bg-border'
                                                }`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right scroll button */}
                    {canScrollRight && (
                        <button
                            onClick={() => scrollProgressBar('right')}
                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="bg-white rounded-2xl shadow-lg border border-border overflow-hidden"
                >
                    {/* Step Header */}
                    <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4">
                        <h2 className="text-xl font-display font-bold text-white">
                            {BUDGET_STEPS[currentStep - 1].title}
                        </h2>
                        <p className="text-white/70 text-sm mt-1">
                            Budget allocation for {BUDGET_STEPS[currentStep - 1].title.toLowerCase()}
                        </p>
                    </div>

                    {/* Step Form */}
                    <div className="p-6">
                        {renderStepContent()}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg border border-border p-4">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </Button>

                {currentStep < BUDGET_STEPS.length ? (
                    <Button onClick={nextStep} className="gap-2 bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/25">
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button className="gap-2 bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25">
                        <CheckCircle2 className="w-4 h-4" />
                        Submit Proposal
                    </Button>
                )}
            </div>
        </div>
    );
};

export default BudgetMaster;
