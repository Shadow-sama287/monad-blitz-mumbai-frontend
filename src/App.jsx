/**
 * App.jsx
 * 
 * Agent Court — Main canvas application.
 * Composes: AgentNodes (fixed position), ConnectionLines (SVG),
 * InspectorDrawer, LogPanel, ControlBar.
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

// ── Fixed node positions (absolute px) ────────────────────────────────
// These are deliberately static — no physics, no layout engine.
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

  // Load agents on mount (guard against StrictMode double-fire)
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
    // Delay clearing agent so the slide-out animation completes
    setTimeout(() => setSelectedAgent(null), 350);
  }, []);

  // ── Demo Flow: Happy Path ──────────────────────────────────
  const handleHappyPath = useCallback(async () => {
    addLog('── Starting Happy Path ──', 'info');
    const result = await submitJob(false);
    if (result) {
      await submitFeedback(result.jobId);
      addLog('── Happy Path Complete ──', 'success');
    }
  }, [submitJob, submitFeedback, addLog]);

  // ── Demo Flow: Dispute Path ────────────────────────────────
  const handleDisputePath = useCallback(async () => {
    addLog('── Starting Dispute Path ──', 'info');
    const result = await submitJob(true);
    if (result) {
      await submitDispute(result.jobId, 'Smart contract audit request', result.output);
      addLog('── Dispute Path Complete ──', 'error');
    }
  }, [submitJob, submitDispute, addLog]);

  // ── Demo Flow: Mitosis ─────────────────────────────────────
  const handleMitosis = useCallback(async () => {
    await triggerMitosis();
  }, [triggerMitosis]);

  // ── Separate agents for rendering ──────────────────────────
  const mainAgents = agents.filter((a) => a.id !== 'agent-b1');
  const b1Agent = agents.find((a) => a.id === 'agent-b1');

  // Keep drawer agent in sync with live data
  const currentSelectedAgent = selectedAgent
    ? agents.find((a) => a.id === selectedAgent.id) || selectedAgent
    : null;

  return (
    <>
      {/* Grid background */}
      <div className="canvas-grid" />

      <div className="app-layout">
        <div className="canvas-area">
          {/* Header */}
          <header className="app-header">
            <div className="app-title">
              <span className="accent">⬡</span> Agent Court
              <span className="badge badge--live">ERC-8004</span>
              <span className="badge">Monad Testnet</span>
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

          {/* Placeholder B1 (before mitosis creates the agent data) */}
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
