const typeDefs = `#graphql
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    password: String # Password should not be queried
    savedNews: [News] # List of saved news for the user
    userDefaultNews: String # Default news category for the user
  }

  type Auth {
    token: ID! # JWT token for authentication
    currentUser: User # Current user data
  }

  type News {
    newsId: ID!
    title: String
    summary: String
    source_country: String
    url: String
    image: String
    language: String
    latest_publish_date: String
    category: String
  }

  input NewsInput {
    newsId: ID!
    title: String
    summary: String
    source_country: String
    url: String
    image: String
    language: String
    latest_publish_date: String
    category: String
  }

  type PasswordResetResponse {
    success: Boolean! # Indicates whether the password reset was successful
    message: String! # Message related to password reset
  }

  type Query {
    currentUser(email: String!): User # Query to get current user by email
    news: [News]! # Query to get all news
  }

  type Mutation {
    register(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      userDefaultNews: String!
    ): Auth # Mutation to register a new user
    login(email: String!, password: String!): Auth # Mutation to log in user
    saveNews(saveNews: NewsInput!): Auth # Mutation to save news for a user
    deleteNews(newsId: ID!): User # Mutation to delete news from a user's saved news
    forgotPassword(email: String!): PasswordResetResponse! # Mutation to initiate password reset
    resetPassword(token: String!, newPassword: String!): PasswordResetResponse! # Mutation to reset password
  }
`;

module.exports = typeDefs;
