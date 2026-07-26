import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authMiddleware } from './middleware/auth.js';
import cors from 'cors';
import compression from 'compression';
import newsRoutes from './routes/newsRoutes.js';

// Import GraphQL schema and resolvers
import { typeDefs, resolvers } from './schemas/index.mjs';

// Import database connection
import db from './config/connection.js';

// Initialize Express app
const app = express();

// Set up port
const PORT = process.env.PORT || 8080;

// ✅ Start Apollo Server before using it in Express
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start(); // Important for Apollo v4+

  // ✅ Fix: Health check route for Elastic Beanstalk
  app.get("/", (req, res) => {
    res.status(200).json({
      status: "ok",
      message: "Elastic Beanstalk health check passed!",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // Allowed origins for CORS
  const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,
  ];

  console.log("CLIENT_URL =", process.env.CLIENT_URL);
  console.log("allowedOrigins =", allowedOrigins);

  // Middleware setup
  app.use(compression());
  app.use(cors({
    origin: (origin, callback) => {
      console.log("🔎 Incoming request from:", origin);
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Routes for news API
  app.use('/api', newsRoutes);

  // Apollo Middleware
  app.use("/graphql", expressMiddleware(server, { context: authMiddleware }));

  // Start Express server
  app.listen(PORT, () => {
    console.log(`✅ API server running on port ${PORT}`);
    console.log(`✅ Use GraphQL at http://localhost:${PORT}/graphql`);
  });
}

// Start the whole app
startServer().catch((err) => {
  console.error("❌ Server failed to start:", err);
});

// Close MongoDB connection on process exit
process.on('SIGINT', () => {
  db.close(() => {
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  });
});
