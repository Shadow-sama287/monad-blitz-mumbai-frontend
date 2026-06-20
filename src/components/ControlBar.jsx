/**
 * ControlBar.jsx
 * 
 * Left-side control buttons for triggering the demo flows:
 * 1. Happy Path (job → feedback)
 * 2. Dispute Path (bad job → dispute → verdict)
 * 3. Mitosis (manual trigger)
 */
import React from 'react';

export default function ControlBar({ onHappyPath, onDisputePath, onMitosis, isLoading, b1Spawned }) {
  return (
    <div className="control-bar" id="control-bar">
      <button
        className="control-btn control-btn--happy"
        onClick={onHappyPath}
        disabled={isLoading}
        id="btn-happy-path"
      >
        <span className="control-btn__icon">✦</span>
        Happy Path
      </button>
      <button
        className="control-btn control-btn--dispute"
        onClick={onDisputePath}
        disabled={isLoading}
        id="btn-dispute-path"
      >
        <span className="control-btn__icon">⚔</span>
        Dispute Path
      </button>
      <button
        className="control-btn control-btn--mitosis"
        onClick={onMitosis}
        disabled={isLoading || b1Spawned}
        id="btn-mitosis"
      >
        <span className="control-btn__icon">🧬</span>
        {b1Spawned ? 'B1 Spawned' : 'Trigger Mitosis'}
      </button>
    </div>
  );
}
