// Import necessary modules
const fetch = require('node-fetch'); // Module to make HTTP requests
const { apiKey, apiUrl } = require('../config/apiConfig'); // API configuration

// Function to fetch headlines based on a search query
async function getSearchedHeadlines(searchQuery) {
 try {
  // Make a GET request to News API with search query
  const response = await fetch(`${apiUrl}/everything?q=${searchQuery}&language=en&pageSize=100&apiKey=${apiKey}`);
  // Parse response JSON and return
  return await response.json();
 } catch (error) {
  console.error("Error in getSearchedHeadlines", error);
  throw error;
 }
}

// Function to fetch headlines based on user's selected category
async function getUserHeadlines(userCategory) {
 try {
  // Make a GET request to News API with user's selected category
  const response = await fetch(`${apiUrl}/top-headlines?country=US&category=${userCategory}&language=en&pageSize=100&apiKey=${apiKey}`);
  // Parse response JSON and return
  return await response.json();
 } catch (error) {
  console.error("Error in getUserHeadlines", error);
  throw error;
 }
}

// Function to fetch US general headlines
async function getUsHeadlines() {
 try {
  // Make a GET request to News API for US general headlines
  const response = await fetch(`${apiUrl}/top-headlines?country=US&category=general&language=en&pageSize=100&apiKey=${apiKey}`);
  // Parse response JSON and return
  return await response.json();
 } catch (error) {
  console.error("Error in getUsHeadlines", error);
  throw error;
 }
}

// Function to fetch headlines based on a specific category
async function getCategoryHeadlines(category) {
 try {
  // Make a GET request to News API with the specified category
  const response = await fetch(`${apiUrl}/top-headlines?country=US&category=${category}&language=en&pageSize=100&apiKey=${apiKey}`);
  // Parse response JSON and return
  return await response.json();
 } catch (error) {
  console.error("Error in getCategoryHeadlines", error);
  throw error;
 }
}

// Export all controller functions
module.exports = {
 getSearchedHeadlines,
 getUserHeadlines,
 getUsHeadlines,
 getCategoryHeadlines
};
