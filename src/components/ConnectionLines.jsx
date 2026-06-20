/**
 * ConnectionLines.jsx
 * 
 * SVG overlay with pixel-art styled connections.
 * Sequential glowing dots light up one-by-one along paths during flows.
 * Dispute highlights both A→Judge and B→Judge connections.
 */
import React, { useState, useEffect, useRef } from 'react';

// Node center positions (must match the positions used in App.jsx)
const CENTERS = {
  'agent-a': { x: 290, y: 210 },
  'agent-b': { x: 650, y: 210 },
  'judge':   { x: 470, y: 430 },
  'agent-b1':{ x: 900, y: 210 },
};

// Generate evenly spaced dots along a line
function getDots(from, to, count = 8) {
  const dots = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    dots.push({
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    });
  }
  return dots;
}

export default function ConnectionLines({ activeFlow, disputeActive, mitosisActive }) {
  const a = CENTERS['agent-a'];
  const b = CENTERS['agent-b'];
  const j = CENTERS['judge'];
  const b1 = CENTERS['agent-b1'];

  // Sequential glow state — which dot index is currently glowing
  const [glowIdx, setGlowIdx] = useState(-1);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (activeFlow) {
      let idx = 0;
      const dotCount = activeFlow === 'dispute' ? 8 : activeFlow === 'mitosis' ? 6 : 10;
      setGlowIdx(0);
      intervalRef.current = setInterval(() => {
        idx = (idx + 1) % (dotCount + 1);
        setGlowIdx(idx);
      }, 180);
    } else {
      clearInterval(intervalRef.current);
      setGlowIdx(-1);
    }
    return () => clearInterval(intervalRef.current);
  }, [activeFlow]);

  // Dot arrays
  const jobDots = getDots(a, b, 10);
  const disputeDotsAJ = getDots(a, j, 8);  // A → Judge (both in court)
  const disputeDotsBJ = getDots(b, j, 8);  // B → Judge
  const mitosisDots = getDots(b, b1, 6);

  return (
    <svg className="connections-svg">
      <defs>
        <filter id="pixel-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ─── A → B : Job/Payment flow ─────────────────────────── */}
      <line
        x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        className="connection-line connection-line--job"
      />
      {/* Sequential glowing dots A→B */}
      {jobDots.map((dot, i) => (
        <rect
          key={`job-${i}`}
          x={dot.x - 4} y={dot.y - 4}
          width={8} height={8}
          fill="#FF99C8"
          className={`seq-dot ${activeFlow === 'job' && glowIdx === i ? 'seq-dot--glow' : ''}`}
          style={{
            opacity: activeFlow === 'job'
              ? (glowIdx === i ? 1 : glowIdx === (i - 1) ? 0.5 : glowIdx === (i - 2) ? 0.25 : 0.08)
              : 0.08,
            filter: activeFlow === 'job' && glowIdx === i ? 'url(#pixel-glow)' : 'none',
          }}
        />
      ))}

      {/* ─── A → Judge : Dispute flow (A also in court) ───────── */}
      <line
        x1={a.x} y1={a.y} x2={j.x} y2={j.y}
        className={`connection-line connection-line--dispute ${disputeActive ? 'active' : ''}`}
      />
      {disputeActive && disputeDotsAJ.map((dot, i) => (
        <rect
          key={`disp-aj-${i}`}
          x={dot.x - 4} y={dot.y - 4}
          width={8} height={8}
          fill="#FF6B6B"
          className={`seq-dot ${activeFlow === 'dispute' && glowIdx === i ? 'seq-dot--glow' : ''}`}
          style={{
            opacity: activeFlow === 'dispute'
              ? (glowIdx === i ? 1 : glowIdx === (i - 1) ? 0.5 : 0.12)
              : 0.12,
            filter: activeFlow === 'dispute' && glowIdx === i ? 'url(#pixel-glow)' : 'none',
          }}
        />
      ))}

      {/* ─── B → Judge : Dispute flow ─────────────────────────── */}
      <line
        x1={b.x} y1={b.y} x2={j.x} y2={j.y}
        className={`connection-line connection-line--dispute ${disputeActive ? 'active' : ''}`}
      />
      {disputeActive && disputeDotsBJ.map((dot, i) => (
        <rect
          key={`disp-bj-${i}`}
          x={dot.x - 4} y={dot.y - 4}
          width={8} height={8}
          fill="#FF6B6B"
          className={`seq-dot ${activeFlow === 'dispute' && glowIdx === i ? 'seq-dot--glow' : ''}`}
          style={{
            opacity: activeFlow === 'dispute'
              ? (glowIdx === i ? 1 : glowIdx === (i - 1) ? 0.5 : 0.12)
              : 0.12,
            filter: activeFlow === 'dispute' && glowIdx === i ? 'url(#pixel-glow)' : 'none',
          }}
        />
      ))}

      {/* ─── B → B1 : Mitosis flow ────────────────────────────── */}
      <line
        x1={b.x} y1={b.y} x2={b1.x} y2={b1.y}
        className={`connection-line connection-line--mitosis ${mitosisActive ? 'active' : ''}`}
      />
      {mitosisActive && mitosisDots.map((dot, i) => (
        <rect
          key={`mit-${i}`}
          x={dot.x - 4} y={dot.y - 4}
          width={8} height={8}
          fill="#E4C1F9"
          className={`seq-dot ${activeFlow === 'mitosis' && glowIdx === i ? 'seq-dot--glow' : ''}`}
          style={{
            opacity: activeFlow === 'mitosis'
              ? (glowIdx === i ? 1 : glowIdx === (i - 1) ? 0.5 : 0.12)
              : 0.12,
            filter: activeFlow === 'mitosis' && glowIdx === i ? 'url(#pixel-glow)' : 'none',
          }}
        />
      ))}
    </svg>
  );
}
