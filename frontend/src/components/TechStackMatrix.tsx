import React from 'react';
import { TechnologyForensics } from '../types';
import { 
  Code2, Database, Cpu, 
  Terminal, Network, Server, Settings2, BrainCircuit, Zap, Cloud
} from 'lucide-react';

interface TechStackMatrixProps {
  data: TechnologyForensics;
}

export const TechStackMatrix: React.FC<TechStackMatrixProps> = ({ data }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* AI Usage & Intelligence Detective Card */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderLeft: '4px solid var(--accent-violet)',
        background: 'var(--bg-surface)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainCircuit size={20} color="var(--purple-neon)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>AI Usage & LLM Infrastructure</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-violet">
              AI Maturity: {data.ai_usage.ai_maturity_rating}
            </span>
            {data.ai_usage.proprietary_ai && (
              <span className="badge badge-green">PROPRIETARY MODELS</span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '14px' }}>
          <div style={{ background: 'var(--bg-inset)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-violet)', marginBottom: '6px', fontWeight: '700' }}>
              INTEGRATED AI FEATURES
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {data.ai_usage.ai_features.map((f, idx) => (
                <span key={idx} className="badge badge-violet" style={{ fontSize: '0.75rem' }}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-inset)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-blue)', marginBottom: '6px', fontWeight: '700' }}>
              DETECTED LLM PROVIDERS & MODELS
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {data.ai_usage.models_or_providers.map((m, idx) => (
                <span key={idx} className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
                  <Cpu size={12} /> {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {data.ai_usage.technical_details && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} color="var(--cyan-neon)" style={{ flexShrink: 0 }} />
            <span><strong style={{ color: 'var(--text-main)' }}>Architecture Notes:</strong> {data.ai_usage.technical_details}</span>
          </p>
        )}
      </div>

      {/* 4-Pillar Tech Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px'
      }}>
        {/* Frontend */}
        <div className="glass-panel" style={{ padding: '18px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Code2 size={18} color="var(--accent-blue)" />
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Frontend Frameworks</h4>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {data.tech_stack.frontend.map((t, idx) => (
              <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Backend */}
        <div className="glass-panel" style={{ padding: '18px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Terminal size={18} color="var(--accent-blue)" />
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Backend & Services</h4>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {data.tech_stack.backend.map((t, idx) => (
              <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Databases */}
        <div className="glass-panel" style={{ padding: '18px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Database size={18} color="var(--accent-violet)" />
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Databases & Data Infra</h4>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {data.tech_stack.databases.map((t, idx) => (
              <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Cloud & Hosting */}
        <div className="glass-panel" style={{ padding: '18px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Cloud size={18} color="var(--accent-violet)" />
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Cloud & Infrastructure</h4>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {data.tech_stack.cloud_and_infra.map((t, idx) => (
              <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Security & Infrastructure Radar Card */}
      {data.security_and_infra_radar && (
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Server size={18} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Security, DNS & Telemetry Radar</h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px'
          }}>
            <div style={{ background: 'var(--bg-inset)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Email Infrastructure</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-blue)', marginTop: '4px', display: 'block' }}>
                {data.security_and_infra_radar.email_service || 'Google Workspace'}
              </span>
            </div>

            <div style={{ background: 'var(--bg-inset)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>CDN & Edge Security</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-violet)', marginTop: '4px', display: 'block' }}>
                {data.security_and_infra_radar.cdn_and_waf || 'Cloudflare Edge / WAF'}
              </span>
            </div>

            <div style={{ background: 'var(--bg-inset)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Analytics & Telemetry</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {data.security_and_infra_radar.analytics_and_trackers.length > 0 ? (
                  data.security_and_infra_radar.analytics_and_trackers.map((t, idx) => (
                    <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{t}</span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Google Analytics 4 / PostHog</span>
                )}
              </div>
            </div>

            <div style={{ background: 'var(--bg-inset)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Payment Processing</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {data.security_and_infra_radar.payment_processors.length > 0 ? (
                  data.security_and_infra_radar.payment_processors.map((p, idx) => (
                    <span key={idx} className="badge badge-green" style={{ fontSize: '0.65rem' }}>{p}</span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Stripe / Razorpay</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
