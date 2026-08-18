import React from 'react';
import { ProductForensics } from '../types';
import { 
  Package, Map, AlertCircle, MessageSquareWarning, 
  Star, ThumbsUp, ThumbsDown, CheckCircle2, ShieldAlert 
} from 'lucide-react';

interface ProductSentimentCardProps {
  data: ProductForensics;
}

export const ProductSentimentCard: React.FC<ProductSentimentCardProps> = ({ data }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Sentiment Summary Bar */}
      <div className="glass-panel" style={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        background: 'var(--bg-surface)'
      }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Product Suite & User Sentiment Forensic</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-world capabilities, public roadmaps, and mined user complaints.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>Public Sentiment</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={16} color="var(--status-amber)" fill="var(--status-amber)" />
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {data.reviews_sentiment?.rating_estimate || data.reviews_summary?.average_rating || '4.5'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                ({data.reviews_sentiment?.sentiment_score ?? data.reviews_summary?.sentiment_score ?? 85}/100)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Current Products vs Roadmap */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Core Products */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Package size={18} color="var(--accent-blue)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Current Product Lineup</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.current_products.map((prod, idx) => {
              const features = prod.key_features || prod.key_capabilities || [];
              return (
                <div key={idx} style={{
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{prod.name}</h5>
                    {prod.maturity_stage && (
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{prod.maturity_stage}</span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{prod.description}</p>
                  {features.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      {features.map((f, fi) => (
                        <span key={fi} className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{f}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Public Roadmap */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Map size={18} color="var(--accent-violet)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Announced Roadmap & Upcoming Betas</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.product_roadmap.map((item, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-inset)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: '700' }}>{item.feature_or_version}</h5>
                  <span className="badge badge-violet" style={{ fontSize: '0.65rem' }}>{item.status}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.expected_impact}</p>
              </div>
            ))}
            {data.product_roadmap.length === 0 && (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                No public beta or roadmap items disclosed.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2-Column: Weaknesses vs Real Complaints */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Product Weaknesses */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <AlertCircle size={18} color="var(--status-amber)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Product Weaknesses & Gaps</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.weaknesses.map((w, idx) => (
              <div key={idx} style={{
                padding: '10px 12px',
                background: 'var(--status-amber-soft)',
                border: '1px solid var(--status-amber-border)',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <span style={{ color: 'var(--status-amber)', fontWeight: '800' }}>•</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Complaints */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <MessageSquareWarning size={18} color="var(--status-red)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Real User Complaints (G2, Reddit, Capterra)</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.user_complaints.map((c, idx) => (
              <div key={idx} style={{
                padding: '10px 12px',
                background: 'var(--status-red-soft)',
                border: '1px solid var(--status-red-border)',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>{c.category}</span>
                  {c.source && <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>via {c.source}</span>}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                  "{c.complaint}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
