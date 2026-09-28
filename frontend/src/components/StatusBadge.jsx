import React from 'react';
import { Clock, Search, CheckCircle, DollarSign, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'SUBMITTED').toUpperCase();

  const getBadgeConfig = () => {
    switch (normalized) {
      case 'SUBMITTED':
        return {
          label: 'Submitted',
          className: 'submitted',
          icon: <Clock size={12} />,
        };
      case 'UNDER_REVIEW':
        return {
          label: 'Under Review',
          className: 'under_review',
          icon: <Search size={12} />,
        };
      case 'APPROVED':
        return {
          label: 'Approved',
          className: 'approved',
          icon: <CheckCircle size={12} />,
        };
      case 'SETTLED':
        return {
          label: 'Settled',
          className: 'settled',
          icon: <DollarSign size={12} />,
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          className: 'rejected',
          icon: <XCircle size={12} />,
        };
      default:
        return {
          label: normalized,
          className: 'submitted',
          icon: <Clock size={12} />,
        };
    }
  };

  const { label, className, icon } = getBadgeConfig();

  return (
    <span className={`status-badge ${className}`}>
      {icon}
      <span>{label}</span>
    </span>
  );
};
