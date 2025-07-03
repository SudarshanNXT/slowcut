import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.API_KEY_NEWS;
const BASE_URL = 'https://newsdata.io/api/1/latest';

export const getMovieNews = async (req, res) => {
  const query = req.query.q?.trim() || 'movies'; // Default query

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        q: query,
        language: 'en',
        category: 'entertainment'
      }
    });

    const results = response.data?.results || [];

    res.json({
      status: 'success',
      totalResults: results.length,
      results,         // ✅ renamed from "articles"
    });

  } catch (error) {
    console.error('News API Error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch movie news',
    });
  }
};
