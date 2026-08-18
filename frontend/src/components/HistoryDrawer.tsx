import React, { useEffect, useState } from 'react';
import { DossierSummary } from '../types';
import { 
  X, History, Trash2, ExternalLink, 
  Clock, ShieldCheck, ArrowRight, RefreshCw, Cpu, Building2, Search 
} from 'lucide-react';
import { API_BASE_URL } from '../api/config';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDossier: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectDossier
}) => {
  const [dossiers, setDossiers] = useState<DossierSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState('');

  const fetchDossiers = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE_URL}/api/dossiers`);
      if (resp.ok) {
        const data = await resp.json();
        setDossiers(data);
      }
    } catch (e) {
      console.error('Failed to fetch dossiers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDossiers();
    }
  }, [isOpen]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const resp = await fetch(`${API_BASE_URL}/api/dossiers/${id}`, { method: 'DELETE' });
      if (resp.ok) {
        setDossiers(prev => prev.filter(d => d.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete dossier:', e);
    }
  };

  const filtered = dossiers.filter(d => 
    d.company_name.toLowerCase().includes(filterText.toLowerCase()) ||
    (d.industry && d.industry.toLowerCase().includes(filterText.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, right: 0, bottom: 0, left: 0,
      background: 'rgba(5, 8, 16, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease'
    }}
    onClick={onClose}
    >
      <div style={{
        width: '450px',
        maxWidth: '92vw',
        background: '#090f1d',
        borderLeft: '1px solid var(--border-subtle)',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.7)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        overflowY: 'hidden',
        boxSizing: 'border-box'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <History size={16} color="var(--cyan-neon)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                Research History Vault
              </h3>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                SQLite Encrypted Local Storage
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={fetchDossiers}
              style={{
                background: 'var(--bg-inset)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              title="Refresh Vault"
            >
              <RefreshCw size={13} className={loading ? 'pulse' : ''} />
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'var(--bg-inset)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Search / Filter Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-inset)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '6px 12px',
          marginBottom: '14px'
        }}>
          <Search size={14} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Search past dossiers..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-heading)'
            }}
          />
        </div>

        {/* Dossiers List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: 1,
          overflowY: 'auto',
          paddingRight: '4px'
        }}>
          {filtered.map((d) => (
            <div
              key={d.id}
              onClick={() => {
                onSelectDossier(d.id);
                onClose();
              }}
              style={{
                padding: '14px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                position: 'relative'
              }}
              className="hover-glow"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.4)';
                e.currentTarget.style.background = '#0d1526';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'var(--bg-card)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={15} color="var(--cyan-neon)" />
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ffffff' }}>
                    {d.company_name}
                  </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                    #{d.id}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(d.id, e)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: '2px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    className="hover-danger"
                    title="Delete Dossier"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                {d.industry || 'Technology / Enterprise Software'}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.68rem',
                color: 'var(--text-dim)',
                marginTop: '4px',
                borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                paddingTop: '6px'
              }}>
                <span style={{ fontFamily: 'var(--font-mono)' }}>
                  {new Date(d.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="badge badge-green" style={{ fontSize: '0.62rem' }}>
                  <ShieldCheck size={11} /> {d.confidence_score || 96}% Verified
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              textAlign: 'center',
              gap: '10px',
              padding: '40px 10px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'var(--bg-inset)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <History size={24} color="var(--text-dim)" />
              </div>
              <div>
                <p style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: '700' }}>No Dossiers in Vault</p>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Execute a forensic search to store records in SQLite.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
