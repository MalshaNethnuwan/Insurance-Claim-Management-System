import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Activity, RefreshCw } from 'lucide-react';

export const DevOpsHealthWidget = () => {
  const [health, setHealth] = useState(null);
  const [latency, setLatency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const data = await api.getHealth();
      const end = performance.now();
      setLatency(Math.round(end - start));
      setHealth(data);
      setError(false);
    } catch (err) {
      setError(true);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const isUp = !error && health?.status === 'UP';
  const mongoStatus = health?.components?.mongo?.status || (isUp ? 'UP' : 'UNKNOWN');

  return (
    <div className="health-widget">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Activity size={16} color={isUp ? '#10b981' : '#f43f5e'} />
        <span><strong>Spring Actuator:</strong></span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span className={`health-dot ${isUp ? 'up' : 'down'}`} />
          {isUp ? 'HEALTHY (UP)' : 'DEGRADED / DOWN'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span><strong>MongoDB:</strong></span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span className={`health-dot ${mongoStatus === 'UP' ? 'up' : 'down'}`} />
          {mongoStatus}
        </span>
      </div>

      {latency !== null && (
        <div>
          <span><strong>Latency:</strong> {latency}ms</span>
        </div>
      )}

      <button
        onClick={fetchHealth}
        disabled={loading}
        title="Refresh probe"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          marginLeft: 'auto'
        }}
      >
        <RefreshCw size={14} className={loading ? 'spinning' : ''} />
      </button>
    </div>
  );
};
