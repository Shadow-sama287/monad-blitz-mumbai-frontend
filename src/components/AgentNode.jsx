/**
 * AgentNode.jsx
 * 
 * Fixed-position agent node for the canvas.
 * Visual state driven by a single CSS class (idle/paying/processing/in-court/success/mitosis).
 */
import React from 'react';

const TYPE_LABELS = {
  client: 'Client',
  service: 'Service Provider',
  arbitrator: 'Arbitrator',
  child: 'Child Agent',
};

const TYPE_ICONS = {
  client: '🅰',
  service: '🅱',
  arbitrator: '⚖',
  child: '🧬',
};

export default function AgentNode({ agent, state = 'idle', position, onClick, isHidden }) {
  const typeClass = agent.type === 'child' ? 'child' : agent.type;
  const hiddenClass = isHidden ? 'agent-node--hidden' : 'agent-node--spawned';

  return (
    <div
      className={`agent-node agent-node--${typeClass} agent-node--${state} ${isHidden !== undefined ? hiddenClass : ''}`}
      style={{ left: position.x, top: position.y }}
      onClick={() => onClick(agent)}
      id={`node-${agent.id}`}
    >
      <div className="agent-node__card">
        <div className="agent-node__glow" />
        <div className="agent-node__avatar">
          {TYPE_ICONS[agent.type] || '?'}
        </div>
        <div className="agent-node__name">{agent.name}</div>
        <div className="agent-node__role">{TYPE_LABELS[agent.type]}</div>
        <div className="agent-node__rep">
          <span className="agent-node__rep-dot" />
          Rep: {agent.reputation}
        </div>
      </div>
    </div>
  );
}
