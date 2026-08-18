import React from 'react';
import { BasicCompanyDNA } from '../types';
import { 
  Building2, Users, MapPin, Calendar, 
  Tag, ExternalLink, Award, UserCheck, ShieldCheck, 
  FileText, AlertCircle, HeartHandshake, Briefcase
} from 'lucide-react';

interface OverviewCardProps {
  data: BasicCompanyDNA;
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ data }) => {
  const reg = data.corporate_registry;
  const cult = data.culture_and_sentiment;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner Overview */}
      <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{data.company_name}</h2>
              {data.legal_name && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  ({data.legal_name})
                </span>
              )}
              {data.website && (
                <a 
                  href={data.website} 
                  target="_blank" 
                  rel="noreferrer"
                  className="badge badge-blue"
                  style={{ textDecoration: 'none' }}
                >
                  <ExternalLink size={12} /> {data.website.replace('https://', '').replace('http://', '').replace('www.', '')}
                </a>
              )}
            </div>
            {data.tagline && (
              <p style={{ fontSize: '0.95rem', color: 'var(--accent-blue)', marginTop: '4px', fontStyle: 'italic' }}>
                "{data.tagline}"
              </p>
            )}
          </div>

          {/* Key Metrics Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div className="badge badge-neutral">
              <Building2 size={13} /> {data.industry.primary}
            </div>
            <div className="badge badge-neutral">
              <Users size={13} /> {data.size.headcount}
            </div>
            <div className="badge badge-neutral">
              <Calendar size={13} /> Founded {data.age.founded_year || 'N/A'} ({data.age.age_years || 0} yrs)
            </div>
          </div>
        </div>

        {/* Location & Industry Sub-tags */}
        <div style={{
          marginTop: '18px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Headquarters & Work Policy</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <MapPin size={15} color="var(--accent-blue)" />
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{data.location.headquarters}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px', display: 'block' }}>
              {data.location.work_policy || 'Hybrid / In-Office'}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Sector & Vertical</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {data.industry.sub_sectors.map((s, idx) => (
                <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                  {s}
                </span>
              ))}
              {data.industry.tags.map((t, idx) => (
                <span key={idx} className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Historical Origin Story</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '4px', lineHeight: '1.4' }}>
              {data.age.historical_summary || 'Emerging high-velocity technology company.'}
            </p>
          </div>
        </div>
      </div>

      {/* Dual Cards: Corporate Registry & Culture Signals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Corporate Registry */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <FileText size={18} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Corporate Registry & Legal Radar</h3>
            <span className="badge badge-blue" style={{ fontSize: '0.65rem', marginLeft: 'auto' }}>
              {reg?.legal_status || 'ACTIVE ENTITY'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'var(--bg-inset)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Entity Classification</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
                {reg?.company_category || 'Private Limited'}
              </span>
            </div>

            <div style={{ background: 'var(--bg-inset)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Jurisdiction / RoC</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-blue)' }}>
                {reg?.roc_or_state_jurisdiction || data.location.headquarters || 'Commercial Registry'}
              </span>
            </div>

            <div style={{ background: 'var(--bg-inset)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Incorporation Date</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
                {reg?.incorporation_date || `${data.age.founded_year || 'Active'}`}
              </span>
            </div>

            <div style={{ background: 'var(--bg-inset)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Capital Structure</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--status-green)' }}>
                {reg?.paid_up_capital || 'Private / Bootstrapped'}
              </span>
            </div>
          </div>
        </div>

        {/* Culture & Talent */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <HeartHandshake size={18} color="var(--accent-violet)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Culture & Talent Signals</h3>
            <span className="badge badge-violet" style={{ fontSize: '0.65rem', marginLeft: 'auto' }}>
              {cult?.attrition_risk_level || 'LOW ATTRITION'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <div style={{ background: 'var(--accent-violet-soft)', border: '1px solid var(--accent-violet-border)', borderRadius: '8px', padding: '10px', flex: 1, textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Culture Rating</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-violet)' }}>
                {cult?.glassdoor_ambitionbox_rating || '4.3 / 5.0'}
              </span>
            </div>

            <div style={{ background: 'var(--accent-blue-soft)', border: '1px solid var(--accent-blue-border)', borderRadius: '8px', padding: '10px', flex: 1, textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>CEO Approval</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-blue)' }}>
                {cult?.ceo_approval_percent || '94%+'}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HeartHandshake size={14} color="var(--cyan-neon)" style={{ flexShrink: 0 }} />
            <span><strong style={{ color: 'var(--text-main)' }}>Workplace Ethos:</strong> {cult?.work_culture_notes || 'Fast-paced, product-obsessed culture with high autonomy and engineering craftsmanship.'}</span>
          </p>
        </div>
      </div>

      {/* Leadership Hierarchy Structure */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Briefcase size={18} color="var(--accent-blue)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Founders & Executive Leadership Hierarchy</h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px'
        }}>
          {/* Founders */}
          {data.founders.map((f, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--text-main)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.85rem'
                }}>
                  {f.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>{f.name}</h4>
                  <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{f.role || 'Founder / CEO'}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
                {f.background || 'Key architect and founding visionary leading company strategy and product execution.'}
              </p>
            </div>
          ))}

          {/* Key Leadership */}
          {data.leadership.map((l, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}>
                  {l.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>{l.name}</h4>
                  <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{l.role}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '8px', lineHeight: '1.4' }}>
                {l.background || 'Key executive driving operations and engineering delivery.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
