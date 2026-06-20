/**
 * ConnectionLines.jsx
 * 
 * SVG overlay showing flow connections between agent nodes.
 * Lines: A→B (job/payment), B→Judge (dispute), B→B1 (mitosis).
 * Uses static coordinates matching node positions.
 */
import React from 'react';

// Node center positions (must match the positions used in App.jsx)
// We add ~90px to x (half of 180px node width) and ~70px to y (approx center)
const CENTERS = {
  'agent-a': { x: 290, y: 210 },   // left: 200 + 90, top: 140 + 70
  'agent-b': { x: 650, y: 210 },   // left: 560 + 90, top: 140 + 70
  'judge':   { x: 470, y: 430 },   // left: 380 + 90, top: 360 + 70
  'agent-b1':{ x: 900, y: 210 },   // left: 810 + 90, top: 140 + 70
};

export default function ConnectionLines({ activeFlow, disputeActive, mitosisActive }) {
  const a = CENTERS['agent-a'];
  const b = CENTERS['agent-b'];
  const j = CENTERS['judge'];
  const b1 = CENTERS['agent-b1'];

  return (
    <svg className="connections-svg">
      <defs>
        {/* Gradient for A→B line */}
        <linearGradient id="grad-job" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF99C8" />
          <stop offset="100%" stopColor="#A9DEF9" />
        </linearGradient>
        {/* Gradient for B→Judge */}
        <linearGradient id="grad-dispute" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A9DEF9" />
          <stop offset="100%" stopColor="#FCF6BD" />
        </linearGradient>
        {/* Gradient for B→B1 */}
        <linearGradient id="grad-mitosis" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A9DEF9" />
          <stop offset="100%" stopColor="#E4C1F9" />
        </linearGradient>
      </defs>

      {/* A → B : Job/Payment flow (always visible at low opacity) */}
      <line
        x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        className={`connection-line connection-line--job`}
        style={{ opacity: 0.2 }}
      />

      {/* Animated pulse dot along A→B */}
      {activeFlow === 'job' && (
        <circle r="5" fill="#FF99C8" opacity="0.9">
          <animateMotion
            dur="1.5s"
            repeatCount="indefinite"
            path={`M${a.x},${a.y} L${b.x},${b.y}`}
          />
        </circle>
      )}

      {/* B → Judge : Dispute flow (hidden until dispute) */}
      <line
        x1={b.x} y1={b.y} x2={j.x} y2={j.y}
        className={`connection-line connection-line--dispute ${disputeActive ? 'active' : ''}`}
      />

      {/* Animated pulse dot along B→Judge */}
      {activeFlow === 'dispute' && (
        <circle r="5" fill="#FF6B6B" opacity="0.9">
          <animateMotion
            dur="1.2s"
            repeatCount="indefinite"
            path={`M${b.x},${b.y} L${j.x},${j.y}`}
          />
        </circle>
      )}

      {/* B → B1 : Mitosis flow (hidden until mitosis) */}
      <line
        x1={b.x} y1={b.y} x2={b1.x} y2={b1.y}
        className={`connection-line connection-line--mitosis ${mitosisActive ? 'active' : ''}`}
      />

      {/* Animated pulse dot along B→B1 */}
      {activeFlow === 'mitosis' && (
        <circle r="5" fill="#E4C1F9" opacity="0.9">
          <animateMotion
            dur="1s"
            repeatCount="indefinite"
            path={`M${b.x},${b.y} L${b1.x},${b1.y}`}
          />
        </circle>
      )}
    </svg>
  );
}
