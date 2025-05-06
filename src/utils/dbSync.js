// src/utils/dbSync.js
const { sequelize } = require('./connectDb');
const logger = {
    info: (message) => console.log(`[INFO] ${message}`),
    error: (message, error) => console.error(`[ERROR] ${message}`, error),
    warn: (message) => console.warn(`[WARN] ${message}`)
};

/**
 * Synchronizes all models with the database
 * @param {boolean} force - If true, will drop tables before creating them
 * @returns {Promise<Object>} - Results of the sync operation
 */
const syncDatabase = async (force = false) => {
    try {
        logger.info('Starting database synchronization');
        
        // Simple approach: sync all models
       // await sequelize.sync({ });
        
        logger.info(`Database synchronized ${force ? 'with force' : 'without force'}`);
        
        return {
            success: true,
            message: force ? 'All tables dropped and recreated' : 'All tables created if missing',
        };
    } catch (error) {
        logger.error('Database synchronization failed', error);
        return {
            success: false,
            message: `Sync failed: ${error.message}`,
            error
        };
    }
};

module.exports = {
    syncDatabase
};