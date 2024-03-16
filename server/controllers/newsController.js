// controllers/newsController.js
const fetch = require('node-fetch');
const { apiKey, apiUrl } = require('../config/apiConfig');
const { appendFileSync } = require('fs');

async function getSearchedHeadlines(searchQuery) {
 try {
  const response = await fetch(`${apiUrl}/everything?q=${searchQuery}&language=en&pageSize=100&apiKey=${apiKey}`);
  return await response.json();
 } catch (error) {
  throw error;
 }
}

async function getUserHeadlines(userCategory) {
 try {
  const response = await fetch(`${apiUrl}/top-headlines?country=US&category=${userCategory}&pageSize=100&apiKey=${apiKey}`);
  return await response.json();
 } catch (error) {
  throw error;
 }
}

async function getUsHeadlines() {
 try {
  const response = await fetch(`${apiUrl}/top-headlines?country=US&category=general&pageSize=100&apiKey=${apiKey}`);
  return await response.json();
 } catch (error) {
  console.error("Error in getUsHeadlines:", error);
  throw error;
 }
}

async function getCategoryHeadlines(category) {
 try {
  const response = await fetch(`${apiUrl}/top-headlines?country=US&category=${category}&pageSize=100&apiKey=${apiKey}`);
  return await response.json();
 } catch (error) {
  throw error;
 }
}

module.exports = {
 getSearchedHeadlines,
 getUserHeadlines,
 getUsHeadlines,
 getCategoryHeadlines
};
