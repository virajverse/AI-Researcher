import React from 'react';
import { 
  History, Scale, Download, 
  Cpu, ChevronDown, CheckCircle2, Globe, Flame, ShieldCheck, Zap
} from 'lucide-react';

interface HeaderProps {
  activeModel: string;
  onModelChange: (model: string) => void;
  availableModels: string[];
  onOpenHistory: () => void;
  onOpenCompare: () => void;
  onOpenExport: () => void;
  hasActiveReport: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeModel,
  onModelChange,
  availableModels,
  onOpenHistory,
  onOpenCompare,
  onOpenExport,
  hasActiveReport,
}) => {
  return (
    <header style={{
      background: '#070a14',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '14px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & Identity (Left) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="/logo.png" 
            alt="VirajVerse Logo" 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              objectFit: 'cover',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              boxShadow: '0 0 12px rgba(0, 240, 255, 0.3)'
            }} 
          />
          <span style={{
            fontSize: '1.15rem',
            fontWeight: '900',
            letterSpacing: '-0.02em',
            color: 'var(--cyan-neon)',
            fontFamily: 'var(--font-heading)'
          }}>
            VIRAJVERSE
          </span>
        </div>

        <div style={{
          height: '18px',
          width: '1px',
          background: 'var(--border-subtle)',
          margin: '0 4px'
        }} />

        <span style={{
          fontSize: '0.82rem',
          fontWeight: '700',
          letterSpacing: '0.04em',
          color: '#ffffff',
          fontFamily: 'var(--font-heading)'
        }}>
          PART 6: FORENSIC AI COMPANY RESEARCHER
        </span>

        {/* 3 Engine Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
          <div className="badge badge-cyan" style={{ fontSize: '0.66rem' }}>
            <Cpu size={12} /> NVIDIA NIM
          </div>
          <div className="badge badge-purple" style={{ fontSize: '0.66rem' }}>
            <Globe size={12} /> PLAYWRIGHT
          </div>
          <div className="badge badge-amber" style={{ fontSize: '0.66rem' }}>
            <Flame size={12} /> FIRECRAWL
          </div>
        </div>
      </div>

      {/* Controls & Actions (Right) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        
        {/* Model Switcher Dropdown */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-inset)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '4px 10px',
          height: '32px'
        }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: '600' }}>MODEL:</span>
          <select
            value={activeModel}
            onChange={(e) => onModelChange(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--cyan-neon)',
              fontSize: '0.74rem',
              fontWeight: '700',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {availableModels.map(m => (
              <option key={m} value={m} style={{ background: '#0a1120', color: '#ffffff' }}>
                {m.replace('meta/', '').replace('deepseek-ai/', '')}
              </option>
            ))}
          </select>
        </div>

        {/* History Vault Button */}
        <button
          type="button"
          onClick={onOpenHistory}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '6px 12px',
            color: 'var(--text-main)',
            fontSize: '0.78rem',
            fontWeight: '600',
            cursor: 'pointer',
            height: '32px',
            transition: 'all 0.15s ease'
          }}
          className="hover-glow"
        >
          <History size={14} color="var(--text-muted)" />
          <span>History Vault</span>
        </button>

        {/* Compare Companies Button */}
        <button
          type="button"
          onClick={onOpenCompare}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '6px 12px',
            color: 'var(--text-main)',
            fontSize: '0.78rem',
            fontWeight: '600',
            cursor: 'pointer',
            height: '32px',
            transition: 'all 0.15s ease'
          }}
          className="hover-glow"
        >
          <Scale size={14} color="var(--text-muted)" />
          <span>Compare Companies</span>
        </button>

        {/* Export Dossier Glowing CTA */}
        {hasActiveReport && (
          <button
            type="button"
            onClick={onOpenExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(7, 10, 19, 0.9) 100%)',
              border: '1px solid var(--purple-border)',
              borderRadius: '8px',
              padding: '6px 14px',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: '800',
              cursor: 'pointer',
              height: '32px',
              boxShadow: '0 0 14px rgba(168, 85, 247, 0.3)',
              transition: 'all 0.15s ease'
            }}
            className="hover-glow"
          >
            <Download size={14} color="var(--purple-neon)" />
            <span>Export Dossier</span>
          </button>
        )}

      </div>
    </header>
  );
};
