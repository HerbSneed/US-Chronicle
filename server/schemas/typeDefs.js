const typeDefs = `#graphql
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    password: String
    savedNews: [News]
    userDefaultNews: String
  }

  type Auth {
    token: ID!
    currentUser: User
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
    success: Boolean!
    message: String!
  }

  type Query {
    currentUser(email: String!): User
    news: [News]!
  }

  type Mutation {
    register(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      userDefaultNews: String!
    ): Auth
    login(email: String!, password: String!): Auth
    saveNews(saveNews: NewsInput!): Auth
    deleteNews(newsId: ID!): User
    forgotPassword(email: String!): PasswordResetResponse!
    resetPassword(token: String!, newPassword: String!): PasswordResetResponse!
  }
`;

module.exports = typeDefs;
