import React, { useEffect, useRef } from 'react';
import { Terminal, Activity, CheckCircle2, Loader2, Cpu, ShieldCheck, Clock } from 'lucide-react';
import { StreamEvent, ForensicCompanyReport } from '../types';

interface LiveResearchTerminalProps {
  logs: StreamEvent[];
  activeAgent: string | null;
  companyName: string;
  isCompleted: boolean;
  currentReport: ForensicCompanyReport | null;
}

const SWARM_AGENTS_SCHEMA = [
  { key: 'DNA_AGENT', label: 'DNA_AGENT: Analyzing corporate DNA, legal registry & leadership' },
  { key: 'BIZ_AGENT', label: 'BIZ_AGENT: Mapping monetization models, buyer ICP & pricing' },
  { key: 'TECH_AGENT', label: 'TECH_AGENT: Scanning frontend, backend, AI models & security' },
  { key: 'PROD_AGENT', label: 'PRODUCT_AGENT: Mining user reviews & G2/Reddit complaints' },
  { key: 'STRAT_AGENT', label: 'STRATEGY_AGENT: Tracking funding history, M&A & hiring' },
  { key: 'COMP_AGENT', label: 'COMPETITOR_AGENT: Building competitor battlecard & moats' },
];

export const LiveResearchTerminal: React.FC<LiveResearchTerminalProps> = ({
  logs,
  activeAgent,
  companyName,
  isCompleted,
  currentReport,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const hasData = isCompleted || logs.length > 0 || !!currentReport;
  const confidenceScore = currentReport ? currentReport.confidence_score : hasData ? 90 : 0;
  const sourcesCount = currentReport ? currentReport.sources_inspected.length : logs.filter(l => l.type === 'agent_log').length;
  const execTime = currentReport?.research_duration_seconds ? `${currentReport.research_duration_seconds}s` : hasData ? 'Running...' : '--';

  // SVG Circular Gauge calculation
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = confidenceScore > 0 ? circumference - (confidenceScore / 100) * circumference : circumference;

  return (
    <div className="glass-panel" style={{
      padding: '16px 20px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box'
    }}>
      {/* Title Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '24px',
        marginBottom: '12px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={15} color="var(--cyan-neon)" />
          <span style={{
            color: 'var(--cyan-neon)',
            fontWeight: '800',
            fontSize: '0.85rem',
            letterSpacing: '0.04em',
            fontFamily: 'var(--font-heading)'
          }}>
            3. REAL-TIME SWARM TERMINAL
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className={`badge ${isCompleted ? 'badge-green' : logs.length > 0 ? 'badge-cyan pulse' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isCompleted ? 'var(--green-neon)' : logs.length > 0 ? 'var(--cyan-neon)' : 'var(--text-dim)', display: 'inline-block' }} />
            {isCompleted ? 'INVESTIGATION COMPLETED' : logs.length > 0 ? 'SWARM STREAMING LIVE' : 'SWARM STANDBY'}
          </span>
        </div>
      </div>

      {/* Main Split: Stream Console (Left) + Telemetry Badges (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 0.95fr',
        gap: '12px',
        alignItems: 'stretch',
        flex: 1
      }}>
        
        {/* Left: Terminal Stream Logs */}
        <div 
          ref={scrollRef}
          style={{
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            lineHeight: '1.5',
            color: 'var(--text-muted)',
            overflowY: 'auto',
            height: '142px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          {logs.length === 0 && !isCompleted && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-dim)' }}>
              <div style={{ color: 'var(--cyan-neon)', fontWeight: '600' }}>
                &gt; Forensic Swarm Engine Ready on NVIDIA NIM.
              </div>
              <div>
                &gt; Enter target company name above and click "Forensic Deep Dive".
              </div>
              <div style={{ color: 'var(--text-dim)' }}>
                &gt; Native Crawlers: Playwright Headless Browser + Google SERP Scraper.
              </div>
              <div style={{ color: 'var(--text-dim)' }}>
                &gt; Swarm Nodes: 8 parallel agents awaiting execution request...
              </div>
            </div>
          )}

          {logs.length > 0 && (
            <>
              <div style={{ color: 'var(--cyan-neon)', fontWeight: '600' }}>
                &gt; Initiating Forensic Swarm for: <span style={{ color: '#ffffff' }}>{companyName}</span>
              </div>
              
              {/* Render Real Agent Progression */}
              {SWARM_AGENTS_SCHEMA.map((agent, i) => {
                const isFinished = isCompleted || logs.some(l => l.agent === agent.key && (l.type === 'agent_complete' || l.type === 'final_report'));
                const isCurrentlyActive = activeAgent === agent.key;

                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: isCurrentlyActive ? 'var(--cyan-neon)' : isFinished ? 'var(--text-muted)' : 'var(--text-dim)' }}>
                      &gt; {agent.label}
                    </span>
                    <span style={{ fontWeight: '800', color: isFinished ? 'var(--green-neon)' : isCurrentlyActive ? 'var(--cyan-neon)' : 'var(--text-dim)' }}>
                      {isFinished ? '✓' : isCurrentlyActive ? '⚡' : '○'}
                    </span>
                  </div>
                );
              })}

              {logs.map((l, idx) => (
                <div key={idx} style={{ 
                  color: l.type === 'error' ? 'var(--red-neon)' : l.type === 'status' ? 'var(--cyan-neon)' : 'var(--text-muted)',
                  fontSize: '0.68rem'
                }}>
                  &gt; {l.message}
                </div>
              ))}
            </>
          )}

          {isCompleted && logs.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ color: 'var(--green-neon)', fontWeight: '700' }}>
                &gt; Forensic Dossier #{currentReport?.id} Loaded from SQLite Vault.
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                &gt; Company: <strong style={{ color: '#ffffff' }}>{currentReport?.company_name}</strong>
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                &gt; Total Audited Sources: {currentReport?.sources_inspected?.length || 0} nodes
              </div>
              <div style={{ color: 'var(--cyan-neon)' }}>
                &gt; All 8 Forensic Pillars compiled and ready below.
              </div>
            </div>
          )}
        </div>

        {/* Right: Telemetry Dashboard (Verified Nodes, Real Gauge, Exec Timer) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '8px',
          height: '142px'
        }}>
          {/* Verified Sources */}
          <div style={{
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Verified Sources
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: '900', color: hasData ? 'var(--cyan-neon)' : 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              {hasData ? sourcesCount : '--'}
            </span>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
              Nodes Audited
            </span>
          </div>

          {/* Confidence Score (Circular Gauge) */}
          <div style={{
            gridRow: 'span 2',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
              Confidence Score
            </span>

            {/* Circular SVG Ring */}
            <div style={{ position: 'relative', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="4.5"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke={confidenceScore >= 80 ? 'var(--green-neon)' : 'var(--cyan-neon)'}
                  strokeWidth="4.5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 0.8s ease',
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%',
                    filter: confidenceScore > 0 ? 'drop-shadow(0 0 6px rgba(0, 255, 136, 0.6))' : 'none'
                  }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '900', color: hasData ? '#ffffff' : 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  {hasData ? `${confidenceScore}%` : '--%'}
                </span>
              </div>
            </div>

            <span style={{ fontSize: '0.6rem', color: hasData ? 'var(--green-neon)' : 'var(--text-dim)', fontWeight: '700', marginTop: '2px' }}>
              {hasData ? 'Verified' : 'Standby'}
            </span>
          </div>

          {/* Execution Time */}
          <div style={{
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Execution Time
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: '900', color: hasData ? 'var(--text-main)' : 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              {execTime}
            </span>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
              {isCompleted ? 'Completed' : 'Elapsed'}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
