import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import SearchAndFilter from '../components/SearchAndFilter';
import '../styles/components/home-page.scss';

const HomePage = () => {
  const { token, logout, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [allArticles, setAllArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sort: 'desc'
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allArticles, filters]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await apiService.getArticles();
      setAllArticles(response.data);
    } catch (err) {
      setError('Failed to fetch articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allArticles];

    if (filters.search) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return filters.sort === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredArticles(filtered);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateArticle = () => {
    navigate('/articles/create');
  };

  const handleEditArticle = (articleId) => {
    navigate(`/articles/edit/${articleId}`);
  };

  const handleDeleteArticle = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await apiService.deleteArticle(articleId, token);
        setAllArticles(allArticles.filter(article => article.id !== articleId));
      } catch (err) {
        setError('Failed to delete article');
        console.error('Error deleting article:', err);
      }
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleSort = (sortOrder) => {
    setFilters(prev => ({ ...prev, sort: sortOrder }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="home-page__loading">
        <div className="home-page__loading-container">
          <div className="home-page__loading-spinner">
            <div className="home-page__loading-spinner-outer"></div>
            <div className="home-page__loading-spinner-inner"></div>
          </div>
          <p className="home-page__loading-title">Loading articles...</p>
          <p className="home-page__loading-subtitle">Please wait while we fetch your content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-page__container">
        <div className="home-page__content">
          <div className="home-page__header">
            <div className="home-page__header-content">
              <div className="home-page__header-info">
                <h1 className="home-page__header-title">Articles Overview</h1>
                <p className="home-page__header-subtitle">
                  {isAuthenticated() ? `Welcome back, ${user?.name || 'User'}!` : 'Browse all published articles'}
                </p>
              </div>
              <div className="home-page__header-actions">
                {isAuthenticated() ? (
                  <>
                    <button
                      onClick={handleCreateArticle}
                      className="home-page__button home-page__button--create"
                    >
                      <svg className="home-page__button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Article
                    </button>
                    <button
                      onClick={handleLogout}
                      className="home-page__button home-page__button--logout"
                    >
                      <svg className="home-page__button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate('/login')}
                      className="home-page__button home-page__button--login"
                    >
                      <svg className="home-page__button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="home-page__button home-page__button--register"
                    >
                      <svg className="home-page__button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="home-page__error">
              <div className="home-page__error-content">
                <div className="home-page__error-icon">
                  <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="home-page__error-text">{error}</p>
                </div>
              </div>
            </div>
          )}

          <SearchAndFilter
            onSearch={handleSearch}
            onSort={handleSort}
            filters={filters}
            loading={loading}
          />

          <div className="home-page__articles">
            <div className="home-page__articles-header">
              <div className="home-page__articles-header-content">
                <div>
                  <h2 className="home-page__articles-header-title">
                    {filters.search ? 'Search Results' : 'All Articles'}
                  </h2>
                </div>
                {filteredArticles.length > 0 && (
                  <div className="home-page__articles-header-info">
                    <svg className="home-page__articles-header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Manage your content
                  </div>
                )}
              </div>
            </div>
            
            {filteredArticles.length === 0 ? (
              <div className="home-page__articles-empty">
                <div className="home-page__articles-empty-icon">
                  <svg className="home-page__articles-empty-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="home-page__articles-empty-title">
                  {filters.search ? 'No articles found' : 'No articles yet'}
                </h3>
                <p className="home-page__articles-empty-description">
                  {filters.search
                    ? 'Better luck next time.'
                    : isAuthenticated() 
                      ? 'Share your thoughts and ideas with the world.'
                      : 'No articles have been published yet. Check back later for new content!'
                  }
                </p>
                {isAuthenticated() && (
                  <button
                    onClick={handleCreateArticle}
                    className="home-page__articles-empty-button"
                  >
                    <svg className="home-page__articles-empty-button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First Article
                  </button>
                )}
              </div>
            ) : (
              <div className="home-page__articles-list">
                {filteredArticles.map((article, index) => (
                  <div 
                    key={article.id} 
                    className="home-page__articles-item"
                  >
                    <div className="home-page__articles-item-content">
                      <div className="home-page__articles-item-main">
                        <h3 className="home-page__articles-item-title">
                          {article.title}
                        </h3>
                        <p className="home-page__articles-item-description">
                          {article.content}
                        </p>
                        <div className="home-page__articles-item-meta">
                          <div className="home-page__articles-item-author">
                            <div className="home-page__articles-item-avatar">
                              <span className="home-page__articles-item-avatar-text">
                                {(article.user?.name || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="home-page__articles-item-author-name">By {article.user?.name || 'Unknown'}</span>
                          </div>
                          <span className="home-page__articles-item-separator">•</span>
                          <span className="home-page__articles-item-date">
                            <svg className="home-page__articles-item-date-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(article.created_at)}
                          </span>
                        </div>
                      </div>

                      {isAuthenticated() && user && user.id == article.user.id && 
                      <div className="home-page__articles-item-actions">
                        <button
                          onClick={() => handleEditArticle(article.id)}
                          className="home-page__articles-item-action home-page__articles-item-action--edit"
                          title="Edit article"
                        >
                          <svg className="home-page__articles-item-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="home-page__articles-item-action home-page__articles-item-action--delete"
                          title="Delete article"
                        >
                          <svg className="home-page__articles-item-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
    }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;