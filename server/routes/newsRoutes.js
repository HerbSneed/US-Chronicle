// routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/api/search', async (req, res) => {
 const { query } = req.query;
 try {
  const data = await newsController.getSearchedHeadlines(query);
  res.json(data);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
 }
});

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

router.get('/usheadlines', async (req, res) => {
 try {
  const data = await newsController.getUsHeadlines();
  res.json(data);
 } catch (error) {
  if (error instanceof FetchError) {
   console.error("Fetch error in /api/usheadlines:", error);
   res.status(404).json({ error: 'Resource not found' });
  } else {
   console.error("Internal server error in /api/usheadlines:", error);
   res.status(500).json({ error: 'Internal Server Error' });
  }
 }
});

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
