// Import necessary modules
import path from 'path';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authMiddleware } from './server/middleware/auth.js';
import cors from 'cors';
import compression from 'compression';
import newsRoutes from './server/routes/newsRoutes.js';

// Import GraphQL schema and resolvers
import { typeDefs, resolvers } from './server/schemas/index.mjs';

// Import database connection
import db from './server/config/connection.js';

// Fix __dirname in ES Modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up port
const PORT = process.env.PORT || 3001;

// Initialize Express app
const app = express();

// Create ApolloServer instance with schema and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Base URL for the app
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'mern-env.eba-ifp48zm3.us-east-1.elasticbeanstalk.com'
  : `http://localhost:${PORT}`;


// Middleware setup
app.use(compression()); // Enable compression
app.use('/public', express.static(path.join(__dirname, 'client', 'dist'))); // Serve static files

// Start Apollo Server
const startApolloServer = async () => {
  await server.start(); // Start Apollo Server

  app.use(cors()); // Enable CORS
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
  app.use(express.json()); // Parse JSON bodies

  // Routes for news API
  app.use('/api', newsRoutes);

  // Set up Apollo Server middleware for GraphQL endpoint with authentication
  app.use('/graphql', expressMiddleware(server, { context: authMiddleware }));

  // Serve static assets and handle client-side routing
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist'))); // Serve static assets
    // Handle all other requests by serving the index.html of the client app
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Database event handlers
  db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  db.once('open', () => {
    console.log('Connected to MongoDB!');
    // Start Express server
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at ${BASE_URL}/graphql`);
    });
  });

  // Close MongoDB connection on process exit
  process.on('SIGINT', () => {
    db.close(() => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
};

// Call function to start Apollo Server
startApolloServer();
