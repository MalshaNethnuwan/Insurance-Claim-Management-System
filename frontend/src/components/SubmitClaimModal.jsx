import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Send, AlertCircle, FilePlus } from 'lucide-react';

export const SubmitClaimModal = ({ isOpen, onClose, onClaimSubmitted }) => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [policyNumber, setPolicyNumber] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [incidentDate, setIncidentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      api.getPolicies()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setPolicies(data);
            if (!policyNumber) {
              setPolicyNumber(data[0].policyNumber);
            }
          }
        })
        .catch(() => {
          // Provide fallback demo policies if backend is offline
          const demoPolicies = [
            { policyNumber: 'POL-AUTO-101', type: 'AUTO' },
            { policyNumber: 'POL-HOME-202', type: 'HOME' },
            { policyNumber: 'POL-HLTH-303', type: 'HEALTH' },
            { policyNumber: 'POL-LIFE-404', type: 'LIFE' },
          ];
          setPolicies(demoPolicies);
          if (!policyNumber) {
            setPolicyNumber(demoPolicies[0].policyNumber);
          }
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!policyNumber || !claimAmount || !description || !incidentDate) {
      setError('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createClaim({
        policyNumber: policyNumber.trim(),
        claimAmount: parseFloat(claimAmount),
        incidentDate,
        description: description.trim(),
        policyHolderName: user?.fullName || user?.username || 'Valued Policyholder',
        claimantEmail: user?.email || 'claimant@insurance.demo',
      });

      if (onClaimSubmitted) onClaimSubmitted();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              padding: '0.4rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
            }}>
              <FilePlus size={18} color="#fff" />
            </div>
            <div>
              <h2>Submit Insurance Claim</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>
                Initiates evaluation in the adjuster review queue
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--status-rejected-bg)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--status-rejected-text)',
            fontSize: '0.85rem',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Associated Policy Number</label>
            {policies.length > 0 ? (
              <select
                className="form-select"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
              >
                {policies.map((p) => (
                  <option key={p.policyNumber} value={p.policyNumber}>
                    {p.policyNumber} ({p.type || 'Standard Policy'})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="form-input"
                placeholder="e.g. POL-AUTO-101"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                required
              />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Claim Amount ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="2500.00"
                className="form-input"
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Incident Date</label>
              <input
                type="date"
                className="form-input"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Incident Description & Circumstances</label>
            <textarea
              rows="4"
              className="form-textarea"
              placeholder="Provide a detailed description of the incident, damage, or medical event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Send size={15} />
              <span>{loading ? 'Submitting...' : 'Submit Claim'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
