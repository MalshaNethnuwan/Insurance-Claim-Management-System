import React from 'react';
import { Check, Clock, Search, CheckCircle2, DollarSign, XCircle } from 'lucide-react';

export const ClaimTimeline = ({ status }) => {
  const currentStatus = (status || 'SUBMITTED').toUpperCase();
  const isRejected = currentStatus === 'REJECTED';

  const normalSteps = [
    { key: 'SUBMITTED', label: 'Submitted', icon: Clock },
    { key: 'UNDER_REVIEW', label: 'Under Review', icon: Search },
    { key: 'APPROVED', label: 'Approved', icon: CheckCircle2 },
    { key: 'SETTLED', label: 'Settled', icon: DollarSign },
  ];

  const getStepIndex = (st) => {
    switch (st) {
      case 'SUBMITTED': return 0;
      case 'UNDER_REVIEW': return 1;
      case 'APPROVED': return 2;
      case 'SETTLED': return 3;
      case 'REJECTED': return 1; // Branched after submitted/under review
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  if (isRejected) {
    return (
      <div style={{ margin: '1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {/* Connector Line */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            right: '10%',
            height: 2,
            background: 'rgba(244, 63, 94, 0.4)',
            zIndex: 1,
            transform: 'translateY(-50%)',
          }} />

          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
            }}>
              <Check size={14} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Filed</span>
          </div>

          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#f43f5e',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              boxShadow: '0 0 12px rgba(244, 63, 94, 0.5)',
            }}>
              <XCircle size={14} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 600 }}>Rejected</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ margin: '1.25rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {/* Track Line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '5%',
          right: '5%',
          height: 2,
          background: 'var(--border-subtle)',
          zIndex: 1,
          transform: 'translateY(-50%)',
        }} />

        {/* Active Progress Line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '5%',
          width: `${(currentIndex / (normalSteps.length - 1)) * 90}%`,
          height: 2,
          background: 'linear-gradient(90deg, #6366f1, #10b981)',
          zIndex: 1,
          transform: 'translateY(-50%)',
          transition: 'width 0.4s ease-in-out',
        }} />

        {normalSteps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const StepIcon = step.icon;

          let bg = 'var(--bg-tertiary)';
          let border = 'var(--border-subtle)';
          let color = 'var(--text-muted)';
          let shadow = 'none';

          if (isDone) {
            bg = '#10b981';
            border = '#10b981';
            color = '#ffffff';
          } else if (isCurrent) {
            bg = '#6366f1';
            border = '#818cf8';
            color = '#ffffff';
            shadow = '0 0 12px rgba(99, 102, 241, 0.6)';
          }

          return (
            <div
              key={step.key}
              style={{
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: bg,
                border: `2px solid ${border}`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: shadow,
                transition: 'all 0.3s ease',
              }}>
                {isDone ? <Check size={14} /> : <StepIcon size={13} />}
              </div>
              <span style={{
                fontSize: '0.72rem',
                color: isCurrent ? 'var(--text-primary)' : isDone ? 'var(--text-secondary)' : 'var(--text-muted)',
                fontWeight: isCurrent ? 700 : 500,
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
