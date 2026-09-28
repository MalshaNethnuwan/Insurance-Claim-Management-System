import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { AdjusterReviewModal } from '../components/AdjusterReviewModal';
import { RefreshCw, SlidersHorizontal, CheckSquare, Clock, AlertTriangle, DollarSign } from 'lucide-react';

export const AdjusterDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedClaim, setSelectedClaim] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [claimsData, metricsData] = await Promise.all([
        api.getClaims(),
        api.getMetrics().catch(() => null)
      ]);
      setClaims(claimsData);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Failed to load adjuster data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredClaims = filter === 'ALL'
    ? claims
    : claims.filter(c => c.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Adjuster Review Queue</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Triaging, auditing, approving, and settling policyholder insurance claims
          </p>
        </div>

        <button className="btn btn-secondary" onClick={loadData} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          Refresh Queue
        </button>
      </div>

      {/* Aggregate Metric Stats */}
      {metrics && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Claims</div>
            <div className="stat-value">{metrics.totalClaims}</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-label">Under Review</div>
            <div className="stat-value">{metrics.underReview}</div>
          </div>
          <div className="stat-card emerald">
            <div className="stat-label">Approved</div>
            <div className="stat-value">{metrics.approved}</div>
          </div>
          <div className="stat-card purple">
            <div className="stat-label">Settled Payouts</div>
            <div className="stat-value">{metrics.settled}</div>
          </div>
          <div className="stat-card cyan">
            <div className="stat-label">Claimed Volume</div>
            <div className="stat-value">${metrics.totalClaimedAmount?.toLocaleString()}</div>
          </div>
          <div className="stat-card emerald">
            <div className="stat-label">Disbursed Payouts</div>
            <div className="stat-value">${metrics.totalSettledAmount?.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'SETTLED', 'REJECTED'].map(tab => (
          <button
            key={tab}
            className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(tab)}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Claims Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Claim Reference</th>
              <th>Policy</th>
              <th>Claimant</th>
              <th>Incident Date</th>
              <th>Claim Amount</th>
              <th>Payout</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  Loading claim records...
                </td>
              </tr>
            ) : filteredClaims.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No claims found matching filter: {filter}
                </td>
              </tr>
            ) : (
              filteredClaims.map(claim => (
                <tr key={claim.id}>
                  <td style={{ fontWeight: 700 }}>{claim.claimNumber}</td>
                  <td>{claim.policyNumber}</td>
                  <td>
                    <div>{claim.policyHolderName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{claim.claimantEmail}</div>
                  </td>
                  <td>{claim.incidentDate}</td>
                  <td style={{ fontWeight: 600 }}>${claim.claimAmount?.toLocaleString()}</td>
                  <td style={{ color: claim.payoutAmount > 0 ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
                    ${claim.payoutAmount?.toLocaleString()}
                  </td>
                  <td>
                    <StatusBadge status={claim.status} />
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedClaim(claim)}
                    >
                      Audit / Action
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Adjuster Action Drawer Modal */}
      {selectedClaim && (
        <AdjusterReviewModal
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
          onUpdated={loadData}
        />
      )}
    </div>
  );
};
