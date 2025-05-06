// src/server.js - Updated version
const express = require("express");
const { connectDb, sequelize } = require("./utils/connectDb.js");
const { syncDatabase } = require("./utils/dbSync.js");
const router = require("./routes/index.js");
const swagger = require("./utils/swagger.js");
const cors = require("cors");
const { port, environment } = require("./config.js");

// Import model associations
require('./models/index');

(async function server() {
    try {
        const app = express();
        console.log(`Starting server in ${environment} mode`);

        // Connect to PostgreSQL with Sequelize
        await connectDb();
        
        // Check if database has tables
        const [results] = await sequelize.query(
            `SELECT COUNT(*) as table_count FROM information_schema.tables 
             WHERE table_schema = '${sequelize.config.database}'
             AND table_type = 'BASE TABLE';`
        );
        
        const tableCount = parseInt(results[0].table_count);
        console.log(`Database contains ${tableCount} tables`);
        
        // If no tables or in development mode with force flag, sync the database
        const forceSyncInDev = process.env.FORCE_DB_SYNC === 'true';
        const shouldForceSync = environment === 'development' && forceSyncInDev;
        const shouldSync = tableCount === 0 || shouldForceSync;
        
        if (shouldSync) {
            console.log(`Syncing database tables (force=${shouldForceSync})`);
            const syncResult = await syncDatabase(shouldForceSync);
            console.log('Database sync result:', syncResult);
        } else {
            console.log('Database tables already exist, skipping sync');
        }

        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        swagger(app);
        app.use(cors());
        
        app.use("/api", router);

        // Enhanced health check
        app.get('/api/db-status', async (req, res) => {
            try {
                // Check connection
                await sequelize.authenticate();
                
                // Get table count
                const [results] = await sequelize.query(
                    `SELECT COUNT(*) as table_count FROM information_schema.tables 
                     WHERE table_schema = '${sequelize.config.database}'
                     AND table_type = 'BASE TABLE';`
                );
                
                const tableCount = parseInt(results[0].table_count);
                
                res.status(200).json({
                    status: 'ok',
                    connection: 'connected',
                    tables: {
                        count: tableCount,
                        status: tableCount > 0 ? 'tables_exist' : 'no_tables'
                    },
                    timestamp: new Date()
                });
            } catch (error) {
                res.status(500).json({
                    status: 'error',
                    connection: 'error',
                    message: error.message,
                    timestamp: new Date()
                });
            }
        });

        app.listen(port, () => console.info(`Server is running on port ${port}`));

    } catch (error) {
        console.error("ERROR", error);
        process.exit(1);
    }
})();