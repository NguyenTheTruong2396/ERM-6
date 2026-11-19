import dotenv from "dotenv";
dotenv.config();

import dbPool from "./config/database";
import app from "./app";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Check database connection
    const client = await dbPool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('PostgreSQL database connected successfully. Current time:', result.rows[0].now);

    // Start listening for incoming requests from clients
    const server = app.listen(PORT, () => {
      console.log(`Server is running in [${process.env.NODE_ENV || 'development'}] mode on: http://localhost:${PORT}`);
    });

    // Graceful shutdown on Ctrl+C or kill process
    const gracefulShutdown = async () => {
      console.log('\nShutting down server and closing database connections...');
      server.close(async () => {
        await dbPool.end();
        console.log('All PostgreSQL connections closed gracefully.');
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);  // Catch Ctrl + C terminal signal
    process.on('SIGTERM', gracefulShutdown); // Catch shutdown signal from Cloud/Docker system
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); // Exit application if database connection fails
  }
};

startServer();
