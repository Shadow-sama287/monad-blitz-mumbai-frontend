/**
 * useAgentEconomy.js
 * 
 * Single custom hook wrapping all 5 backend endpoints from AGENTS.md Section 9.
 * Reads configuration from environment variables (.env.local).
 * 
 * Endpoints: GET /agents, POST /job, POST /feedback, POST /dispute, POST /mitosis
 */
import { useState, useCallback, useRef } from 'react';

// ── Configuration (from environment variables) ────────────────────────
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true' || !BASE_URL; // Mock if no backend URL
const MONAD_EXPLORER = 'https://testnet.monadexplorer.com/tx/';

// ── Mock Data ─────────────────────────────────────────────────────────
const MOCK_AGENTS = [
  {
    id: 'agent-a',
    type: 'client',
    name: 'Protocol Deployer',
    reputation: 100,
    wallet: '0x1A2b3C4d5E6f7890aBcDeF1234567890AbCdEf12',
    children: [],
  },
  {
    id: 'agent-b',
    type: 'service',
    name: 'AuditBot-v1',
    reputation: 90,
    wallet: '0x5E6f7A8b9C0d1234eFgHiJkLmNoPqRsTuVwXyZ90',
    children: [],
  },
  {
    id: 'judge',
    type: 'arbitrator',
    name: 'Judge_LLM_Oracle',
    reputation: 100,
    wallet: '0x9I0jK1lM2nO3pQ4rS5tU6vW7xY8zA9bC0dE1fG2h',
    children: [],
  },
];

const mockTxHash = () =>
  '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Hook ──────────────────────────────────────────────────────────────
export function useAgentEconomy() {
  const [agents, setAgents] = useState(MOCK_AGENTS);
  const [logs, setLogs] = useState([]);
  const [nodeStates, setNodeStates] = useState({
    'agent-a': 'idle',
    'agent-b': 'idle',
    'judge': 'idle',
    'agent-b1': 'idle',
  });
  const [b1Spawned, setB1Spawned] = useState(false);
  const [activeFlow, setActiveFlow] = useState(null); // 'job' | 'dispute' | 'mitosis' | null
  const [isLoading, setIsLoading] = useState(false);
  const [disputeActive, setDisputeActive] = useState(false);
  const [mitosisActive, setMitosisActive] = useState(false);
  const logIdRef = useRef(0);

  // ── Helpers ───────────────────────────────────────────────
  const addLog = useCallback((msg, type = 'info', txHash = null) => {
    logIdRef.current += 1;
    setLogs((prev) => [
      {
        id: logIdRef.current,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        msg,
        type,
        txHash,
        txUrl: txHash ? `${MONAD_EXPLORER}${txHash}` : null,
      },
      ...prev,
    ]);
  }, []);

  const setNodeState = useCallback((nodeId, state) => {
    setNodeStates((prev) => ({ ...prev, [nodeId]: state }));
  }, []);

  // ── GET /agents ───────────────────────────────────────────
  const fetchAgents = useCallback(async () => {
    if (USE_MOCKS) {
      setAgents(MOCK_AGENTS);
      addLog('Loaded agent registry', 'info');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/agents`);
      const data = await res.json();
      setAgents(data);
      addLog('Loaded agent registry from backend', 'info');
    } catch (e) {
      addLog(`Failed to fetch agents: ${e.message}`, 'error');
    }
  }, [addLog]);

  // ── POST /job (happy path) ────────────────────────────────
  const submitJob = useCallback(async (simulateBadDelivery = false) => {
    if (isLoading) return;
    setIsLoading(true);
    setActiveFlow('job');

    try {
      // A is paying
      setNodeState('agent-a', 'paying');
      addLog(`Agent A submitting audit job${simulateBadDelivery ? ' (flawed)' : ''}…`, 'info');

      if (USE_MOCKS) {
        await delay(1200);

        // B processing
        setNodeState('agent-a', 'idle');
        setNodeState('agent-b', 'processing');
        addLog('AuditBot-v1 processing contract audit…', 'info');

        await delay(2000);

        const jobId = `job-${Date.now()}`;
        const txHash = mockTxHash();
        const output = simulateBadDelivery
          ? 'CRITICAL_ERROR: Memory corruption in storage slot mapping — audit inconclusive.'
          : 'Audit complete: 3 gas optimizations identified, 0 critical vulnerabilities found. Est. savings: 12,450 gas/tx.';

        setNodeState('agent-b', 'idle');
        setActiveFlow(null);
        addLog(`Job ${jobId} completed`, simulateBadDelivery ? 'error' : 'success', txHash);

        setIsLoading(false);
        return { jobId, output, simulateBadDelivery, txHash };
      }

      // Real backend
      const res = await fetch(`${BASE_URL}/job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: 'Smart contract audit request', simulateBadDelivery }),
      });
      const data = await res.json();

      setNodeState('agent-a', 'idle');
      setNodeState('agent-b', 'idle');
      setActiveFlow(null);
      addLog(`Job ${data.jobId} completed`, simulateBadDelivery ? 'error' : 'success', data.txHash);

      setIsLoading(false);
      return data;
    } catch (e) {
      addLog(`Job submission failed: ${e.message}`, 'error');
      setNodeState('agent-a', 'idle');
      setNodeState('agent-b', 'idle');
      setActiveFlow(null);
      setIsLoading(false);
      return null;
    }
  }, [isLoading, addLog, setNodeState]);

  // ── POST /feedback ────────────────────────────────────────
  const submitFeedback = useCallback(async (jobId) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      setNodeState('agent-b', 'success');
      addLog('Agent A submitting positive feedback…', 'info');

      if (USE_MOCKS) {
        await delay(1500);
        const txHash = mockTxHash();

        // Increment B's reputation
        setAgents((prev) =>
          prev.map((a) =>
            a.id === 'agent-b' ? { ...a, reputation: Math.min(a.reputation + 5, 100) } : a
          )
        );

        addLog('Feedback recorded — reputation +5 on Monad Reputation Registry', 'success', txHash);

        await delay(1000);
        setNodeState('agent-b', 'idle');
        setIsLoading(false);
        return { txHash };
      }

      const res = await fetch(`${BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, rating: 5, comment: 'Good work' }),
      });
      const data = await res.json();

      // Re-fetch agents to get updated reputation
      await fetchAgents();

      setNodeState('agent-b', 'idle');
      addLog('Feedback recorded on-chain', 'success', data.txHash);
      setIsLoading(false);
      return data;
    } catch (e) {
      addLog(`Feedback failed: ${e.message}`, 'error');
      setNodeState('agent-b', 'idle');
      setIsLoading(false);
      return null;
    }
  }, [isLoading, addLog, setNodeState, fetchAgents]);

  // ── POST /dispute ─────────────────────────────────────────
  const submitDispute = useCallback(async (jobId, input, output) => {
    if (isLoading) return;
    setIsLoading(true);
    setDisputeActive(true);

    try {
      setNodeState('agent-a', 'in-court');
      setNodeState('agent-b', 'in-court');
      setNodeState('judge', 'processing');
      setActiveFlow('dispute');
      addLog('Dispute escalated to Judge_LLM_Oracle — A & B entering court…', 'error');

      if (USE_MOCKS) {
        await delay(2500);
        const txHash = mockTxHash();
        const verdict = 'GUILTY';
        const reputationPenalty = -15;

        // Drop B's reputation
        setAgents((prev) =>
          prev.map((a) =>
            a.id === 'agent-b'
              ? { ...a, reputation: Math.max(a.reputation + reputationPenalty, 0) }
              : a
          )
        );

        addLog(`Verdict: ${verdict} — reputation ${reputationPenalty} applied on-chain`, 'error', txHash);

        await delay(1000);
        setNodeState('agent-a', 'idle');
        setNodeState('judge', 'idle');
        setNodeState('agent-b', 'idle');
        setActiveFlow(null);
        // Keep disputeActive true so the line stays visible
        setIsLoading(false);
        return { verdict, reputationPenalty, txHash };
      }

      const res = await fetch(`${BASE_URL}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, input, output }),
      });
      const data = await res.json();

      await fetchAgents();

      setNodeState('agent-a', 'idle');
      setNodeState('judge', 'idle');
      setNodeState('agent-b', 'idle');
      setActiveFlow(null);
      addLog(`Verdict: ${data.verdict} — penalty ${data.reputationPenalty}`, 'error', data.txHash);
      setIsLoading(false);
      return data;
    } catch (e) {
      addLog(`Dispute failed: ${e.message}`, 'error');
      setNodeState('agent-a', 'idle');
      setNodeState('judge', 'idle');
      setNodeState('agent-b', 'idle');
      setActiveFlow(null);
      setIsLoading(false);
      return null;
    }
  }, [isLoading, addLog, setNodeState, fetchAgents]);

  // ── POST /mitosis ─────────────────────────────────────────
  const triggerMitosis = useCallback(async () => {
    if (isLoading || b1Spawned) return;
    setIsLoading(true);

    try {
      setNodeState('agent-b', 'mitosis');
      setActiveFlow('mitosis');
      addLog('Mitosis triggered — spawning child agent B1…', 'mitosis');

      if (USE_MOCKS) {
        await delay(2000);
        const txHash = mockTxHash();

        setB1Spawned(true);
        setMitosisActive(true);

        // Add B1 to agents list
        const childAgent = {
          id: 'agent-b1',
          type: 'child',
          name: 'AuditBot-v1.1',
          reputation: 50,
          wallet: '0xB1cH1LD' + mockTxHash().slice(10, 50),
          children: [],
          parent: 'agent-b',
        };

        setAgents((prev) => {
          const updated = prev.map((a) =>
            a.id === 'agent-b' ? { ...a, children: ['agent-b1'] } : a
          );
          return [...updated, childAgent];
        });

        addLog(`Child agent B1 registered on Identity Registry`, 'mitosis', txHash);

        await delay(1200);
        setNodeState('agent-b', 'idle');
        setActiveFlow(null);
        setIsLoading(false);
        return { childId: 'agent-b1', parentId: 'agent-b', txHash };
      }

      const res = await fetch(`${BASE_URL}/mitosis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();

      setB1Spawned(true);
      setMitosisActive(true);
      await fetchAgents();

      setNodeState('agent-b', 'idle');
      setActiveFlow(null);
      addLog(`Child ${data.childId} spawned from ${data.parentId}`, 'mitosis', data.txHash);
      setIsLoading(false);
      return data;
    } catch (e) {
      addLog(`Mitosis failed: ${e.message}`, 'error');
      setNodeState('agent-b', 'idle');
      setActiveFlow(null);
      setIsLoading(false);
      return null;
    }
  }, [isLoading, b1Spawned, addLog, setNodeState, fetchAgents]);

  return {
    // State
    agents,
    logs,
    nodeStates,
    b1Spawned,
    activeFlow,
    isLoading,
    disputeActive,
    mitosisActive,

    // Actions
    fetchAgents,
    submitJob,
    submitFeedback,
    submitDispute,
    triggerMitosis,

    // Helpers
    addLog,
  };
}
