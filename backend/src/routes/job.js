const express = require("express");
const router = express.Router();

const agents = require("../data/agents");

router.post("/", async (req, res) => {
    try {
        const { clientId, serviceId, jobType, flawed } = req.body;

        if (!clientId || !serviceId) {
            return res.status(400).json({
                error: "clientId and serviceId are required",
            });
        }

        const jobId = `job-${Date.now()}`;
        const txHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;

        const output = flawed
            ? "CRITICAL_ERROR: Memory corruption in storage slot mapping — audit inconclusive."
            : "Smart contract audit complete. Gas optimizations identified: 42% reduction in deployment costs.";

        res.json({
            success: true,
            jobId,
            clientId,
            serviceId,
            status: "completed",
            output,
            txHash,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Job execution failed",
            details: error.message,
        });
    }
});

module.exports = router;
