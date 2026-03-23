import { useState } from 'react';
import NCAHPLoader from '@/components/ui/NCAHPLoader';
import NCAHPLoaderDNA from '@/components/ui/NCAHPLoaderDNA';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type LoaderType = 'ecg' | 'dna';

const loaders: { id: LoaderType; label: string; description: string }[] = [
  { id: 'ecg', label: '① ECG Pulse (Winner)', description: 'Heartbeat trace with scanning dot — the primary loader.' },
  { id: 'dna', label: '② DNA Helix', description: 'Double-strand helix with swinging teal & orange nodes.' },
];

const LoaderDemo = () => {
  const navigate = useNavigate();
  const [activeOverlay, setActiveOverlay] = useState<{ type: LoaderType; variant: 'overlay' | 'fullPage' } | null>(null);

  const renderLoader = (type: LoaderType, variant: 'inline' | 'overlay' | 'fullPage', msg?: string) => {
    const props = { variant, message: msg } as const;
    switch (type) {
      case 'ecg': return <NCAHPLoader {...props} />;
      case 'dna': return <NCAHPLoaderDNA {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 p-6 md:p-12 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">NCAHP Loader Concepts</h1>
          <p className="text-sm text-muted-foreground">Winner + two runner-ups — all three variants</p>
        </div>
      </div>

      {loaders.map(({ id, label, description }) => (
        <section key={id} className="rounded-xl border bg-card p-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{label}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Inline preview */}
          <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-4">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">Inline variant</p>
            {renderLoader(id, 'inline', 'Loading records…')}
          </div>

          {/* Overlay triggers */}
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => setActiveOverlay({ type: id, variant: 'overlay' })}>
              Show Overlay
            </Button>
            <Button size="sm" onClick={() => setActiveOverlay({ type: id, variant: 'fullPage' })}>
              Show Full Page
            </Button>
          </div>
        </section>
      ))}

      {/* Active overlay */}
      {activeOverlay && (
        <div onClick={() => setActiveOverlay(null)} className="cursor-pointer">
          {renderLoader(
            activeOverlay.type,
            activeOverlay.variant,
            activeOverlay.variant === 'overlay' ? 'Processing request…' : 'Initialising platform…',
          )}
        </div>
      )}
    </div>
  );
};

export default LoaderDemo;
