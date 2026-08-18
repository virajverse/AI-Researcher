import React, { useState, useEffect } from 'react';
import { 
  ForensicCompanyReport, StreamEvent 
} from './types';
import { Header } from './components/Header';
import { SearchConsole } from './components/SearchConsole';
import { LiveResearchTerminal } from './components/LiveResearchTerminal';
import { OverviewCard } from './components/OverviewCard';
import { BusinessModelCard } from './components/BusinessModelCard';
import { ProductSentimentCard } from './components/ProductSentimentCard';
import { TechStackMatrix } from './components/TechStackMatrix';
import { StrategicMovesCard } from './components/StrategicMovesCard';
import { CompetitorBattlecard } from './components/CompetitorBattlecard';
import { PreMeetingDossier } from './components/PreMeetingDossier';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ExportModal } from './components/ExportModal';
import { CompareModal } from './components/CompareModal';
import { QuickIntelligenceSnapshot } from './components/QuickIntelligenceSnapshot';
import { PitchSimulatorStudio } from './components/PitchSimulatorStudio';
import { CompanyFinderPage } from './components/CompanyFinderPage';
import { API_BASE_URL } from './api/config';

import { 
  Target, Building2, DollarSign, Package, 
  Cpu, Rocket, Swords, Clock, ShieldCheck, ExternalLink, BrainCircuit, Compass
} from 'lucide-react';

const TABS = [
  { id: 'pre_meeting', index: '0', label: 'Pre-Meeting Cheatsheet', icon: Target },
  { id: 'pitch_simulator', index: '1', label: 'Pitch Simulator Studio', icon: BrainCircuit },
  { id: 'dna', index: '2', label: 'Company DNA Legal Registry', icon: Building2 },
  { id: 'business', index: '3', label: 'Business & Monetization', icon: DollarSign },
  { id: 'product', index: '4', label: 'Product & Complaints', icon: Package },
  { id: 'tech', index: '5', label: 'Tech Stack & AI Radar', icon: Cpu },
  { id: 'strategy', index: '6', label: 'Strategy, Funding & M&A', icon: Rocket },
  { id: 'competitors', index: '7', label: 'Competitor Battlecard', icon: Swords },
];

export const App: React.FC = () => {
  // Page Routing State ('dossier' = / | 'finder' = /company-finder)
  const [currentRoute, setCurrentRoute] = useState<'dossier' | 'finder'>(() => {
    if (typeof window !== 'undefined' && (window.location.pathname.includes('finder') || window.location.pathname.includes('find'))) {
      return 'finder';
    }
    return 'dossier';
  });

  const handleRouteChange = (route: 'dossier' | 'finder') => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', route === 'finder' ? '/company-finder' : '/');
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.includes('finder') || window.location.pathname.includes('find')) {
        setCurrentRoute('finder');
      } else {
        setCurrentRoute('dossier');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [activeModel, setActiveModel] = useState('meta/llama-3.1-70b-instruct');
  const [availableModels, setAvailableModels] = useState<string[]>([
    'meta/llama-3.1-70b-instruct',
    'meta/llama-3.1-8b-instruct',
    'meta/llama-3.3-70b-instruct'
  ]);
  const [activeTab, setActiveTab] = useState('pre_meeting');
  
  // State for streaming & results
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamLogs, setStreamLogs] = useState<StreamEvent[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [currentCompany, setCurrentCompany] = useState<string>('');
  const [currentReport, setCurrentReport] = useState<ForensicCompanyReport | null>(null);

  // Modals & Drawers
  const [showHistory, setShowHistory] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  // Fetch models on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/models`)
      .then(res => res.json())
      .then(data => {
        if (data.recommended && data.recommended.length > 0) {
          setAvailableModels(data.recommended);
          setActiveModel(data.recommended[0]);
        }
      })
      .catch(err => console.error('Failed to load models:', err));

    // Try loading latest dossier
    fetch(`${API_BASE_URL}/api/dossiers?limit=1`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          loadDossier(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const loadDossier = async (id: string) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/dossiers/${id}`);
      if (resp.ok) {
        const data = await resp.json();
        setCurrentReport(data);
        setCurrentCompany(data.company_name);
        setActiveTab('pre_meeting');
        setStreamLogs([]);
      }
    } catch (e) {
      console.error('Failed to load dossier:', e);
    }
  };

  const handleStartSearch = async (request: any) => {
    setIsStreaming(true);
    setStreamLogs([]);
    setCurrentReport(null);
    setCurrentCompany(request.company_name);
    setActiveAgent('INITIALIZING');

    try {
      const response = await fetch(`${API_BASE_URL}/api/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...request,
          model_name: activeModel
        })
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event: StreamEvent = JSON.parse(line.replace('data: ', ''));
              
              setStreamLogs(prev => [...prev, event]);

              if (event.type === 'agent_active' || event.type === 'agent_start') {
                setActiveAgent(event.agent || null);
              } else if (event.type === 'final_report' && event.data) {
                setCurrentReport(event.data);
                setIsStreaming(false);
                setActiveAgent(null);
              }
            } catch (err) {
              console.error('SSE JSON parse error:', err);
            }
          }
        }
      }
    } catch (err) {
      console.error('Research stream error:', err);
      setIsStreaming(false);
      setActiveAgent(null);
      setStreamLogs(prev => [
        ...prev,
        {
          type: 'error',
          message: `Connection error during investigation: ${String(err)}`
        }
      ]);
    }
  };

  const handleLaunchAuditFromFinder = (companyName: string, websiteUrl?: string) => {
    handleRouteChange('dossier');
    handleStartSearch({
      company_name: companyName,
      website_url: websiteUrl,
      depth: 'forensic'
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Global Command Header */}
      <Header
        currentRoute={currentRoute}
        onRouteChange={handleRouteChange}
        activeModel={activeModel}
        onModelChange={setActiveModel}
        availableModels={availableModels}
        onOpenHistory={() => setShowHistory(true)}
        onOpenCompare={() => setShowCompare(true)}
        onOpenExport={() => setShowExport(true)}
        hasActiveReport={!!currentReport}
      />

      {currentRoute === 'finder' ? (
        <CompanyFinderPage
          onLaunchAudit={handleLaunchAuditFromFinder}
          selectedModel={activeModel}
        />
      ) : (
        <>
          {/* Top Grid: 2. Search Console (Left) + 3. Swarm Terminal (Right) */}
          <section style={{
            padding: '16px 24px 0 24px',
            display: 'grid',
            gridTemplateColumns: 'minmax(480px, 1.25fr) minmax(440px, 1fr)',
            gap: '16px',
            alignItems: 'stretch',
            maxWidth: '1600px',
            margin: '0 auto',
            width: '100%'
          }}>
            <SearchConsole
              onSearch={handleStartSearch}
              isLoading={isStreaming}
            />
            <LiveResearchTerminal
              logs={streamLogs}
              activeAgent={activeAgent}
              companyName={currentCompany}
              isCompleted={!isStreaming && !!currentReport}
              currentReport={currentReport}
            />
          </section>

      {/* Main Forensic Intelligence Dossier Dashboard */}
      {currentReport && (
        <main style={{ padding: '20px 24px 60px 24px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
          
          {/* Executive Report Meta Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="badge badge-cyan" style={{ fontSize: '0.78rem', padding: '5px 12px', letterSpacing: '0.04em' }}>
                DOSSIER #{currentReport.id}
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Compiled in <strong style={{ color: '#ffffff' }}>{currentReport.research_duration_seconds}s</strong> via {currentReport.llm_model_used}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="badge badge-green" style={{ fontSize: '0.78rem', padding: '5px 12px' }}>
                <ShieldCheck size={14} /> {currentReport.confidence_score}% CONFIDENCE
              </div>
              <div className="badge badge-cyan" style={{ fontSize: '0.78rem', padding: '5px 12px' }}>
                {currentReport.sources_inspected.length} NODES AUDITED
              </div>
            </div>
          </div>

          {/* Section Title: 4. CORE INTELLIGENCE MODULES - 8 FORENSIC TABS */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px'
          }}>
            <span style={{
              color: 'var(--cyan-neon)',
              fontWeight: '800',
              fontSize: '0.85rem',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-heading)'
            }}>
              4. CORE INTELLIGENCE MODULES - 8 FORENSIC TABS
            </span>
          </div>

          {/* Forensic Pillar Navigation Tabs Bar */}
          <div className="forensic-tabs-bar">
            {TABS.map(t => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`forensic-tab ${isActive ? 'active' : ''}`}
                >
                  <span className="forensic-tab-index">{t.index}</span>
                  <Icon size={15} color={isActive ? 'var(--cyan-neon)' : 'var(--text-muted)'} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: (activeTab === 'pre_meeting' || activeTab === 'pitch_simulator')
              ? 'minmax(640px, 3.2fr) minmax(280px, 1.15fr)'
              : '1fr',
            gap: '20px',
            alignItems: 'start',
            minHeight: '400px'
          }}>
            <div>
              {activeTab === 'pre_meeting' && (
                <PreMeetingDossier data={currentReport.pre_meeting_dossier} companyName={currentReport.company_name} />
              )}
              {activeTab === 'pitch_simulator' && (
                <PitchSimulatorStudio report={currentReport} />
              )}
              {activeTab === 'dna' && (
                <OverviewCard data={currentReport.basic} />
              )}
              {activeTab === 'business' && (
                <BusinessModelCard data={currentReport.business} />
              )}
              {activeTab === 'product' && (
                <ProductSentimentCard data={currentReport.product} />
              )}
              {activeTab === 'tech' && (
                <TechStackMatrix data={currentReport.technology} />
              )}
              {activeTab === 'strategy' && (
                <StrategicMovesCard data={currentReport.strategy} />
              )}
              {activeTab === 'competitors' && (
                <CompetitorBattlecard data={currentReport.competitive_landscape} companyName={currentReport.company_name} />
              )}
            </div>

            {(activeTab === 'pre_meeting' || activeTab === 'pitch_simulator') && (
              <QuickIntelligenceSnapshot
                report={currentReport}
                onSelectTab={(tabId) => setActiveTab(tabId)}
                onOpenCompare={() => setShowCompare(true)}
              />
            )}
          </div>
        </main>
      )}

      {/* Empty State when no research loaded */}
      {!currentReport && !isStreaming && streamLogs.length === 0 && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'var(--bg-inset)',
            border: '1px solid var(--cyan-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)'
          }}>
            <img src="/logo.png" alt="VirajVerse Logo" style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px', color: '#ffffff' }}>
            Ready for Forensic Investigation
          </h2>
          <p style={{ maxWidth: '480px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Enter any company name or website URL above to launch our 8-agent forensic swarm across Company DNA, Revenue Models, Product Roadmaps, Tech Stacks, and Pre-Meeting Cheatsheets.
          </p>
        </div>
      )}
      </>
      )}

      {/* History Vault Drawer */}
      <HistoryDrawer
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectDossier={loadDossier}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        report={currentReport}
      />

      {/* Compare Modal */}
      <CompareModal
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        currentReport={currentReport}
      />

      {/* Bottom Brand Footer Bar */}
      <footer style={{
        marginTop: '40px',
        borderTop: '1px solid var(--border-subtle)',
        background: '#070a14',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.72rem',
        color: 'var(--text-dim)',
        fontFamily: 'var(--font-mono)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.png" alt="VirajVerse" style={{ width: '16px', height: '16px', borderRadius: '4px' }} />
          <span style={{ color: 'var(--cyan-neon)', fontWeight: '700' }}>VIRAJVERSE FORENSIC AI ENGINE</span>
          <span>•</span>
          <span>UNMATCHED DEPTH</span>
          <span>•</span>
          <span>UNRIVALED INTELLIGENCE</span>
          <span>•</span>
          <span style={{ color: 'var(--green-neon)' }}>UNFAIR ADVANTAGE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>Version 6.0 • Built for Winners</span>
        </div>
      </footer>
    </div>
  );
};
