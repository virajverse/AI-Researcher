import React, { useState } from 'react';
import { 
  Search, Globe, Zap, Settings, ChevronDown, 
  ChevronUp, Radio, User, Briefcase, MessageSquare, Layers 
} from 'lucide-react';
import { ResearchRequest } from '../types';

interface SearchConsoleProps {
  onSearch: (request: ResearchRequest) => void;
  isLoading: boolean;
}

const QUICK_COMPANIES = [
  { name: 'Linear', url: 'https://linear.app' },
  { name: 'Stripe', url: 'https://stripe.com' },
  { name: 'Retool', url: 'https://retool.com' },
  { name: 'Cursor', url: 'https://cursor.com' },
  { name: 'Datadog', url: 'https://datadoghq.com' },
  { name: 'Taliyo Tech', url: 'https://www.taliyotechnologies.com/' },
];

export const SearchConsole: React.FC<SearchConsoleProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [showMeetingContext, setShowMeetingContext] = useState(true);
  
  // Meeting Context Parameters (Clean Real Inputs)
  const [person, setPerson] = useState('');
  const [role, setRole] = useState('');
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState('Forensic Deep-Dive');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    let companyName = query.trim();
    let directUrl: string | undefined = websiteUrl.trim() || undefined;

    if (query.startsWith('http://') || query.startsWith('https://')) {
      directUrl = query;
      try {
        const urlObj = new URL(query);
        companyName = urlObj.hostname.replace('www.', '').split('.')[0];
        companyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);
      } catch {
        companyName = query;
      }
    }

    onSearch({
      company_name: companyName,
      website_url: directUrl,
      meeting_person: person.trim() || undefined,
      meeting_role: role.trim() || undefined,
      meeting_topic: topic.trim() || undefined,
      depth: depth.toLowerCase().includes('deep') ? 'forensic' : 'lightning'
    });
  };

  const selectQuickCompany = (c: typeof QUICK_COMPANIES[0]) => {
    setSelectedTarget(c.name);
    const resolvedName = c.name === 'Taliyo Tech' ? 'Taliyo Technologies' : c.name;
    setQuery(resolvedName);
    setWebsiteUrl(c.url);
    onSearch({
      company_name: resolvedName,
      website_url: c.url,
      meeting_person: person.trim() || undefined,
      meeting_role: role.trim() || undefined,
      meeting_topic: topic.trim() || undefined,
      depth: depth.toLowerCase().includes('deep') ? 'forensic' : 'lightning'
    });
  };

  return (
    <div className="glass-panel" style={{
      padding: '16px 20px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box'
    }}>
      {/* Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '24px',
        marginBottom: '12px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '8px'
      }}>
        <span style={{
          color: 'var(--cyan-neon)',
          fontWeight: '800',
          fontSize: '0.85rem',
          letterSpacing: '0.04em',
          fontFamily: 'var(--font-heading)'
        }}>
          2. FORENSIC SEARCH & MEETING CONSOLE
        </span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'space-between' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(270px, 1.35fr) minmax(210px, 1fr)',
          gap: '14px',
          alignItems: 'stretch'
        }}>
          
          {/* Left Sub-Section: Inputs, Radar CTA, Quick Launch */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'space-between' }}>
            
            {/* Dual Input Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 24px 1.1fr',
              gap: '6px',
              alignItems: 'center'
            }}>
              {/* Company Name */}
              <div>
                <label style={{ fontSize: '0.66rem', color: 'var(--text-dim)', fontWeight: '600', display: 'block', marginBottom: '2px' }}>
                  Company Name
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  height: '34px'
                }}>
                  <input
                    type="text"
                    placeholder="e.g. Linear, Stripe, Taliyo Technologies"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: '600'
                    }}
                  />
                </div>
              </div>

              {/* OR Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '14px'
              }}>
                <span style={{
                  fontSize: '0.66rem',
                  fontWeight: '700',
                  color: 'var(--text-dim)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  OR
                </span>
              </div>

              {/* Direct Website URL */}
              <div>
                <label style={{ fontSize: '0.66rem', color: 'var(--text-dim)', fontWeight: '600', display: 'block', marginBottom: '2px' }}>
                  Direct Website URL (Optional)
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  height: '34px'
                }}>
                  <input
                    type="text"
                    placeholder="https://company.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--cyan-neon)',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Radar Scan Action Button + Radar Animation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="btn-radar"
                style={{ flex: 1, height: '44px', justifyContent: 'flex-start' }}
              >
                <Zap size={18} color="var(--cyan-neon)" className={isLoading ? 'pulse' : ''} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: '800', letterSpacing: '0.02em', color: '#ffffff', lineHeight: '1.2' }}>
                    {isLoading ? 'Forensic Swarm Running...' : 'Forensic Deep Dive'}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--cyan-neon)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                    {isLoading ? '8 SPECIALIZED AGENTS ACTIVE' : 'AI SWARM INITIATED'}
                  </div>
                </div>
              </button>

              {/* Circular Glowing Radar Animation Indicator */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, rgba(7, 10, 19, 0.8) 70%)',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{
                  position: 'absolute',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '1px dashed rgba(0, 240, 255, 0.3)'
                }} />
                <svg className="radar-sweep" width="44" height="44" viewBox="0 0 44 44" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="radarBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 22 22 L 44 22 A 22 22 0 0 0 22 0 Z" fill="url(#radarBeam)" opacity="0.6" />
                </svg>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--cyan-neon)',
                  boxShadow: '0 0 8px #00f0ff'
                }} />
              </div>
            </div>

            {/* Quick Launch Chips */}
            <div>
              <span style={{ fontSize: '0.66rem', color: 'var(--text-dim)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                Quick Launch Targets
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {QUICK_COMPANIES.map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => selectQuickCompany(c)}
                    className={`target-chip ${selectedTarget === c.name ? 'active' : ''}`}
                    disabled={isLoading}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sub-Section: Meeting Context Drawer */}
          <div style={{
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '6px'
          }}>
            <div 
              onClick={() => setShowMeetingContext(!showMeetingContext)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                paddingBottom: '2px'
              }}
            >
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.02em' }}>
                Meeting Context (Collapsible)
              </span>
              {showMeetingContext ? <ChevronUp size={12} color="var(--text-dim)" /> : <ChevronDown size={12} color="var(--text-dim)" />}
            </div>

            {showMeetingContext && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div>
                  <label style={{ fontSize: '0.62rem', color: 'var(--text-dim)', display: 'block', marginBottom: '1px' }}>Meeting Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Founder / Executive Name"
                    value={person}
                    onChange={(e) => setPerson(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '3px 7px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      color: 'var(--text-main)',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      height: '24px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.62rem', color: 'var(--text-dim)', display: 'block', marginBottom: '1px' }}>Counterpart Role</label>
                  <input
                    type="text"
                    placeholder="e.g. CEO / CTO / VP Eng"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '3px 7px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      color: 'var(--text-main)',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      height: '24px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.62rem', color: 'var(--text-dim)', display: 'block', marginBottom: '1px' }}>Meeting Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Custom AI Automation & Architecture"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '3px 7px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      color: 'var(--text-main)',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      height: '24px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.62rem', color: 'var(--text-dim)', display: 'block', marginBottom: '1px' }}>Investigation Depth</label>
                  <select
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '2px 6px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      color: 'var(--text-main)',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      height: '24px',
                      outline: 'none'
                    }}
                  >
                    <option value="Forensic Deep-Dive">Forensic Deep-Dive</option>
                    <option value="Lightning Snapshot">Lightning Snapshot</option>
                  </select>
                </div>
              </div>
            )}
          </div>

        </div>
      </form>
    </div>
  );
};
