import React from 'react';
import { CompetitiveLandscape } from '../types';
import { 
  Swords, Shield, AlertCircle, ArrowUpRight, 
  TrendingDown, CheckCircle2, AlertTriangle, Layers 
} from 'lucide-react';

interface CompetitorBattlecardProps {
  data: CompetitiveLandscape;
  companyName: string;
}

export const CompetitorBattlecard: React.FC<CompetitorBattlecardProps> = ({ data, companyName }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Competitive Summary Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderLeft: '4px solid var(--text-main)',
        background: 'var(--bg-surface)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Swords size={20} color="var(--text-main)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>
            Competitive Battlecard: {companyName}
          </h3>
          <span className="badge badge-neutral" style={{ marginLeft: 'auto' }}>
            MARKET DYNAMICS
          </span>
        </div>
        <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          {data.competitive_summary || `Competitive analysis across direct and indirect market rivals.`}
        </p>
      </div>

      {/* Competitors List Grid */}
      <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Layers size={18} color="var(--accent-blue)" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Market Competitors & Alternatives</h4>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px'
        }}>
          {data.competitors.map((comp, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{comp.name}</h5>
                <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{comp.category}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{comp.key_differences}</p>
              {comp.market_position && (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontStyle: 'italic', display: 'block' }}>
                  Position: {comp.market_position}
                </span>
              )}
            </div>
          ))}
          {data.competitors.length === 0 && (
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontStyle: 'italic', padding: '10px' }}>
              Bespoke market positioning with niche domain alternatives.
            </div>
          )}
        </div>
      </div>

      {/* 2-Column: Defensible Moats vs Vulnerabilities */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Defensible Moats (Emerald) */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Shield size={18} color="var(--status-green)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Defensible Moats & Core Differentiators</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.differentiators_and_moat.map((moat, idx) => (
              <div key={idx} style={{
                padding: '10px 12px',
                background: 'var(--status-green-soft)',
                border: '1px solid var(--status-green-border)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} color="var(--status-green)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{moat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Where They Lag (Amber) */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <AlertTriangle size={18} color="var(--status-amber)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Vulnerability Gaps & Where They Lag Behind</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.where_they_lag.map((lag, idx) => (
              <div key={idx} style={{
                padding: '10px 12px',
                background: 'var(--status-amber-soft)',
                border: '1px solid var(--status-amber-border)',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}>{lag.area}</span>
                  {lag.better_competitors && lag.better_competitors.length > 0 && (
                    <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                      Beaten by: {lag.better_competitors.join(', ')}
                    </span>
                  )}
                </div>
                {lag.deal_impact && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                    Impact: {lag.deal_impact}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
