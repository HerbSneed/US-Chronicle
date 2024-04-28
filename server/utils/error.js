// Import GraphQLError from graphql
const { GraphQLError } = require('graphql');

// Define custom GraphQL error for authentication failure
module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED', // Error code for authentication failure
    },
  }),
};