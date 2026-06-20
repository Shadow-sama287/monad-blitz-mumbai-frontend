/**
 * App.jsx
 * 
 * Agent Court — 8-Bit Pixel Art Canvas
 * Features: pan & zoom (Excalidraw-style), pixel art theme,
 * sequential glowing dots, both A & B highlighted in dispute.
 * 
 * All state flows through the useAgentEconomy hook.
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAgentEconomy } from './hooks/useAgentEconomy';
import AgentNode from './components/AgentNode';
import ConnectionLines from './components/ConnectionLines';
import InspectorDrawer from './components/InspectorDrawer';
import LogPanel from './components/LogPanel';
import ControlBar from './components/ControlBar';

// ── Fixed node positions (absolute px in canvas space) ────────────────
const NODE_POSITIONS = {
  'agent-a':  { x: 200, y: 140 },
  'agent-b':  { x: 560, y: 140 },
  'judge':    { x: 380, y: 360 },
  'agent-b1': { x: 810, y: 140 },
};

export default function App() {
  const {
    agents,
    logs,
    nodeStates,
    b1Spawned,
    activeFlow,
    isLoading,
    disputeActive,
    mitosisActive,
    fetchAgents,
    submitJob,
    submitFeedback,
    submitDispute,
    triggerMitosis,
    addLog,
  } = useAgentEconomy();

  const [selectedAgent, setSelectedAgent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Canvas pan & zoom state ─────────────────────────────────
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOffset = useRef({ x: 0, y: 0 });

  // Load agents on mount
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchAgents();
  }, [fetchAgents]);

  // ── Click-to-inspect ────────────────────────────────────────
  const handleNodeClick = useCallback((agent) => {
    setSelectedAgent(agent);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedAgent(null), 300);
  }, []);

  // ── Demo Flows ──────────────────────────────────────────────
  const handleHappyPath = useCallback(async () => {
    addLog('── STARTING HAPPY PATH ──', 'info');
    const result = await submitJob(false);
    if (result) {
      await submitFeedback(result.jobId);
      addLog('── HAPPY PATH COMPLETE ──', 'success');
    }
  }, [submitJob, submitFeedback, addLog]);

  const handleDisputePath = useCallback(async () => {
    addLog('── STARTING DISPUTE PATH ──', 'info');
    const result = await submitJob(true);
    if (result) {
      await submitDispute(result.jobId, 'Smart contract audit request', result.output);
      addLog('── DISPUTE PATH COMPLETE ──', 'error');
    }
  }, [submitJob, submitDispute, addLog]);

  const handleMitosis = useCallback(async () => {
    await triggerMitosis();
  }, [triggerMitosis]);

  // ── Canvas panning ──────────────────────────────────────────
  const handleCanvasMouseDown = useCallback((e) => {
    // Only pan if clicking the canvas background, not a node
    if (e.target.closest('.agent-node') || e.target.closest('.control-bar')) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    panOffset.current = { ...pan };
  }, [pan]);

  const handleCanvasMouseMove = useCallback((e) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setPan({
      x: panOffset.current.x + dx,
      y: panOffset.current.y + dy,
    });
  }, []);

  const handleCanvasMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // ── Canvas zoom (scroll wheel) ──────────────────────────────
  const handleWheel = useCallback((e) => {
    if (e.target.closest('.log-panel') || e.target.closest('.inspector-drawer')) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom((z) => Math.max(0.3, Math.min(2.5, z + delta)));
  }, []);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // ── Zoom controls ───────────────────────────────────────────
  const zoomIn = useCallback(() => setZoom((z) => Math.min(2.5, z + 0.15)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(0.3, z - 0.15)), []);
  const zoomReset = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  // ── Separate agents for rendering ──────────────────────────
  const mainAgents = agents.filter((a) => a.id !== 'agent-b1');
  const b1Agent = agents.find((a) => a.id === 'agent-b1');

  const currentSelectedAgent = selectedAgent
    ? agents.find((a) => a.id === selectedAgent.id) || selectedAgent
    : null;

  return (
    <>
      {/* Grid background */}
      <div className="canvas-grid" />

      <div className="app-layout">
        <div
          className="canvas-area"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        >
          {/* Header */}
          <header className="app-header">
            <div className="app-title">
              <span className="accent">⬡</span> AGENT COURT
              <span className="badge badge--live">ERC-8004</span>
              <span className="badge">MONAD</span>
            </div>
            <div className="zoom-controls">
              <button className="zoom-btn" onClick={zoomOut}>−</button>
              <span className="zoom-level">{Math.round(zoom * 100)}%</span>
              <button className="zoom-btn" onClick={zoomIn}>+</button>
              <button className="zoom-btn" onClick={zoomReset}>⟲</button>
            </div>
          </header>

          {/* Control buttons */}
          <ControlBar
            onHappyPath={handleHappyPath}
            onDisputePath={handleDisputePath}
            onMitosis={handleMitosis}
            isLoading={isLoading}
            b1Spawned={b1Spawned}
          />

          {/* Pannable & Zoomable canvas */}
          <div
            className="canvas-transform"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            {/* SVG connection lines */}
            <ConnectionLines
              activeFlow={activeFlow}
              disputeActive={disputeActive}
              mitosisActive={mitosisActive}
            />

            {/* Agent nodes */}
            {mainAgents.map((agent) => (
              <AgentNode
                key={agent.id}
                agent={agent}
                state={nodeStates[agent.id]}
                position={NODE_POSITIONS[agent.id]}
                onClick={handleNodeClick}
              />
            ))}

            {/* B1 node — hidden until mitosis */}
            {b1Agent && (
              <AgentNode
                key="agent-b1"
                agent={b1Agent}
                state={nodeStates['agent-b1']}
                position={NODE_POSITIONS['agent-b1']}
                onClick={handleNodeClick}
                isHidden={!b1Spawned}
              />
            )}

            {/* Placeholder B1 */}
            {!b1Agent && (
              <AgentNode
                key="agent-b1-placeholder"
                agent={{
                  id: 'agent-b1',
                  type: 'child',
                  name: 'AuditBot-v1.1',
                  reputation: '—',
                  wallet: '—',
                  children: [],
                  parent: 'agent-b',
                }}
                state="idle"
                position={NODE_POSITIONS['agent-b1']}
                onClick={() => {}}
                isHidden={true}
              />
            )}
          </div>

          {/* Log panel */}
          <LogPanel logs={logs} />
        </div>
      </div>

      {/* Inspector drawer */}
      <InspectorDrawer
        agent={currentSelectedAgent}
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
}
