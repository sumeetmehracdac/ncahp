import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileText, Calculator, ChevronLeft, Save, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ProposalFormState, createInitialFormState, ProposalDetailsData, BudgetMasterData } from "./types";
import ProposalDetailsForm from "./components/ProposalDetailsForm";
import BudgetMaster from "./components/BudgetMaster";

// AIIMS Logo
import aiimsLogo from "@/assets/aiims-logo.png";

const AUTOSAVE_KEY = "proposal_submission_draft";

const ProposalSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [formState, setFormState] = useState<ProposalFormState>(createInitialFormState);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Update proposal details
  const updateProposalDetails = useCallback(
    <K extends keyof ProposalDetailsData>(field: K, value: ProposalDetailsData[K]) => {
      setFormState((prev) => ({
        ...prev,
        proposalDetails: { ...prev.proposalDetails, [field]: value },
      }));
      setHasUnsavedChanges(true);
    },
    [],
  );

  // Update budget master
  const updateBudgetMaster = useCallback(<K extends keyof BudgetMasterData>(field: K, value: BudgetMasterData[K]) => {
    setFormState((prev) => ({
      ...prev,
      budgetMaster: { ...prev.budgetMaster, [field]: value },
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Set current budget step
  const setCurrentBudgetStep = useCallback((step: number) => {
    setFormState((prev) => ({ ...prev, currentBudgetStep: step }));
  }, []);

  // Switch between screens
  const switchToScreen = (screen: "proposal" | "budget") => {
    setFormState((prev) => ({ ...prev, currentScreen: screen }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Manual save
  const handleManualSave = useCallback(() => {
    setIsSaving(true);
    // Serialize form data (excluding File objects)
    const serializableData = {
      proposalDetails: {
        ...formState.proposalDetails,
        endorsementLetter: formState.proposalDetails.endorsementLetter?.name || null,
        originalProposal: formState.proposalDetails.originalProposal?.name || null,
      },
      budgetMaster: formState.budgetMaster,
      currentScreen: formState.currentScreen,
      currentBudgetStep: formState.currentBudgetStep,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(serializableData));
    setHasUnsavedChanges(false);
    setIsSaving(false);
    toast({
      title: "Draft Saved Successfully",
      description: "Your progress has been saved. You can continue later.",
    });
  }, [formState, toast]);

  // Handle exit
  const handleExit = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowExitModal(true);
    } else {
      navigate("/");
    }
  }, [hasUnsavedChanges, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50/20">
      {/* Header - Deep Teal Navbar */}
      <header className="bg-primary border-b border-primary-dark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center gap-4">
              <img src={aiimsLogo} alt="AIIMS" className="h-12 w-auto" />
              <div className="hidden sm:block text-center">
                <h1 className="text-lg font-display font-semibold text-white">AIIMS</h1>
                <p className="text-xs text-white/80">All India Institute of Medical Sciences</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Screen Navigation Tabs */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 py-3">
            <button
              onClick={() => switchToScreen("proposal")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                formState.currentScreen === "proposal"
                  ? "bg-accent text-white shadow-lg shadow-accent/25"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Proposal Details</span>
              {formState.proposalDetails.totalOutlay && <CheckCircle2 className="w-4 h-4 text-green-300" />}
            </button>

            <div className="w-8 h-0.5 bg-border" />

            <button
              onClick={() => switchToScreen("budget")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                formState.currentScreen === "budget"
                  ? "bg-accent text-white shadow-lg shadow-accent/25"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Budget Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {formState.currentScreen === "proposal" ? (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ProposalDetailsForm
                data={formState.proposalDetails}
                updateData={updateProposalDetails}
                onContinue={() => switchToScreen("budget")}
              />
            </motion.div>
          ) : (
            <motion.div
              key="budget"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <BudgetMaster
                data={formState.budgetMaster}
                updateData={updateBudgetMaster}
                currentStep={formState.currentBudgetStep}
                setCurrentStep={setCurrentBudgetStep}
                onBack={() => switchToScreen("proposal")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowExitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Unsaved Changes</h3>
                  <p className="text-sm text-muted-foreground">You have unsaved changes that will be lost.</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Would you like to save your progress before leaving? You can continue later from where you left off.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem(AUTOSAVE_KEY);
                    navigate("/");
                  }}
                  className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/5"
                >
                  Discard & Exit
                </Button>
                <Button
                  onClick={() => {
                    handleManualSave();
                    setShowExitModal(false);
                    navigate("/");
                  }}
                  className="flex-1 bg-primary hover:bg-primary-dark"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save & Exit
                </Button>
              </div>

              <button
                onClick={() => setShowExitModal(false)}
                className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
              >
                Continue editing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProposalSubmission;
