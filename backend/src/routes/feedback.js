const express = require("express");
const router = express.Router();

const agents = require("../data/agents");

router.post("/", async (req, res) => {
    try {
        const { jobId, clientId, serviceId, rating, comment } = req.body;

        if (!jobId || !rating) {
            return res.status(400).json({
                error: "jobId and rating are required",
            });
        }

        const txHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
        const reputationChange = rating >= 4 ? "+10" : "-5";

        // Update reputation in agent registry
        if (agents.service) {
            const change = rating >= 4 ? 10 : -5;
            agents.service.reputation = Math.min(100, Math.max(0, agents.service.reputation + change));
        }

        res.json({
            success: true,
            jobId,
            reputationChange,
            newReputation: agents.service.reputation,
            txHash,
            message: "Positive feedback recorded on Reputation Registry",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Feedback failed",
            details: error.message,
        });
    }
});

module.exports = router;
