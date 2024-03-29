const fetch = require('node-fetch');
const { apiKey, apiUrl } = require('../config/apiConfig');
const { appendFileSync } = require('fs');

async function getSearchedHeadlines(searchQuery) {
 try {
  const response = await fetch(`${apiUrl}/everything?q=${searchQuery}&language=en&pageSize=100&apiKey=${apiKey}`);
  return await response.json();
 } catch (error) {
  console.error("Error in getSearchedHeadlines", error)
  throw error;
 }
}

async function getUserHeadlines(userCategory) {
 try {
  const response = await fetch(`${apiUrl}/top-headlines?country=US&category=${userCategory}&language=en&pageSize=100&apiKey=${apiKey}`);
  return await response.json();
 } catch (error) {
  console.error("Error in getUserHeadlines", error)
  throw error;
 }
}

async function getUsHeadlines() {
 try {
  const response = await fetch(`${apiUrl}/top-headlines?country=US&category=general&language=en&pageSize=100&apiKey=${apiKey}`);
  return await response.json();
 } catch (error) {
  console.error("Error in getUsHeadlines", error);
  throw error;
 }
}

async function getCategoryHeadlines(category) {
 try {
  const response = await fetch(`${apiUrl}/top-headlines?country=US&category=${category}&language=en&pageSize=100&apiKey=${apiKey}`);
  return await response.json();
 } catch (error) {
  console.error("Error in getCategoryHeadlines", error)
  throw error;
 }
}

module.exports = {
 getSearchedHeadlines,
 getUserHeadlines,
 getUsHeadlines,
 getCategoryHeadlines
};
