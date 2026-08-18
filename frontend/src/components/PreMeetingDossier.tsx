import React, { useState } from 'react';
import { PreMeetingDossier as PreMeetingType } from '../types';
import { 
  Target, MessageSquare, AlertTriangle, 
  HelpCircle, Lightbulb, Check, Copy, TrendingUp, ShieldAlert, CheckCircle2,
  Zap, DollarSign, Layers, Flame, ChevronDown, ChevronUp
} from 'lucide-react';

interface PreMeetingDossierProps {
  data: PreMeetingType;
  companyName: string;
}

export const PreMeetingDossier: React.FC<PreMeetingDossierProps> = ({ data, companyName }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const visibleQuestions = showAllQuestions 
    ? data.smart_deep_questions 
    : data.smart_deep_questions.slice(0, 4);

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      background: 'var(--bg-card)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '14px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              color: 'var(--cyan-neon)',
              fontWeight: '900',
              fontSize: '1.05rem',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-heading)'
            }}>
              0. PRE-MEETING EXECUTIVE DOSSIER
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-heading)' }}>
            Your 30-Second Advantage to Win the Room • Target: <strong style={{ color: '#ffffff' }}>{companyName}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-purple" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
            CONFIDENTIAL BRIEFING
          </span>
          <span className="badge badge-cyan" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
            NVIDIA NIM SYNTHESIS
          </span>
        </div>
      </div>

      {/* 2-Column Split Master Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(340px, 1fr) minmax(360px, 1.15fr)',
        gap: '20px',
        alignItems: 'start'
      }}>
        
        {/* ================= LEFT COLUMN ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Executive Gameplan Summary */}
          <div style={{
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Target size={16} color="var(--cyan-neon)" />
              <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--cyan-neon)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Executive Gameplan Summary
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
              {data.meeting_gameplan_summary || `Position strategic value alignment, demonstrating how custom AI workflows and ergonomic developer tools can accelerate product execution velocity.`}
            </p>
          </div>

          {/* Icebreakers (Purple Glowing Dots) */}
          <div style={{
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={16} color="var(--purple-neon)" />
                <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--purple-neon)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Icebreakers & Conversational Warmers
                </h4>
              </div>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>HIGH RAPPORT</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.executive_icebreakers.map((ice, idx) => {
                const id = `ice-${idx}`;
                const isCopied = copiedId === id;
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '10px',
                    padding: '8px 10px',
                    background: 'rgba(168, 85, 247, 0.04)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--purple-neon)', display: 'inline-block', boxShadow: '0 0 6px #a855f7', marginTop: '6px', flexShrink: 0 }} />
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.45' }}>
                        {ice}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ice, id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: isCopied ? 'var(--green-neon)' : 'var(--text-dim)',
                        cursor: 'pointer',
                        padding: '2px',
                        flexShrink: 0
                      }}
                      title="Copy Icebreaker"
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Red Flags & Sensitive Landmines (Red Alert Box) */}
          <div style={{
            background: 'var(--red-soft)',
            border: '1px solid var(--red-border)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} color="var(--red-neon)" />
                <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--red-neon)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Red Flags & Sensitive Landmines
                </h4>
              </div>
              <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>DO NOT BRING UP</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.red_flags_and_landmines.map((flag, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '0.82rem',
                  color: '#f8fafc',
                  lineHeight: '1.45'
                }}>
                  <CheckCircle2 size={15} color="var(--green-neon)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Executive Talking Points (Green Checkmarks) */}
          <div style={{
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <MessageSquare size={16} color="var(--green-neon)" />
              <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--green-neon)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Executive Talking Points
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.executive_talking_points.map((pt, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '8px 10px',
                  background: 'rgba(0, 255, 136, 0.03)',
                  border: '1px solid rgba(0, 255, 136, 0.15)',
                  borderRadius: '8px'
                }}>
                  <CheckCircle2 size={16} color="var(--green-neon)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.45' }}>
                    {pt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Value Alignment Angles (Speed, Cost, Scale, Edge) */}
          <div style={{
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <TrendingUp size={16} color="var(--purple-neon)" />
              <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--purple-neon)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Value Alignment Angles
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {data.value_proposition_angles.map((angle, idx) => {
                const isSpeed = idx === 0 || angle.toLowerCase().includes('speed');
                const isCost = idx === 1 || angle.toLowerCase().includes('cost');
                const isScale = idx === 2 || angle.toLowerCase().includes('scale');

                return (
                  <div key={idx} style={{
                    padding: '8px 10px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    {isSpeed ? (
                      <Zap size={14} color="var(--cyan-neon)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    ) : isCost ? (
                      <DollarSign size={14} color="var(--green-neon)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    ) : isScale ? (
                      <Layers size={14} color="var(--purple-neon)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    ) : (
                      <Flame size={14} color="var(--amber-neon)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                      {angle}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 10x Deep Questions (Numbered List + Show More Collapsible) */}
          <div style={{
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={16} color="var(--cyan-neon)" />
                <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--cyan-neon)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  10x Deep Questions
                </h4>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>FOUNDER IMPRESSION</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {visibleQuestions.map((q, idx) => {
                const id = `q-${idx}`;
                const isCopied = copiedId === id;
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '10px',
                    padding: '8px 10px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{
                        color: 'var(--amber-neon)',
                        fontWeight: '800',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-mono)',
                        marginTop: '1px'
                      }}>
                        {idx + 1}.
                      </span>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.45' }}>
                        "{q}"
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(q, id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: isCopied ? 'var(--green-neon)' : 'var(--text-dim)',
                        cursor: 'pointer',
                        padding: '2px',
                        flexShrink: 0
                      }}
                      title="Copy Question"
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Show More Questions Button */}
            {data.smart_deep_questions.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllQuestions(!showAllQuestions)}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '8px',
                  borderRadius: '6px',
                  background: 'rgba(0, 240, 255, 0.08)',
                  border: '1px solid rgba(0, 240, 255, 0.25)',
                  color: 'var(--cyan-neon)',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                {showAllQuestions ? (
                  <>
                    <ChevronUp size={14} />
                    <span>Collapse Questions</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    <span>Show {data.smart_deep_questions.length - 4} More Questions</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
