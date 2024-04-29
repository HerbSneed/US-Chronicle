import { gql } from "@apollo/client";

// Query to get current user's information
export const QUERY_CURRENT_USER = gql`
  query getCurrentUser($email: String!) {
    currentUser(email: $email) {
      _id
      email
      firstName
      lastName
      userDefaultNews
      savedNews {
        newsId
        title
        summary
        source_country
        url
        image
        language
        latest_publish_date
        category
      }
    }
  }
`;

// Query to get news
export const QUERY_NEWS = gql`
  query getNews {
    news {
      newsId
      title
      summary
      source_country
      url
      image
      language
      latest_publish_date
      }
    }
`;
