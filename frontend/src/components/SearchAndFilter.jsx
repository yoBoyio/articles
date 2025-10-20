import { useState } from 'react';
import '../styles/components/search-and-filter.scss';

const SearchAndFilter = ({ onSearch, onSort, filters, loading }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [sortOrder, setSortOrder] = useState(filters.sort || 'desc');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };
  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    onSort(newSortOrder);
  };

  return (
    <div className="search-filter">
      <div className="search-filter__header">
        <h3 className="search-filter__title">Search & Sort</h3>
      </div>

      <div className="search-filter__content">
        <div className="search-filter__search">
          <form onSubmit={handleSearch} className="search-filter__search-form">
            <div className="search-filter__search-container">
              <div className="search-filter__search-icon">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search articles by title..."
                className="search-filter__search-input"
                disabled={loading}
              />
            </div>
          </form>
        </div>

        <div className="search-filter__sort">
          <label className="search-filter__sort-label">Sort by:</label>
          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="search-filter__sort-select"
            disabled={loading}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

    </div>
  );
};

export default SearchAndFilter;