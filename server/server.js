const path = require('path');
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./middleware/auth');
const cors = require('cors');
const compression = require('compression');
const newsRoutes = require('./routes/newsRoutes')

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://us-chronicle-5f8b6391feb6.herokuapp.com/' : `http://localhost:${PORT}`;

app.use(compression());
app.use('/public', express.static(path.join(__dirname, 'client', 'dist')));


const startApolloServer = async () => {
  await server.start();
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use('/api', newsRoutes);
  app.use('/public', express.static(path.join(__dirname, 'client', 'dist')));
  app.use('/graphql', expressMiddleware(server, { context: authMiddleware }));


  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    // Apply compression to static files in production
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  db.once('open', () => {
    console.log('Connected to MongoDB!');
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at ${BASE_URL}/graphql`);
    });
  });

  process.on('SIGINT', () => {
    db.close(() => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
};

startApolloServer();
