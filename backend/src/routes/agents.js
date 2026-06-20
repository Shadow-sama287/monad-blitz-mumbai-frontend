const express = require("express");
const router = express.Router();

const agents = require("../data/agents");

router.get("/", (req, res) => {
    const agentList = [agents.client, agents.service, agents.judge];

    if (agents.child) {
        agentList.push(agents.child);
    }

    res.json({
        agents: agentList,
    });
});

router.get("/:type", (req, res) => {
    const agent = agents[req.params.type];

    if (!agent) {
        return res.status(404).json({
            error: "Agent not found",
        });
    }

    res.json(agent);
});

router.get("/:type/card", (req, res) => {
    const agent = agents[req.params.type];

    if (!agent) {
        return res.status(404).json({
            error: "Agent card not found",
        });
    }

    res.json({
        name: agent.name,
        description: agent.description,
        wallet: agent.wallet,
        endpoint: agent.endpoint,
        parent: agent.parent || null,
    });
});

module.exports = router;
