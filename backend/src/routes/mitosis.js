const express = require("express");
const router = express.Router();

const agents = require("../data/agents");

function generateWallet() {
    return "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

router.post("/", async (req, res) => {
    try {
        const { parentId, mitosisThreshold } = req.body;
        const threshold = mitosisThreshold || 80;

        const parentAgent = agents.service;

        if (!parentAgent) {
            return res.status(400).json({
                success: false,
                error: "Parent agent not found",
            });
        }

        if (parentAgent.reputation < threshold) {
            return res.status(400).json({
                success: false,
                allowed: false,
                reason: "Agent reputation is below mitosis threshold",
                reputation: parentAgent.reputation,
                threshold,
            });
        }

        const childWallet = generateWallet();
        const childTokenId = "4";
        const txHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;

        // Create child agent
        const childAgent = {
            id: "agent-b1",
            tokenId: childTokenId,
            name: "AuditBot-v2",
            role: "Child Agent",
            type: "service",
            wallet: childWallet,
            description: "Child agent spawned via mitosis",
            reputation: 50,
            balance: 50,
            parent: parentId,
            children: [],
        };

        // Store child in agents
        agents.child = childAgent;

        // Update parent balance (cosmetic split)
        parentAgent.balance = Math.max(0, parentAgent.balance - 50);

        res.json({
            success: true,
            parentId,
            childId: childAgent.id,
            childWallet,
            childTokenId,
            treasurySplit: `50 MON to parent, 50 MON to child`,
            registrationTxHash: txHash,
            message: "Child agent successfully spawned and registered",
            parent: parentAgent,
            child: childAgent,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Mitosis failed",
            details: error.message,
        });
    }
});

module.exports = router;
