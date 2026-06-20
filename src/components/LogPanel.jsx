/**
 * LogPanel.jsx
 * 
 * Bottom panel showing action log with timestamps and Monad explorer tx links.
 * Resizable via drag handle, collapsible via header click.
 * Pixel art styled — the biggest credibility signal for judges.
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';

export default function LogPanel({ logs }) {
  const listRef = useRef(null);
  const panelRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const [height, setHeight] = useState(200);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startH = useRef(0);

  // Keep newest entry visible
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [logs]);

  // ── Drag resize ─────────────────────────────────────────────
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    startY.current = e.clientY;
    startH.current = height;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';

    const onMove = (ev) => {
      if (!isDragging.current) return;
      const delta = startY.current - ev.clientY;
      const newH = Math.max(80, Math.min(window.innerHeight * 0.8, startH.current + delta));
      setHeight(newH);
      setCollapsed(false);
    };

    const onUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [height]);

  const toggleCollapse = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  return (
    <div
      className={`log-panel ${collapsed ? 'log-panel--collapsed' : ''}`}
      id="log-panel"
      ref={panelRef}
      style={collapsed ? {} : { height: `${height}px` }}
    >
      {/* Drag handle */}
      {!collapsed && (
        <div className="log-panel__resize-handle" onMouseDown={handleMouseDown} />
      )}

      <div className="log-panel__header" onClick={toggleCollapse}>
        <span className="log-panel__header-dot" />
        Activity Log — Monad Testnet
        <span className="log-panel__toggle">
          {collapsed ? '▲ EXPAND' : '▼ COLLAPSE'}
        </span>
      </div>

      {!collapsed && (
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
                  [TX]
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
