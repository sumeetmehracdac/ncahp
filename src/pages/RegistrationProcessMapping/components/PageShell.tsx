import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, GitBranch, Layers } from 'lucide-react';

const navItems = [
  {
    path: '/registration-process-mapping/application',
    label: 'Application-Process Mapping',
    icon: Layers,
    description: 'Default process flow per registration type',
  },
  {
    path: '/registration-process-mapping/profession',
    label: 'Profession-Process Mapping',
    icon: GitBranch,
    description: 'Profession-specific process overrides',
  },
];

export function PageShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--muted))' }}>
      {/* Top Bar */}
      <div style={{ background: 'hsl(var(--primary))', borderBottom: '1px solid hsl(var(--primary-dark))' }}>
        <div className="max-w-screen-xl mx-auto px-6 py-0">
          <div className="flex items-center gap-3 py-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm font-medium rounded px-2 py-1 transition-colors"
              style={{ color: 'hsl(var(--primary-foreground) / 0.75)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'hsl(var(--primary-foreground))')}
              onMouseLeave={e => (e.currentTarget.style.color = 'hsl(var(--primary-foreground) / 0.75)')}
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <span style={{ color: 'hsl(var(--primary-foreground) / 0.4)' }}>|</span>
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'hsl(var(--primary-foreground) / 0.6)' }}>
                NCAHP Admin Console
              </span>
              <span className="mx-2" style={{ color: 'hsl(var(--primary-foreground) / 0.4)' }}>·</span>
              <span className="text-xs font-medium" style={{ color: 'hsl(var(--primary-foreground) / 0.85)' }}>
                Registration System
              </span>
            </div>
          </div>
          {/* Sub-nav */}
          <div className="flex items-end gap-1">
            {navItems.map(item => {
              const active = pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t transition-all border-b-2"
                  style={{
                    borderBottomColor: active ? 'hsl(var(--accent))' : 'transparent',
                    color: active ? 'hsl(var(--primary-foreground))' : 'hsl(var(--primary-foreground) / 0.6)',
                    background: active ? 'hsl(var(--primary-foreground) / 0.08)' : 'transparent',
                  }}
                >
                  <Icon size={14} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}
