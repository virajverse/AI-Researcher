import React from 'react';
import { StrategyIntelligence } from '../types';
import { 
  Rocket, DollarSign, Handshake, Users, 
  Building, Calendar, TrendingUp, Award 
} from 'lucide-react';

interface StrategicMovesCardProps {
  data: StrategyIntelligence;
}

export const StrategicMovesCard: React.FC<StrategicMovesCardProps> = ({ data }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Funding & Capitalization Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={20} color="var(--status-green)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Capital Capitalization & Funding History</h3>
          </div>
          {data.funding.total_raised && (
            <div className="badge badge-green" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
              Total Raised: {data.funding.total_raised}
            </div>
          )}
        </div>

        {/* Funding Rounds Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
          marginBottom: '14px'
        }}>
          {data.funding.rounds.map((r, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>{r.round_name}</span>
                <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>{r.amount_raised || 'Undisclosed'}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Lead Investors: {r.lead_investors.length > 0 ? r.lead_investors.join(', ') : 'Private / Undisclosed'}
              </div>
            </div>
          ))}
          {data.funding.rounds.length === 0 && (
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontStyle: 'italic', padding: '10px' }}>
              Company is Private / Bootstrapped or has undisclosed funding rounds.
            </div>
          )}
        </div>

        {/* Lead Investors Tag Cloud */}
        {data.funding.top_investors.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Backed By:</span>
            {data.funding.top_investors.map((inv, idx) => (
              <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                {inv}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 2-Column: Recent Launches & Strategic Partnerships */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Recent Launches */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Rocket size={18} color="var(--accent-blue)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Recent Launches & Releases</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.recent_launches.map((l, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-inset)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{l.title}</h5>
                  {l.date && <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{l.date}</span>}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{l.description}</p>
              </div>
            ))}
            {data.recent_launches.length === 0 && (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                No recent major public launches tracked in the last 12 months.
              </div>
            )}
          </div>
        </div>

        {/* Partnerships & Alliances */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Handshake size={18} color="var(--accent-violet)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Strategic Alliances & Partnerships</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.partnerships.map((p, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-inset)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{p.partner_name}</h5>
                  <span className="badge badge-violet" style={{ fontSize: '0.65rem' }}>ALLIANCE</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.scope_or_announcement}</p>
              </div>
            ))}
            {data.partnerships.length === 0 && (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                Direct enterprise sales motion with custom partnership structures.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hiring Trends & Signals */}
      <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Users size={18} color="var(--accent-blue)" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Hiring Trajectory & Talent Signals</h4>
          <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>{data.hiring_trends.signal_strength || 'Active'}</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
          {(data.hiring_trends.open_roles_focus || data.hiring_trends.open_role_categories || []).map((role, idx) => (
            <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={12} color="var(--cyan-neon)" />
              <span>{role}</span>
            </span>
          ))}
        </div>
        {data.hiring_trends.notes && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={12} color="var(--cyan-neon)" />
            <span>{data.hiring_trends.notes}</span>
          </p>
        )}
      </div>

    </div>
  );
};
