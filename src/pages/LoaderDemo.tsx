import { useState } from 'react';
import NCAHPLoader from '@/components/ui/NCAHPLoader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const variants = ['inline', 'overlay', 'fullPage'] as const;

const LoaderDemo = () => {
  const navigate = useNavigate();
  const [activeOverlay, setActiveOverlay] = useState<'overlay' | 'fullPage' | null>(null);

  return (
    <div className="min-h-screen bg-muted/40 p-6 md:p-12 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">NCAHPLoader Demo</h1>
          <p className="text-sm text-muted-foreground">All three variants in isolation</p>
        </div>
      </div>

      {/* Inline variant */}
      <section className="rounded-xl border bg-card p-8 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Inline</h2>
        <p className="text-sm text-muted-foreground">Compact — for use inside cards or sections.</p>
        <NCAHPLoader variant="inline" message="Loading records…" />
      </section>

      {/* Trigger buttons for overlay variants */}
      <section className="rounded-xl border bg-card p-8 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Overlay & Full Page</h2>
        <p className="text-sm text-muted-foreground">Click a button to trigger. Click anywhere to dismiss.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setActiveOverlay('overlay')}>
            Show Overlay
          </Button>
          <Button onClick={() => setActiveOverlay('fullPage')}>
            Show Full Page
          </Button>
        </div>
      </section>

      {/* Overlay / FullPage when active */}
      {activeOverlay && (
        <div onClick={() => setActiveOverlay(null)} className="cursor-pointer">
          <NCAHPLoader
            variant={activeOverlay}
            message={activeOverlay === 'overlay' ? 'Processing request…' : 'Initialising platform…'}
          />
        </div>
      )}
    </div>
  );
};

export default LoaderDemo;
