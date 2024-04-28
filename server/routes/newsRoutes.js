// Import necessary modules
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController'); // Import news controller
const { FetchError } = require('node-fetch'); // Import FetchError from node-fetch

// Route to get headlines based on search query
router.get('/search', async (req, res) => {
 const { searchQuery } = req.query;
 try {
  const data = await newsController.getSearchedHeadlines(searchQuery);
  res.json(data);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
 }
});

// Route to get headlines based on user's selected category
router.get('/userheadlines', async (req, res) => {
 const { category } = req.query;
 try {
  const data = await newsController.getUserHeadlines(category);
  res.json(data);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
 }
});

// Route to get US general headlines
router.get('/usheadlines', async (req, res) => {
 try {
  const data = await newsController.getUsHeadlines();
  res.json(data);
 } catch (error) {
  // Handle different types of errors
  if (error instanceof FetchError) {
   console.error("Fetch error in /api/usheadlines:", error);
   res.status(404).json({ error: 'Resource not found' });
  } else {
   console.error("Internal server error in /api/usheadlines:", error);
   res.status(500).json({ error: 'Internal Server Error' });
  }
 }
});

// Route to get headlines based on a specific category
router.get('/categoryheadlines', async (req, res) => {
 const { category } = req.query;
 try {
  const data = await newsController.getCategoryHeadlines(category);
  res.json(data);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
 }
});


module.exports = router;
