import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CategoryMapping from "./pages/CategoryMapping";
import Announcements from "./pages/Announcements.jsx";
import AnnouncementSubmit from "./pages/AnnouncementSubmit.jsx";
import AnnouncementDetail from "./pages/AnnouncementDetail.jsx";
import QualificationProfessionManagement from "./pages/QualificationProfessionManagement.jsx";
import ProfessionIconsGallery from "./pages/ProfessionIconsGallery.jsx";
import PermanentRegistration from "./pages/PermanentRegistration";
import ProvisionalRegistration from "./pages/ProvisionalRegistration";
import CommitteeProfessionMapping from "./pages/CommitteeProfessionMapping";
import AdditionalRegistration from "./pages/AdditionalRegistration";
import ProposalSubmission from "./pages/ProposalSubmission";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/category-subcategory-profession-mapping" element={<CategoryMapping />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/announcements/:id" element={<AnnouncementDetail />} />
          <Route path="/announcements/submit" element={<AnnouncementSubmit />} />
          <Route path="/qualification-profession-management" element={<QualificationProfessionManagement />} />
          <Route path="/profession-icons" element={<ProfessionIconsGallery />} />
          <Route path="/permanent-registration" element={<PermanentRegistration />} />
          <Route path="/provisional-registration" element={<ProvisionalRegistration />} />
          <Route path="/committee-profession-mapping" element={<CommitteeProfessionMapping />} />
          <Route path="/additional-registration" element={<AdditionalRegistration />} />
          <Route path="/proposal-submission" element={<ProposalSubmission />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
