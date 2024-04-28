// Import custom GraphQL error and JWT token signing function
const { GraphQLError } = require('./error');
const { signToken } = require('./jwt');


module.exports = {
  GraphQLError,
  signToken
}