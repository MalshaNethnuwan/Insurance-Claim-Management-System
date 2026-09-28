import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SubmitClaimModal } from '../components/SubmitClaimModal';
import { ShieldCheck, PlusCircle, Car, Home, HeartPulse, ShieldAlert } from 'lucide-react';

export const PoliciesPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const data = await api.getPolicies();
      setPolicies(data);
    } catch (err) {
      console.error('Failed to load policies', err);
    } finally {
      setLoading(false);
    }
  };

  const getPolicyIcon = (type) => {
    switch (type) {
      case 'AUTO': return <Car size={24} color="#60a5fa" />;
      case 'HOME': return <Home size={24} color="#34d399" />;
      case 'HEALTH': return <HeartPulse size={24} color="#fb7185" />;
      case 'LIFE': return <ShieldCheck size={24} color="#a78bfa" />;
      default: return <ShieldCheck size={24} color="#818cf8" />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Active Insurance Policies</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Underwritten coverage plans currently backed by MongoDB
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={18} />
          File Claim on Policy
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading policy catalog...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {policies.map(policy => (
            <div key={policy.id || policy.policyNumber} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getPolicyIcon(policy.policyType)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem' }}>{policy.policyNumber}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {policy.policyType} POLICY
                      </span>
                    </div>
                  </div>

                  <span className="badge badge-approved">
                    Active
                  </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  {policy.description}
                </p>

                <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Max Coverage</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-heading)' }}>
                      ${policy.coverageAmount?.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Monthly Premium</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      ${policy.premiumAmount?.toLocaleString()}/mo
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Policy Holder</div>
                    <div style={{ fontWeight: 600 }}>{policy.policyHolderName}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Effective Dates</div>
                    <div>{policy.startDate} - {policy.endDate}</div>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
                onClick={() => setIsModalOpen(true)}
              >
                File Claim Against Policy
              </button>
            </div>
          ))}
        </div>
      )}

      <SubmitClaimModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClaimSubmitted={() => {}}
      />
    </div>
  );
};
