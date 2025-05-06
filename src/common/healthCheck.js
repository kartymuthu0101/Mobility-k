// src/common/healthCheck.js - Updated version
const { sequelize, connectDb } = require("../utils/connectDb");
const { verifyDatabaseHealth } = require("../utils/dbSync");
const logger = require("../utils/logger");

const healthcheck = async (req, res) => {
    try {
        // Check DB connection
        try {
            await sequelize.authenticate();
        } catch (error) {
            logger.error("Database connection failed in healthcheck", error);
            await connectDb(); // Reconnect if not connected
        }

        // Verify database structure
        const tablesHealthy = await verifyDatabaseHealth();

        res.status(tablesHealthy ? 200 : 503).json({
            status: tablesHealthy ? 'ok' : 'warning',
            db: 'connected',
            tables: tablesHealthy ? 'verified' : 'incomplete',
            uptime: process.uptime(),
            timestamp: new Date()
        });
    } catch (error) {
        logger.error("Healthcheck failed", error);
        res.status(500).json({
            status: 'error',
            db: 'disconnected',
            message: error.message,
            timestamp: new Date()
        });
    }
}

module.exports = healthcheck;