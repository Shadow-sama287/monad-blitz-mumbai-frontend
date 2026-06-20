/**
 * InspectorDrawer.jsx
 * 
 * Glassmorphic slide-in drawer showing agent details.
 * Opens on node click, shows ID, wallet, reputation, role, children.
 */
import React from 'react';

const ROLE_DESCRIPTIONS = {
  client: 'Submits smart contracts for external audit. Funds jobs and provides post-delivery feedback.',
  service: 'Performs Solidity static analysis, gas optimization, and vulnerability patching on submitted contracts.',
  arbitrator: 'Evaluates disputed job outputs and writes binding verdicts to the Monad Reputation Registry.',
  child: 'Spawned via Mitosis from a parent service agent. Inherits skills and operates independently on-chain.',
};

const TYPE_COLORS = {
  client: 'var(--pink)',
  service: 'var(--sky)',
  arbitrator: 'var(--yellow)',
  child: 'var(--lavender)',
};

export default function InspectorDrawer({ agent, isOpen, onClose }) {
  if (!agent) return null;

  const accentColor = TYPE_COLORS[agent.type] || 'var(--text)';

  return (
    <>
      {/* Overlay */}
      <div
        className={`inspector-overlay ${isOpen ? 'inspector-overlay--open' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`inspector-drawer ${isOpen ? 'inspector-drawer--open' : ''}`}>
        <button className="inspector-drawer__close" onClick={onClose}>✕</button>

        <div className="inspector-drawer__title" style={{ color: accentColor }}>
          {agent.name}
        </div>
        <div className="inspector-drawer__subtitle">
          {agent.type.toUpperCase()} AGENT
        </div>

        {/* ID */}
        <div className="inspector-field">
          <div className="inspector-field__label">Agent ID</div>
          <div className="inspector-field__value">{agent.id}</div>
        </div>

        {/* Wallet */}
        <div className="inspector-field">
          <div className="inspector-field__label">Wallet Address</div>
          <div className="inspector-field__value">{agent.wallet}</div>
        </div>

        {/* Reputation */}
        <div className="inspector-field">
          <div className="inspector-field__label">Reputation Score</div>
          <div className="inspector-field__value inspector-field__value--accent" style={{ color: accentColor }}>
            {agent.reputation}
          </div>
        </div>

        {/* Role Description */}
        <div className="inspector-field">
          <div className="inspector-field__label">Role</div>
          <div className="inspector-field__value" style={{ fontFamily: 'var(--font-sans)', lineHeight: '1.5' }}>
            {ROLE_DESCRIPTIONS[agent.type]}
          </div>
        </div>

        {/* Parent (if child) */}
        {agent.parent && (
          <div className="inspector-field">
            <div className="inspector-field__label">Parent Agent</div>
            <div className="inspector-field__value" style={{ color: 'var(--sky)' }}>
              {agent.parent}
            </div>
          </div>
        )}

        {/* Skills (for service/child types) */}
        {(agent.type === 'service' || agent.type === 'child') && (
          <div className="inspector-field">
            <div className="inspector-field__label">Skills</div>
            <div className="inspector-field__value" style={{ fontFamily: 'var(--font-sans)' }}>
              Solidity-Static-Analysis, Gas-Optimization, Vulnerability-Patching
            </div>
          </div>
        )}

        {/* Children */}
        <div className="inspector-field">
          <div className="inspector-field__label">Children</div>
          {agent.children && agent.children.length > 0 ? (
            <ul className="inspector-field__children">
              {agent.children.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          ) : (
            <div className="inspector-field__children--empty">No children spawned</div>
          )}
        </div>
      </div>
    </>
  );
}
