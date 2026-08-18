import React, { useState, useEffect } from 'react';
import { DossierSummary, ForensicCompanyReport } from '../types';
import { 
  X, Scale, ArrowRight, Building, DollarSign, 
  Cpu, Shield, AlertTriangle, Users, BrainCircuit, Code2, TrendingUp,
  ShieldCheck, Swords, Zap, CheckCircle2, ChevronRight
} from 'lucide-react';
import { API_BASE_URL } from '../api/config';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentReport: ForensicCompanyReport | null;
}

export const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose, currentReport }) => {
  const [dossiers, setDossiers] = useState<DossierSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [compareReport, setCompareReport] = useState<ForensicCompanyReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE_URL}/api/dossiers`)
        .then(res => res.json())
        .then(data => {
          setDossiers(data);
          if (data.length > 0 && (!currentReport || data[0].id !== currentReport.id)) {
            setSelectedId(data[0].id);
          } else if (data.length > 1) {
            setSelectedId(data[1].id);
          }
        })
        .catch(err => console.error(err));
    }
  }, [isOpen, currentReport]);

  useEffect(() => {
    if (selectedId) {
      setLoading(true);
      fetch(`${API_BASE_URL}/api/dossiers/${selectedId}`)
        .then(res => res.json())
        .then(data => {
          setCompareReport(data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [selectedId]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, right: 0, bottom: 0, left: 0,
      background: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      animation: 'fadeIn 0.2s ease'
    }}
    onClick={onClose}
    >
      <div style={{
        width: '100%',
        maxWidth: '1020px',
        maxHeight: '90vh',
        background: '#090f1d',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        borderRadius: '14px',
        boxShadow: '0 0 50px rgba(0, 240, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Scale size={18} color="var(--purple-neon)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                FORENSIC COMPETITIVE COMPARISON MATRIX
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                Side-by-Side Architectural, Revenue & Market Moat Benchmarking
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
            <X size={15} />
          </button>
        </div>

        {/* Company Selectors Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 50px 1fr',
          gap: '14px',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '16px',
          background: 'var(--bg-inset)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px'
        }}>
          {/* Left: Primary Entity */}
          <div style={{
            padding: '12px 14px',
            background: 'rgba(0, 240, 255, 0.05)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            borderRadius: '8px'
          }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--cyan-neon)', display: 'block', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              PRIMARY TARGET (ENTITY 1):
            </span>
            <h4 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#ffffff', marginTop: '2px', fontFamily: 'var(--font-heading)' }}>
              {currentReport?.company_name || 'No Target Loaded'}
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {currentReport?.basic?.industry?.primary || 'Enterprise Software'}
            </span>
          </div>

          {/* Center VS Emblem */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '1px solid var(--purple-border)',
            boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)',
            justifySelf: 'center'
          }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '900', color: 'var(--purple-neon)', fontFamily: 'var(--font-mono)' }}>
              VS
            </span>
          </div>

          {/* Right: Compare Target Selector */}
          <div style={{
            padding: '12px 14px',
            background: 'rgba(168, 85, 247, 0.05)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '8px'
          }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--purple-neon)', display: 'block', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              COMPARE AGAINST (ENTITY 2):
            </span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              style={{
                width: '100%',
                marginTop: '4px',
                padding: '6px 10px',
                background: '#070a14',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontWeight: '700',
                fontFamily: 'var(--font-heading)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {dossiers.map(d => (
                <option key={d.id} value={d.id} style={{ background: '#090f1d', color: '#ffffff' }}>
                  {d.company_name} ({d.industry || 'Technology'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Comparison Metrics Grid */}
        {currentReport && compareReport ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            
            {/* Metric Row: Headcount & Stage */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              gap: '12px',
              padding: '12px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: '800', fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} color="var(--cyan-neon)" /> Headcount & Team Size
              </span>
              <span style={{ fontSize: '0.84rem', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {currentReport.basic?.size?.headcount || '11-50'}
              </span>
              <span style={{ fontSize: '0.84rem', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {compareReport.basic?.size?.headcount || '11-50'}
              </span>
            </div>

            {/* Metric Row: Revenue Model */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              gap: '12px',
              padding: '12px 14px',
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: '800', fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={14} color="var(--green-neon)" /> Monetization Architecture
              </span>
              <span className="badge badge-green" style={{ justifySelf: 'start', fontSize: '0.72rem' }}>
                {currentReport.business?.revenue_model?.model_type || 'Project-Based Services'}
              </span>
              <span className="badge badge-green" style={{ justifySelf: 'start', fontSize: '0.72rem' }}>
                {compareReport.business?.revenue_model?.model_type || 'SaaS Subscription'}
              </span>
            </div>

            {/* Metric Row: AI Architecture */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              gap: '12px',
              padding: '12px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: '800', fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BrainCircuit size={14} color="var(--purple-neon)" /> AI Maturity Rating
              </span>
              <span className="badge badge-purple" style={{ justifySelf: 'start', fontSize: '0.72rem' }}>
                {currentReport.technology?.ai_usage?.ai_maturity_rating || 'Advanced'}
              </span>
              <span className="badge badge-purple" style={{ justifySelf: 'start', fontSize: '0.72rem' }}>
                {compareReport.technology?.ai_usage?.ai_maturity_rating || 'Emerging'}
              </span>
            </div>

            {/* Metric Row: Core Frontend */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              gap: '12px',
              padding: '12px 14px',
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: '800', fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code2 size={14} color="var(--cyan-neon)" /> Core Tech Stack
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--cyan-neon)', fontFamily: 'var(--font-mono)' }}>
                {currentReport.technology?.tech_stack?.frontend?.slice(0, 3)?.join(', ') || 'React'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--purple-neon)', fontFamily: 'var(--font-mono)' }}>
                {compareReport.technology?.tech_stack?.frontend?.slice(0, 3)?.join(', ') || 'Next.js'}
              </span>
            </div>

            {/* Metric Row: Funding */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              gap: '12px',
              padding: '12px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: '800', fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={14} color="var(--amber-neon)" /> Total Capital Raised
              </span>
              <span style={{ fontWeight: '800', color: 'var(--green-neon)', fontSize: '0.84rem' }}>
                {currentReport.strategy?.funding?.total_raised || 'Bootstrapped'}
              </span>
              <span style={{ fontWeight: '800', color: 'var(--green-neon)', fontSize: '0.84rem' }}>
                {compareReport.strategy?.funding?.total_raised || 'Bootstrapped'}
              </span>
            </div>

            {/* Metric Row: Top Moats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              gap: '12px',
              padding: '12px 14px',
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              alignItems: 'start'
            }}>
              <span style={{ fontWeight: '800', fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Swords size={14} color="var(--purple-neon)" /> Defensible Moats
              </span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                {currentReport.competitive_landscape?.differentiators_and_moat?.[0] || 'Proprietary data integration and low latency.'}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                {compareReport.competitive_landscape?.differentiators_and_moat?.[0] || 'Developer-first ergonomics and rapid onboarding.'}
              </p>
            </div>

          </div>
        ) : (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Scale size={32} color="var(--text-dim)" />
            <p style={{ fontSize: '0.88rem' }}>
              Select a second company from the dropdown above to view live side-by-side comparison.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
