// Import GraphQLError from graphql
import { GraphQLError } from 'graphql';

// Define custom GraphQL error for authentication failure
export const AuthenticationError = new GraphQLError('Could not authenticate user.', {
  extensions: {
    code: 'UNAUTHENTICATED', // Error code for authentication failure
  },
});
