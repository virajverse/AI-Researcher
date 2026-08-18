import React, { useState } from 'react';
import { 
  Search, Globe, Building2, MapPin, DollarSign, 
  Layers, ArrowRight, Zap, Filter, Compass, 
  ExternalLink, MessageSquare, Bot, 
  Award, CheckCircle2, ChevronRight, RefreshCw,
  Cpu, Flame, TrendingUp, CreditCard, Package,
  Shield, Target, AlertTriangle
} from 'lucide-react';
import { DiscoveredCompany, DiscoveryResponse } from '../types';
import { API_BASE_URL } from '../api/config';

interface CompanyFinderPageProps {
  onLaunchAudit: (companyName: string, websiteUrl?: string) => void;
  selectedModel: string;
}

const SAMPLE_PRESETS = [
  { icon: Flame, label: 'AI Automation India', query: 'Fast growing AI automation agencies and enterprise AI startups in India' },
  { icon: Cpu, label: 'DevTools & Code AI', query: 'Developer tooling and AI code intelligence startups' },
  { icon: CreditCard, label: 'FinTech & Payments', query: 'Emerging B2B FinTech startups and payment orchestrators' },
  { icon: Package, label: 'Logistics & Supply Chain AI', query: 'AI startups automating logistics and supply chain workflows' },
  { icon: Shield, label: 'Cyber Security Startups', query: 'Fast-growing cloud security and identity protection startups' },
  { icon: Target, label: 'Companies like Linear', query: 'High-velocity project management and issue tracking tools similar to Linear' },
];

const INDUSTRIES = ['All Industries', 'Artificial Intelligence', 'B2B SaaS', 'FinTech', 'DevTools', 'HealthTech', 'E-Commerce', 'Cybersecurity', 'EdTech'];
const LOCATIONS = ['Global', 'India', 'United States', 'Europe & UK', 'Southeast Asia', 'Middle East'];
const STAGES = ['Any Stage', 'Bootstrapped / Profitable', 'Seed / Early-Stage', 'Series A / B', 'Growth / Unicorn', 'Enterprise / Public'];

export const CompanyFinderPage: React.FC<CompanyFinderPageProps> = ({ onLaunchAudit, selectedModel }) => {
  const [query, setQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedLocation, setSelectedLocation] = useState('Global');
  const [selectedStage, setSelectedStage] = useState('Any Stage');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiscoveryResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = async (overrideQuery?: string) => {
    const activeQuery = (overrideQuery || query).trim();
    if (!activeQuery || isLoading) return;

    if (overrideQuery) setQuery(overrideQuery);

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/discover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: activeQuery,
          industry: selectedIndustry !== 'All Industries' ? selectedIndustry : undefined,
          location: selectedLocation !== 'Global' ? selectedLocation : undefined,
          stage: selectedStage !== 'Any Stage' ? selectedStage : undefined,
          model: selectedModel
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data: DiscoveryResponse = await response.json();
      setResult(data);
      if (!searchHistory.includes(activeQuery)) {
        setSearchHistory(prev => [activeQuery, ...prev].slice(0, 5));
      }
    } catch (err: any) {
      console.error('Discovery search failed:', err);
      setErrorMsg(err.message || 'Failed to fetch matching companies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px', width: '100%' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08) 0%, rgba(112, 0, 255, 0.08) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '24px 28px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>
              <Compass size={12} /> SOURCING & MARKET ADVISOR
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              ROUTE: /company-finder
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', margin: 0, fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
            Conversational Company Discovery & Sourcing Engine
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '4px', maxWidth: '800px' }}>
            Describe any company type, niche, or competitor lookalike in plain English. Our market intelligence agent discovers, verifies, and extracts live company profiles with 1-click forensic handoff.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="badge badge-purple" style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
            <Cpu size={14} /> {selectedModel.split('/').pop()}
          </div>
        </div>
      </div>

      {/* Main Search Console */}
      <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          
          {/* Main Conversational Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-inset)',
            border: '1px solid var(--cyan-border)',
            borderRadius: '8px',
            padding: '8px 16px',
            gap: '12px',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.08)',
            marginBottom: '14px'
          }}>
            <Bot size={22} color="var(--cyan-neon)" />
            <input
              type="text"
              placeholder="Tell our AI what company you're looking for (e.g. 'Top AI automation startups in India' or 'B2B SaaS tools similar to Stripe')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '0.98rem',
                fontFamily: 'var(--font-heading)'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                fontSize: '0.88rem',
                borderRadius: '6px',
                opacity: isLoading || !query.trim() ? 0.6 : 1
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Sourcing...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Discover Companies</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '600' }}>
              Suggestions:
            </span>
            {SAMPLE_PRESETS.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSearch(p.query)}
                  className="target-chip"
                  disabled={isLoading}
                  style={{ fontSize: '0.74rem', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <IconComp size={12} color="var(--cyan-neon)" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filters Matrix */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                Industry / Vertical
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              >
                {INDUSTRIES.map(i => <option key={i} value={i} style={{ background: '#0a101d' }}>{i}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                Geography / Region
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              >
                {LOCATIONS.map(l => <option key={l} value={l} style={{ background: '#0a101d' }}>{l}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                Capital Stage
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              >
                {STAGES.map(s => <option key={s} value={s} style={{ background: '#0a101d' }}>{s}</option>)}
              </select>
            </div>
          </div>

        </form>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <RefreshCw size={32} className="spin" color="var(--cyan-neon)" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--cyan-neon)', fontFamily: 'var(--font-heading)', margin: 0 }}>
            Scanning Multi-Matrix Google SERP & Web Registries...
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
            Our discovery agent is searching live registries, filtering domain signals, and reasoning matching companies with NVIDIA NIM.
          </p>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div style={{
          background: 'rgba(255, 0, 85, 0.1)',
          border: '1px solid rgba(255, 0, 85, 0.3)',
          borderRadius: '8px',
          padding: '14px 20px',
          color: '#ff4d88',
          fontSize: '0.88rem',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertTriangle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Discovery Results */}
      {result && !isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* AI Market Insight Card (ChatGPT Style) */}
          <div className="glass-panel" style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(9, 15, 29, 0.95) 0%, rgba(18, 12, 38, 0.95) 100%)',
            borderLeft: '4px solid var(--cyan-neon)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Bot size={18} color="var(--cyan-neon)" />
              <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--cyan-neon)', fontFamily: 'var(--font-heading)' }}>
                AI MARKET ADVISOR INSIGHTS
              </span>
            </div>
            <p style={{
              color: 'var(--text-main)',
              fontSize: '0.92rem',
              lineHeight: '1.6',
              margin: 0
            }}>
              {result.ai_response_text}
            </p>

            {/* Follow up suggestions */}
            {result.follow_up_suggestions && result.follow_up_suggestions.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Suggested Deep Dives:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.follow_up_suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(sug)}
                      className="btn"
                      style={{
                        background: 'rgba(0, 240, 255, 0.06)',
                        border: '1px solid rgba(0, 240, 255, 0.2)',
                        color: 'var(--cyan-neon)',
                        fontSize: '0.76rem',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <MessageSquare size={12} />
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: '0.86rem',
              fontWeight: '800',
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-heading)'
            }}>
              DISCOVERED MATCHES ({result.companies.length} VERIFIED ENTITIES)
            </span>
          </div>

          {/* Companies Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
            gap: '18px'
          }}>
            {result.companies.map((company, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all 0.2s ease',
                  background: 'var(--bg-card)'
                }}
              >
                <div>
                  {/* Top Row: Name, Badge, Link */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(112,0,255,0.2))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--cyan-neon)',
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          fontFamily: 'var(--font-heading)'
                        }}>
                          {company.name.charAt(0)}
                        </div>
                        <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                          {company.name}
                        </h3>
                      </div>
                      
                      {company.website && (
                        <a
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: '0.74rem',
                            color: 'var(--text-dim)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '4px',
                            textDecoration: 'none'
                          }}
                        >
                          <Globe size={11} /> {company.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                        {company.category}
                      </span>
                      {company.estimated_stage_or_funding && (
                        <span style={{ fontSize: '0.68rem', color: 'var(--green-neon)', fontFamily: 'var(--font-mono)' }}>
                          {company.estimated_stage_or_funding}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tagline */}
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    lineHeight: '1.4',
                    margin: '6px 0 10px 0',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {company.tagline}
                  </p>

                  {/* Why it matches */}
                  <div style={{
                    background: 'var(--bg-inset)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.4',
                    marginBottom: '10px'
                  }}>
                    <span style={{ color: 'var(--cyan-neon)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '700', marginRight: '4px' }}>
                      <Target size={12} /> Match Rationale:
                    </span>
                    {company.why_it_matches}
                  </div>

                  {/* Meta Tags (Location, Key Features, Tech) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {company.hq_location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        <MapPin size={12} color="var(--purple-neon)" />
                        <span>{company.hq_location}</span>
                      </div>
                    )}

                    {company.key_features && company.key_features.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                        {company.key_features.map((f, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '0.68rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-muted)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <CheckCircle2 size={10} color="var(--green-neon)" /> {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {company.tech_stack_preview && company.tech_stack_preview.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {company.tech_stack_preview.map((t, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '0.66rem',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              background: 'rgba(0, 240, 255, 0.06)',
                              color: 'var(--cyan-neon)',
                              fontFamily: 'var(--font-mono)'
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 1-Click Forensic Handoff Button */}
                <button
                  type="button"
                  onClick={() => onLaunchAudit(company.name, company.website)}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    borderRadius: '6px',
                    marginTop: '4px'
                  }}
                >
                  <Zap size={14} />
                  <span>Launch Deep Forensic Dossier</span>
                  <ArrowRight size={13} />
                </button>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
