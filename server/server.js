// Import necessary modules
const path = require('path');
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./middleware/auth');
const cors = require('cors');
const compression = require('compression');
const newsRoutes = require('./routes/newsRoutes')

// Import GraphQL schema and resolvers
const { typeDefs, resolvers } = require('./schemas');

// Import database connection
const db = require('./config/connection');

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
const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://us-chronicle-5f8b6391feb6.herokuapp.com/' : `http://localhost:${PORT}`;

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
