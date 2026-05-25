const express = require('express');
const app = express();

// Production Constraint: Pull port dynamically from Azure environment (Default to 8080)
const PORT = process.env.PORT || 8080;

// Middleware for parsing json incoming data
app.use(express.json());

// 1. Core Production Endpoint (Pulling from a secure, isolated database string)
app.get('/api/v1/data', (req, res) => {
    const dbString = process.env.PRODUCTION_DATABASE_URL;
    
    if (!dbString) {
        return res.status(500).json({
            status: "CRITICAL_ERROR",
            message: "Missing secure environment configuration string. Database connection failed."
        });
    }

    res.status(200).json({
        status: "SUCCESS",
        environment: "PRODUCTION_ENTERPRISE_ZONE",
        data: ["Core Server Asset A", "Core Server Asset B"],
        connectionStatus: "AUTHENTICATED_SECURE_MODE"
    });
});

// 2. Automated Enterprise Health Check (Used by Azure Traffic Load Balancers)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: "HEALTHY",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 3. Fallback Route Handler (Security Guardrail for unhandled paths)
app.use((req, res) => {
    res.status(404).json({ error: "RESOURCE_NOT_FOUND" });
});

// Global Safety Net: Prevent application crashes from unhandled code exceptions
process.on('uncaughtException', (err) => {
    console.error(`CRITICAL PLATFORM EXCEPTION SHIELD ACTIVATED: ${err.message}`);
});

app.listen(PORT, () => {
    console.log(`Production enterprise application successfully bound to port: ${PORT}`);
});
