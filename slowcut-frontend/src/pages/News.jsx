import React, { useState, useEffect } from 'react';
import { FiSearch, FiCalendar, FiUser, FiExternalLink } from 'react-icons/fi';
import Loading from '../components/Loading.jsx';
const News = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [newsData, setNewsData] = useState({
    status: "",
    totalResults: 0,
    results: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        let url = `${apiBaseUrl}/news`;
        if (searchQuery) {
          url = `${apiBaseUrl}/news?q=${encodeURIComponent(searchQuery)}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`);
        }
        const data = await response.json();
        setNewsData({
          status: data.status || "success",
          totalResults: data.totalResults || 0,
          results: data.results || []
        });
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("News fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchNews, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, apiBaseUrl]);

  const categories = ['All', ...new Set(
    newsData.results.flatMap(article => article?.category || [])
  )];

  const filteredArticles = newsData.results.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         article.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || 
                          article.category?.includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return "Unknown date";
    }
  };

  if (loading && newsData.results.length === 0) {
    return (
      <div className="min-h-screen bg-secondary text-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-700 rounded w-1/4 mx-auto"></div>
            <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto"></div>
            <div className="h-12 bg-gray-700 rounded-lg w-3/4 mx-auto"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-700"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary text-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="text-red-400 mb-6 text-xl">Error loading news</div>
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <code className="text-gray-300">{error}</code>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary text-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Latest News</h1>
          <p className="text-lg text-gray-400">
            Stay updated with the latest entertainment news
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search film news articles..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mb-6 text-gray-400">
          Showing {filteredArticles.length} of {newsData.totalResults} articles
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <div key={article.article_id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:bg-gray-750">
                {article.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200/1a202c/718096?text=No+Image';
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <FiCalendar className="mr-1" />
                    <span>{formatDate(article.pubDate)}</span>
                    <span className="mx-2">•</span>
                    <span className="font-medium text-blue-400">{article.source_name}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUser className="mr-1" />
                      <span>{article.creator?.join(', ') || 'Unknown Author'}</span>
                    </div>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-400 hover:text-blue-300"
                    >
                      Read more <FiExternalLink className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-300 mb-2">No articles found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;