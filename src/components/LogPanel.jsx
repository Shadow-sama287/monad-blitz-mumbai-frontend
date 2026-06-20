/**
 * LogPanel.jsx
 * 
 * Bottom panel showing action log with timestamps and Monad explorer tx links.
 * Simple list — the biggest credibility signal for judges.
 */
import React, { useRef, useEffect } from 'react';

export default function LogPanel({ logs }) {
  const listRef = useRef(null);

  // Keep newest entry visible (logs are prepended, so scroll to top)
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="log-panel" id="log-panel">
      <div className="log-panel__header">
        <span className="log-panel__header-dot" />
        Activity Log — Monad Testnet
      </div>
      <ul className="log-panel__list" ref={listRef}>
        {logs.length === 0 && (
          <li className="log-entry" style={{ color: 'var(--text-muted)' }}>
            <span className="log-entry__time">--:--:--</span>
            <span className="log-entry__msg">Waiting for actions…</span>
          </li>
        )}
        {logs.map((entry) => (
          <li key={entry.id} className={`log-entry log-entry--${entry.type}`}>
            <span className="log-entry__time">{entry.time}</span>
            <span className="log-entry__msg">{entry.msg}</span>
            {entry.txUrl && (
              <a
                className="log-entry__tx"
                href={entry.txUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                tx ↗
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
