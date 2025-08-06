import fetch from 'node-fetch';
import { apiKey, apiUrl } from '../config/apiConfig.js';

// Simple keyword extractor from title
function extractKeywordsFromTitle(title) {
  const stopWords = [
    'the', 'and', 'with', 'from', 'after', 'over', 'in', 'on',
    'of', 'for', 'to', 'a', 'an', 'at', 'as', 'by'
  ];
  const words = title
    .split(/\s+/)
    .filter(word => !stopWords.includes(word.toLowerCase()) && word.length > 3)
    .sort((a, b) => b.length - a.length);
  return words[0] || title;
}

export const getRelatedStories = async (title) => {
  try {
    const keyword = extractKeywordsFromTitle(title);
    const response = await fetch(
      `${apiUrl}/everything?q=${encodeURIComponent(keyword)}&searchIn=title&language=en&pageSize=10&apiKey=${apiKey}`
    );
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error("Error in getRelatedStories", error);
    return [];
  }
};

export const getUserHeadlines = async (userCategory) => {
  try {
    const url = `${apiUrl}/top-headlines?country=US${userCategory && userCategory !== 'Top News' ? `&category=${encodeURIComponent(userCategory.toLowerCase())}` : ''
      }&language=en&pageSize=5&apiKey=${apiKey}`;

    console.log("Fetching user headlines from URL:", url);

    const response = await fetch(url);
    const data = await response.json();

    console.log("User headlines fetched:", data.articles.length);

    const headlinesWithRelated = await Promise.all(
      (data.articles || []).map(async (article) => {
        const related = await getRelatedStories(article.title);
        const filteredRelated = related
          .filter(r => r.title !== article.title)
          .slice(0, 5); // limit for performance

        console.log(`Article: "${article.title}" has ${filteredRelated.length} related articles.`);

        return {
          ...article,
          relatedArticles: filteredRelated,
        };
      })
    );

    return { articles: headlinesWithRelated };
  } catch (error) {
    console.error("Error in getUserHeadlines", error);
    throw error;
  }
};

export const getUsHeadlines = async () => {
  console.log("getUsHeadlines called");
  try {
    // Top headlines without a category (general / Top News)

    const url = `${apiUrl}/top-headlines?country=US&language=en&pageSize=10&apiKey=${apiKey}`;
    console.log("Fetching US headlines from URL:", url);

    const response = await fetch(url);
    const data = await response.json();

    console.log("DATA")

    console.log("US headlines fetched:", data.articles.length);

    const topArticles = (data.articles || []).slice(0, 5);
    const remainingArticles = (data.articles || []).slice(3);

    const articlesWithRelated = await Promise.all(
      topArticles.map(async (article) => {
        const related = await getRelatedStories(article.title);
        const filteredRelated = related
          .filter(r => r.title !== article.title)
          .slice(0, 5);

        console.log(`Top article: "${article.title}" has ${filteredRelated.length} related articles.`);

        return {
          ...article,
          relatedArticles: filteredRelated,
        };
      })
    );

    const allArticles = [...articlesWithRelated, ...remainingArticles];
    return { articles: allArticles };
  } catch (error) {
    console.error("Error in getUSHeadlines", error);
    throw error;
  }
};

export const getCategoryHeadlines = async (category) => {
  try {
    const response = await fetch(
      `${apiUrl}/top-headlines?country=US&category=${encodeURIComponent(category.toLowerCase())}&language=en&pageSize=100&apiKey=${apiKey}`
    );
    const data = await response.json();
    return data; // upstream consumer expects { articles: [...] } shape already from NewsAPI
  } catch (error) {
    console.error("Error in getCategoryHeadlines", error);
    throw error;
  }
};

export const getSearchedHeadlines = async (searchQuery) => {
  try {
    const response = await fetch(
      `${apiUrl}/everything?q=${encodeURIComponent(searchQuery)}&searchIn=content&sortBy=popularity&language=en&pageSize=100&apiKey=${apiKey}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error in getSearchedHeadlines", error);
    throw error;
  }
};
