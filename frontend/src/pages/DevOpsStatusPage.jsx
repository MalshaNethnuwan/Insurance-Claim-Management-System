import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DevOpsHealthWidget } from '../components/DevOpsHealthWidget';
import { Server, Database, GitBranch, Terminal, Shield, CheckCircle, ExternalLink, Activity } from 'lucide-react';

export const DevOpsStatusPage = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHealth()
      .then(data => setHealthData(data))
      .catch(() => setHealthData(null))
      .finally(() => setLoading(false));
  }, []);

  const phases = [
    { num: 'Phase 1', title: 'Git, Monorepo & Shell Scripting', status: 'COMPLETED', desc: 'Monorepo architecture, Spring Boot 3 + React, GitFlow, and Bash automation scripts.' },
    { num: 'Phase 2', title: 'Docker Containerization', status: 'READY', desc: 'Multi-stage non-root Dockerfiles and compose orchestration.' },
    { num: 'Phase 3', title: 'Terraform (AWS Cloud IaC)', status: 'PLANNED', desc: 'VPC, multi-AZ subnets, Security Groups, Free Tier EC2, and S3 backend state locking.' },
    { num: 'Phase 4', title: 'Ansible Configuration Management', status: 'PLANNED', desc: 'Idempotent roles, playbooks, Jinja2 templates, and Ansible Vault encryption.' },
    { num: 'Phase 5', title: 'Jenkins CI/CD Pipeline (Groovy)', status: 'PLANNED', desc: 'Declarative Jenkinsfile, Groovy shared libraries, SonarQube, Trivy, and Docker Hub.' },
    { num: 'Phase 6', title: 'Kubernetes & Observability', status: 'PLANNED', desc: 'K8s StatefulSets, Ingress, HPA, Prometheus, and Grafana dashboards.' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>DevOps Infrastructure & Observability</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Real-time telemetry, Spring Boot Actuator status, and cloud deployment roadmap
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <DevOpsHealthWidget />
      </div>

      {/* Actuator JSON Telemetry */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="#6366f1" />
            <h3 style={{ fontSize: '1.1rem' }}>Spring Boot 3 Actuator Probe</h3>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
            >
              <span>Swagger UI</span>
              <ExternalLink size={12} />
            </a>
            <a
              href="http://localhost:8080/actuator/health"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
            >
              <span>Raw JSON</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <pre style={{
          background: 'var(--bg-secondary)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.82rem',
          overflowX: 'auto',
          border: '1px solid var(--border-subtle)',
          color: '#38bdf8',
          fontFamily: 'monospace'
        }}>
          {loading ? 'Probing actuator endpoint...' : JSON.stringify(healthData, null, 2) || 'Backend is currently offline or unreachable.'}
        </pre>
      </div>

      {/* DevOps Phased Roadmap */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>DevOps Engineering Roadmap</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {phases.map((p) => (
            <div
              key={p.num}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{p.num}</span>
                  <strong>{p.title}</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                  {p.desc}
                </p>
              </div>

              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  background: p.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: p.status === 'COMPLETED' ? '#34d399' : 'var(--text-muted)',
                  border: `1px solid ${p.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`
                }}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
