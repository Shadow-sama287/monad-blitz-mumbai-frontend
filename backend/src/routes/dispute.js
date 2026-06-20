const express = require("express");
const router = express.Router();

const agents = require("../data/agents");

// Judge logic: deterministic verdict based on CRITICAL_ERROR marker
function judgeDispute(output) {
    const verdict = output.includes("CRITICAL_ERROR") ? "GUILTY" : "NOT_GUILTY";
    return {
        verdict,
        reason: verdict === "GUILTY"
            ? "Output contains CRITICAL_ERROR marker"
            : "No critical errors detected",
    };
}

router.post("/", async (req, res) => {
    try {
        const { jobId, clientId, serviceId, reason, evidence } = req.body;

        if (!jobId) {
            return res.status(400).json({
                error: "jobId is required",
            });
        }

        const txHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;

        // Determine verdict based on evidence
        const judgement = judgeDispute(evidence || reason);
        const reputationPenalty = judgement.verdict === "GUILTY" ? "-30" : "0";

        // Update service agent reputation
        if (agents.service && judgement.verdict === "GUILTY") {
            agents.service.reputation = Math.max(0, agents.service.reputation - 30);
        }

        res.json({
            success: true,
            jobId,
            verdict: judgement.verdict,
            verdictReason: judgement.reason,
            reputationPenalty,
            newReputation: agents.service.reputation,
            courtTxHash: txHash,
            verdictWrittenToRegistry: true,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Dispute failed",
            details: error.message,
        });
    }
});

module.exports = router;
