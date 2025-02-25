// Import necessary modules
import fetch from 'node-fetch'; // Module to make HTTP requests
import { apiKey, apiUrl } from '../config/apiConfig.js'; // API configuration

// Function to fetch headlines based on a search query
export const getSearchedHeadlines = async (searchQuery) => {
  try {
    // Make a GET request to News API with search query
    const response = await fetch(`${apiUrl}/everything?q=${searchQuery}&searchIn=content&sortBy=popularity&language=en&pageSize=100&apiKey=${apiKey}`);

    // Parse response JSON and return
    return await response.json();
  } catch (error) {
    console.error("Error in getSearchedHeadlines", error);
    throw error;
  }
};

// Function to fetch headlines based on user's selected category
export const getUserHeadlines = async (userCategory) => {
  try {
    // Make a GET request to News API with user's selected category
    const response = await fetch(`${apiUrl}/top-headlines?country=US&category=${userCategory}&language=en&pageSize=100&apiKey=${apiKey}`);

    // Parse response JSON and return
    return await response.json();
  } catch (error) {
    console.error("Error in getUserHeadlines", error);
    throw error;
  }
};

// Function to fetch US general headlines
export const getUsHeadlines = async () => {
  try {
    // Make a GET request to News API for US general headlines
    const response = await fetch(`${apiUrl}/top-headlines?country=US&category=general&language=en&pageSize=100&apiKey=${apiKey}`);

    // Parse response JSON and return
    return await response.json();
  } catch (error) {
    console.error("Error in getUsHeadlines", error);
    throw error;
  }
};

// Function to fetch headlines based on a specific category
export const getCategoryHeadlines = async (category) => {
  try {
    // Make a GET request to News API with the specified category
    const response = await fetch(`${apiUrl}/top-headlines?country=US&category=${category}&language=en&pageSize=100&apiKey=${apiKey}`);

    // Parse response JSON and return
    return await response.json();
  } catch (error) {
    console.error("Error in getCategoryHeadlines", error);
    throw error;
  }
};
