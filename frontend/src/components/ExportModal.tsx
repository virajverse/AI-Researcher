import React from 'react';
import { ForensicCompanyReport } from '../types';
import { X, FileText, Code2, Printer, Download, Check, ShieldCheck, Zap } from 'lucide-react';
import { API_BASE_URL } from '../api/config';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ForensicCompanyReport | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  const downloadMarkdown = () => {
    fetch(`${API_BASE_URL}/api/export/${report.id}/markdown`)
      .then(res => res.text())
      .then(text => {
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Forensic_Dossier_${report.company_name.replace(/\s+/g, '_')}_${report.id}.md`;
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  const downloadJSON = () => {
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Forensic_Report_${report.company_name.replace(/\s+/g, '_')}_${report.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, right: 0, bottom: 0, left: 0,
      background: 'rgba(5, 8, 16, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.2s ease'
    }}
    onClick={onClose}
    >
      <div style={{
        width: '100%',
        maxWidth: '520px',
        background: '#090f1d',
        border: '1px solid rgba(168, 85, 247, 0.35)',
        borderRadius: '14px',
        boxShadow: '0 0 40px rgba(168, 85, 247, 0.15)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        boxSizing: 'border-box'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Download size={16} color="var(--purple-neon)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                Export Intelligence Dossier
              </h3>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                Target: {report.company_name} (#{report.id})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px 8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Export Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Markdown Option */}
          <div 
            onClick={downloadMarkdown}
            style={{
              padding: '14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease'
            }}
            className="hover-glow"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--cyan-neon)';
              e.currentTarget.style.background = '#0d1526';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan-neon)'
              }}>
                <FileText size={18} />
              </div>
              <div>
                <h5 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff' }}>
                  Markdown Document (.md)
                </h5>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
                  Structured report for Notion, Obsidian & GitHub.
                </p>
              </div>
            </div>
            <Download size={15} color="var(--text-dim)" />
          </div>

          {/* JSON Option */}
          <div 
            onClick={downloadJSON}
            style={{
              padding: '14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease'
            }}
            className="hover-glow"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--purple-neon)';
              e.currentTarget.style.background = '#0d1526';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--purple-neon)'
              }}>
                <Code2 size={18} />
              </div>
              <div>
                <h5 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff' }}>
                  JSON Intelligence Schema (.json)
                </h5>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
                  Raw forensic payloads for programmatic automation.
                </p>
              </div>
            </div>
            <Download size={15} color="var(--text-dim)" />
          </div>

          {/* PDF Option */}
          <div 
            onClick={triggerPrint}
            style={{
              padding: '14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease'
            }}
            className="hover-glow"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--green-neon)';
              e.currentTarget.style.background = '#0d1526';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--green-neon)'
              }}>
                <Printer size={18} />
              </div>
              <div>
                <h5 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff' }}>
                  Printable PDF Briefing
                </h5>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
                  High-resolution executive print dossier.
                </p>
              </div>
            </div>
            <Download size={15} color="var(--text-dim)" />
          </div>

        </div>
      </div>
    </div>
  );
};
