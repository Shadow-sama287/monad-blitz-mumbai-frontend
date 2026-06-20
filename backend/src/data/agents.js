const agents = {
    client: {
        id: "agent-a",
        tokenId: "1",
        name: "Protocol Deployer",
        role: "Client Agent",
        type: "client",
        wallet: process.env.AGENT_A_WALLET || "0x1A2b3C4d5E6f7890aBcDeF1234567890AbCdEf12",
        description: "Client agent that hires service agents for audits.",
        endpoint: "http://localhost:4000/job",
        reputation: 100,
        children: [],
    },

    service: {
        id: "agent-b",
        tokenId: "2",
        name: "AuditBot-v1",
        role: "Service Agent",
        type: "service",
        wallet: process.env.AGENT_B_WALLET || "0x5E6f7A8b9C0d1234eFgHiJkLmNoPqRsTuVwXyZ90",
        description: "Service agent that performs smart contract audits.",
        endpoint: "http://localhost:4000/job",
        balance: 100,
        reputation: 90,
        mitosisThreshold: 80,
        children: [],
    },

    judge: {
        id: "judge",
        tokenId: "3",
        name: "Judge_LLM_Oracle",
        role: "Arbitrator",
        type: "arbitrator",
        wallet: process.env.JUDGE_WALLET || "0x9I0jK1lM2nO3pQ4rS5tU6vW7xY8zA9bC0dE1fG2h",
        description: "On-chain judge for dispute resolution.",
        endpoint: "http://localhost:4000/dispute",
        reputation: 100,
    },

    child: null,
};

module.exports = agents;
