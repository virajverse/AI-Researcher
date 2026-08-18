import React from 'react';
import { BusinessIntelligence } from '../types';
import { 
  DollarSign, ShoppingCart, Users, Building, 
  Globe2, CheckCircle2, TrendingUp 
} from 'lucide-react';

interface BusinessModelCardProps {
  data: BusinessIntelligence;
}

export const BusinessModelCard: React.FC<BusinessModelCardProps> = ({ data }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Monetization & Value Stream Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* What They Sell */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <ShoppingCart size={18} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>What Do They Sell? (Offerings)</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.what_they_sell.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 12px',
                background: 'var(--bg-inset)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                <CheckCircle2 size={16} color="var(--accent-blue)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Model & Pricing */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={18} color="var(--status-green)" />
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Revenue Model & Pricing</h3>
            </div>
            <span className="badge badge-green">
              {data.revenue_model.model_type}
            </span>
          </div>

          {data.revenue_model.estimated_arr_or_revenue && (
            <div style={{
              background: 'var(--status-green-soft)',
              border: '1px solid var(--status-green-border)',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Estimated Revenue / ARR</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--status-green)' }}>
                {data.revenue_model.estimated_arr_or_revenue}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Pricing Architecture:</label>
            {data.revenue_model.pricing_structure.map((tier, idx) => (
              <div key={idx} style={{
                fontSize: '0.8rem',
                color: 'var(--text-main)',
                padding: '6px 10px',
                background: 'var(--bg-inset)',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)'
              }}>
                • {tier}
              </div>
            ))}
          </div>

          {data.revenue_model.monetization_notes && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.4', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign size={14} color="var(--cyan-neon)" style={{ flexShrink: 0 }} />
              <span>{data.revenue_model.monetization_notes}</span>
            </p>
          )}
        </div>
      </div>

      {/* ICP Buyer Personas & Customer Logos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Who Buys (ICP) */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Users size={18} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Who Buys? (Target Buyer Personas)</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
            {data.who_buys.map((persona, idx) => (
              <div key={idx} style={{
                padding: '12px',
                background: 'var(--bg-inset)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>{persona.target_persona}</h4>
                  <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{persona.target_segment}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Buyer vs User Dynamic: <strong style={{ color: 'var(--text-main)' }}>{persona.buyer_vs_user}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Logos & Main Markets */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Building size={18} color="var(--accent-violet)" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Main Customers & Geographic Markets</h3>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
              Target Geographies:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {data.main_markets.map((m, idx) => (
                <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                  <Globe2 size={12} /> {m}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
              Notable Customer Segments & Logos:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {data.main_customers.map((c, idx) => (
                <div key={idx} style={{
                  padding: '6px 10px',
                  background: 'var(--bg-inset)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-main)'
                }}>
                  {c.name} {c.industry && <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>({c.industry})</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
