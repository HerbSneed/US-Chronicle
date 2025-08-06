import express from 'express';
import { FetchError } from 'node-fetch';
import * as newsController from '../controllers/newsController.js';

const router = express.Router();

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

router.get('/userheadlines', async (req, res) => {
  const { category } = req.query;

  console.log(`[ROUTE] /userheadlines called with category=${category}`); // <<-- add this

  try {
    res.set('Cache-Control', 'no-store, max-age=0');
    const data = await newsController.getUserHeadlines(category);
    console.log('[ROUTE] returning userheadlines payload'); // <<-- and this
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/usheadlines', async (req, res) => {
  console.log('[ROUTE] /usheadlines called');

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
  console.log('[ROUTE] /usheadlines called');
  const { category } = req.query;
  try {
    const data = await newsController.getCategoryHeadlines(category);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
