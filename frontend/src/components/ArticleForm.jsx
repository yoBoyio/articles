import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import '../styles/components/article-form.scss';

const ArticleForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getArticle(id, token);
      setFormData({
        title: response.data.title,
        content: response.data.content
      });
    } catch (err) {
      console.error('Error fetching article:', err);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await apiService.updateArticle(id, formData, token);
      } else {
        await apiService.createArticle(formData, token);
      }
      navigate('/');
    } catch (err) {
      console.error('Error saving article:', err);
      setErrors({ submit: err.message || 'Failed to save article' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="article-form__loading">
        <div className="article-form__loading-container">
          <div className="article-form__loading-spinner"></div>
          <p className="article-form__loading-text">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="article-form">
      <div className="article-form__container">
        <div className="article-form__content">
          <div className="article-form__card">
            <div className="article-form__header">
              <h1 className="article-form__title">
                {isEdit ? 'Edit Article' : 'Create New Article'}
              </h1>
              <p className="article-form__subtitle">
                {isEdit ? 'Update your article details below' : 'Fill in the details to create a new article'}
              </p>
            </div>

            {errors.submit && (
              <div className="article-form__error">
                <div className="flex">
                  <div className="article-form__error-icon">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="article-form__error-content">
                    <p className="article-form__error-text">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="article-form__form">
              <div className="article-form__field">
                <label htmlFor="title" className="article-form__field-label">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`article-form__field-input ${
                    errors.title ? 'article-form__field-input--error' : 'article-form__field-input--normal'
                  }`}
                  placeholder="Enter article title"
                  maxLength={255}
                />
                {errors.title && (
                  <p className="article-form__field-error">{errors.title}</p>
                )}
                <p className="article-form__field-counter">
                  {formData.title.length}/255 characters
                </p>
              </div>

              <div className="article-form__field">
                <label htmlFor="content" className="article-form__field-label">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={12}
                  value={formData.content}
                  onChange={handleInputChange}
                  className={`article-form__field-textarea ${
                    errors.content ? 'article-form__field-textarea--error' : 'article-form__field-textarea--normal'
                  }`}
                  placeholder="Write your article content here..."
                />
                {errors.content && (
                  <p className="article-form__field-error">{errors.content}</p>
                )}
              </div>

              <div className="article-form__actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="article-form__button article-form__button--cancel"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="article-form__button article-form__button--submit"
                >
                  {loading ? (
                    <div className="article-form__button-content">
                      <div className="article-form__button-spinner"></div>
                      {isEdit ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    isEdit ? 'Update Article' : 'Create Article'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleForm;
