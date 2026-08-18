import React, { useState } from 'react';
import { 
  MessageSquare, UserCheck, BrainCircuit, 
  Send, AlertTriangle, CheckCircle2, TrendingUp, HelpCircle, ShieldAlert,
  Zap, Flame, Award, ChevronRight, RefreshCw, Layers
} from 'lucide-react';
import { PitchSimulationResponse, ForensicCompanyReport } from '../types';
import { API_BASE_URL } from '../api/config';

interface PitchSimulatorStudioProps {
  report: ForensicCompanyReport;
}

const ROLES = [
  'CEO / Founder',
  'CTO / VP Engineering',
  'Head of Product / CPO',
  'Chief Revenue Officer / VP Sales'
];

const SUGGESTED_PITCHES = [
  "We provide autonomous multi-agent developer infrastructure that accelerates engineering delivery cycles by 60% with zero downtime.",
  "We propose building a tailored AI workflow integration that cuts customer support ticket resolution times by 65% with custom fine-tuned models.",
  "We specialize in high-performance cloud architecture & database optimization that reduces AWS infra spend by 30% without downtime."
];

export const PitchSimulatorStudio: React.FC<PitchSimulatorStudioProps> = ({ report }) => {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [pitchText, setPitchText] = useState(SUGGESTED_PITCHES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [simulation, setSimulation] = useState<PitchSimulationResponse | null>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchText.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const resp = await fetch(`${API_BASE_URL}/api/simulate-pitch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: report.company_name,
          target_role: selectedRole,
          user_pitch_message: pitchText.trim(),
          dossier_id: report.id,
          context_summary: `Company: ${report.company_name}. Offerings: ${report.business?.what_they_sell?.join(', ') || 'Tech products'}. Tech: ${report.technology?.tech_stack?.frontend?.join(', ') || 'React'} / ${report.technology?.tech_stack?.backend?.join(', ') || 'Python'}.`
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        setSimulation(data);
      }
    } catch (err) {
      console.error("Pitch simulation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const score = simulation?.score_out_of_10 || 8;
  const isHigh = score >= 8;
  const isMedium = score >= 6 && score < 8;

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
              color: 'var(--purple-neon)',
              fontWeight: '900',
              fontSize: '1.05rem',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-heading)'
            }}>
              1. AI PITCH SIMULATOR STUDIO
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-heading)' }}>
            Practice. Predict. Perfect. • Roleplaying against <strong style={{ color: '#ffffff' }}>{report.company_name}</strong> leadership
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-purple" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
            ADVERSARIAL AI
          </span>
          <span className="badge badge-cyan" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
            NVIDIA NIM POWERED
          </span>
        </div>
      </div>

      {/* Main 2-Column Split Workbench */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.25fr)',
        gap: '20px',
        alignItems: 'start'
      }}>
        
        {/* ================= LEFT COLUMN: Pitch Input & Controls ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 1. Roleplay Selector */}
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
              Target Roleplay Persona:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {ROLES.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  style={{
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: selectedRole === role ? '1px solid var(--purple-neon)' : '1px solid var(--border-subtle)',
                    background: selectedRole === role ? 'rgba(168, 85, 247, 0.15)' : 'var(--bg-inset)',
                    color: selectedRole === role ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '0.76rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left'
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Pitch Textarea */}
          <form onSubmit={handleSimulate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                Your Value Pitch / Proposition:
              </label>
              <textarea
                rows={5}
                value={pitchText}
                onChange={(e) => setPitchText(e.target.value)}
                placeholder={`Draft your meeting pitch to ${report.company_name}'s ${selectedRole}...`}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  lineHeight: '1.5',
                  fontFamily: 'var(--font-heading)',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>

            {/* Suggested Quick Starters */}
            <div>
              <span style={{ fontSize: '0.66rem', color: 'var(--text-dim)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                Quick Pitch Starters:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {SUGGESTED_PITCHES.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPitchText(s)}
                    style={{
                      background: 'var(--bg-inset)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '5px',
                      padding: '5px 8px',
                      color: 'var(--text-muted)',
                      fontSize: '0.72rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      lineHeight: '1.35',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    "{s.substring(0, 75)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <button
              type="submit"
              disabled={isLoading || !pitchText.trim()}
              className="btn-radar"
              style={{
                width: '100%',
                height: '42px',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(7, 10, 19, 0.9) 100%)',
                borderColor: 'rgba(168, 85, 247, 0.5)',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '4px'
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} color="var(--purple-neon)" className="pulse" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ffffff' }}>Evaluating Executive Reaction...</span>
                </>
              ) : (
                <>
                  <Zap size={16} color="var(--purple-neon)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ffffff' }}>Analyze My Pitch</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* ================= RIGHT COLUMN: Simulated Executive Reaction ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* What They Say In The Room (Speech Bubble) */}
          <div style={{
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="var(--cyan-neon)" />
                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--cyan-neon)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  What They Say In The Room
                </h4>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>VERBAL RESPONSE</span>
            </div>
            <p style={{ fontSize: '0.84rem', lineHeight: '1.55', color: '#ffffff', fontStyle: 'italic' }}>
              "{simulation?.reply_message || `That's an interesting approach. How does this integrate with our current architecture, and what kind of measurable velocity improvements have you demonstrated in production?`}"
            </p>
          </div>

          {/* Secret Thought Monologue (Purple Glow Container) */}
          <div style={{
            background: 'rgba(168, 85, 247, 0.06)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BrainCircuit size={16} color="var(--purple-neon)" />
                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--purple-neon)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Secret Thought Monologue
                </h4>
              </div>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>PSYCHOLOGICAL MINDSET</span>
            </div>
            <p style={{ fontSize: '0.84rem', lineHeight: '1.55', color: 'var(--text-main)', fontStyle: 'italic' }}>
              "{simulation?.internal_thought_monologue || `This could genuinely solve our engineering bottleneck, but I need proof that they can handle enterprise security and won't add onboarding friction to our sprint cycle.`}"
            </p>
          </div>

          {/* Pitch Score Bar & Status */}
          <div style={{
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '14px 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={16} color={isHigh ? 'var(--green-neon)' : 'var(--amber-neon)'} />
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  Pitch Score: <span style={{ color: isHigh ? 'var(--green-neon)' : 'var(--amber-neon)', fontSize: '0.95rem' }}>{score}/10</span>
                </span>
              </div>
              <span className={`badge ${isHigh ? 'badge-green' : isMedium ? 'badge-amber' : 'badge-red'}`} style={{ fontSize: '0.65rem' }}>
                {isHigh ? 'STRONG PITCH' : isMedium ? 'NEUTRAL / PROMISING' : 'NEEDS REFINEMENT'}
              </span>
            </div>

            {/* Score Progress Bar */}
            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${score * 10}%`,
                height: '100%',
                background: isHigh 
                  ? 'linear-gradient(90deg, #00f0ff, #00ff88)' 
                  : 'linear-gradient(90deg, #ffb703, #ff3366)',
                borderRadius: '3px',
                transition: 'width 0.8s ease'
              }} />
            </div>
          </div>

          {/* Critical Objections */}
          <div style={{
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '14px 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertTriangle size={15} color="var(--amber-neon)" />
              <h4 style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--amber-neon)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Critical Objections Raised:
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(simulation?.critical_objections_raised && simulation.critical_objections_raised.length > 0 
                ? simulation.critical_objections_raised 
                : [
                    "How quickly can your solution be integrated into our production CI/CD pipeline?",
                    "What are the data privacy and security guarantees for proprietary codebase handling?",
                    "Can you provide verifiable case studies or references with similar scale?"
                  ]
              ).map((obj, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                  <span style={{ color: 'var(--amber-neon)', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>{idx + 1}.</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tactical Win-Tip (Gold / Amber Box) */}
          <div style={{
            background: 'rgba(255, 183, 3, 0.08)',
            border: '1px solid rgba(255, 183, 3, 0.35)',
            borderRadius: '10px',
            padding: '14px 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Award size={16} color="var(--amber-neon)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--amber-neon)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '2px' }}>
                  Tactical Win-Tip:
                </span>
                <p style={{ fontSize: '0.82rem', color: '#ffffff', lineHeight: '1.5' }}>
                  {simulation?.coaching_tip_for_next_round || `Propose a low-friction 14-day technical proof-of-concept with clear success metrics before asking for full enterprise commitment.`}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
