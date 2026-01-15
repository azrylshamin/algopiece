import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { algorithmCategories, getAllAlgorithms } from '../data';
import './Algorithms.css';

const Algorithms = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');

    const activeCategory = searchParams.get('category') || 'all';

    const allAlgorithms = useMemo(() => getAllAlgorithms(), []);

    const filteredAlgorithms = useMemo(() => {
        let result = allAlgorithms;

        // Filter by category
        if (activeCategory !== 'all') {
            result = result.filter(algo => algo.category === activeCategory);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(algo =>
                algo.name.toLowerCase().includes(query) ||
                algo.description.toLowerCase().includes(query)
            );
        }

        return result;
    }, [allAlgorithms, activeCategory, searchQuery]);

    const handleCategoryChange = (categoryId) => {
        if (categoryId === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', categoryId);
        }
        setSearchParams(searchParams);
    };

    const getDifficultyClass = (difficulty) => {
        return `badge-${difficulty.toLowerCase()}`;
    };

    return (
        <div className="algorithms-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Algorithm Library</h1>
                    <p>Explore and master fundamental algorithms through interactive visualizations</p>
                </div>

                {/* Filters */}
                <div className="filters">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="input search-input"
                            placeholder="Search algorithms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="category-tabs">
                        <button
                            className={`tab ${activeCategory === 'all' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('all')}
                        >
                            All
                        </button>
                        {algorithmCategories.map((category) => (
                            <button
                                key={category.id}
                                className={`tab ${activeCategory === category.id ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(category.id)}
                            >
                                <span className="tab-icon">{category.icon}</span>
                                {category.name.replace(' Algorithms', '')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="results-info">
                    <span className="results-count">
                        {filteredAlgorithms.length} algorithm{filteredAlgorithms.length !== 1 ? 's' : ''} found
                    </span>
                </div>

                {/* Algorithms Grid */}
                {filteredAlgorithms.length > 0 ? (
                    <div className="algorithms-grid">
                        {filteredAlgorithms.map((algo) => (
                            <Link
                                to={`/algorithms/${algo.id}`}
                                key={algo.id}
                                className="algorithm-card card"
                            >
                                <div className="algo-card-header">
                                    <span
                                        className="algo-category-icon"
                                        style={{ background: algo.categoryColor }}
                                    >
                                        {algo.categoryIcon}
                                    </span>
                                    <span className={`badge ${getDifficultyClass(algo.difficulty)}`}>
                                        {algo.difficulty}
                                    </span>
                                </div>

                                <h3 className="algo-name">{algo.name}</h3>
                                <p className="algo-description">{algo.description}</p>

                                <div className="algo-meta">
                                    <div className="complexity-info">
                                        <span className="complexity-label">Time</span>
                                        <span className="complexity-value">{algo.timeComplexity}</span>
                                    </div>
                                    <div className="complexity-info">
                                        <span className="complexity-label">Space</span>
                                        <span className="complexity-value">{algo.spaceComplexity}</span>
                                    </div>
                                </div>

                                <div className="algo-action">
                                    <span>Visualize & Learn →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <span className="no-results-icon">🔍</span>
                        <h3>No algorithms found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Algorithms;
