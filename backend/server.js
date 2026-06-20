const express = require("express");
const cors = require("cors");
require("dotenv").config();

const agentRoutes = require("./src/routes/agents");
const jobRoutes = require("./src/routes/job");
const feedbackRoutes = require("./src/routes/feedback");
const disputeRoutes = require("./src/routes/dispute");
const mitosisRoutes = require("./src/routes/mitosis");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "Agent Court + Mitosis backend running",
    });
});

app.use("/agents", agentRoutes);
app.use("/job", jobRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/dispute", disputeRoutes);
app.use("/mitosis", mitosisRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
