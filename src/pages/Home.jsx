import { Link } from 'react-router-dom';
import { BarChart3, BookOpen, Code2, Search, ArrowUpDown, Network, ArrowRight } from 'lucide-react';
import { algorithmCategories, getStats } from '../data';
import './Home.css';

// Icon mapping for categories
const categoryIcons = {
    searching: Search,
    sorting: ArrowUpDown,
    graph: Network
};

const Home = () => {
    const stats = getStats();

    const features = [
        {
            icon: BarChart3,
            title: 'Visualize',
            description: 'Watch algorithms come to life with step-by-step animated visualizations.',
            link: '/algorithms',
            color: '#2563eb'
        },
        {
            icon: BookOpen,
            title: 'Learn',
            description: 'Understand complexity, use cases, and implementation details for each algorithm.',
            link: '/algorithms',
            color: '#f59e0b'
        },
        {
            icon: Code2,
            title: 'Practice',
            description: 'Write and test your own implementations in our interactive playground.',
            link: '/playground',
            color: '#10b981'
        }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-glow hero-glow-1"></div>
                    <div className="hero-glow hero-glow-2"></div>
                </div>
                <div className="container hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Piece Ideas into <span className="text-gradient">Algorithms</span>
                        </h1>
                        <p className="hero-subtitle">
                            Watch algorithms come to life with interactive visualizations.
                            Build your own logic, understand complexity, and master data structures
                            through hands-on learning.
                        </p>
                        <div className="hero-actions">
                            <Link to="/algorithms" className="btn btn-primary btn-lg">
                                Start Learning <ArrowRight size={18} />
                            </Link>
                            <Link to="/playground" className="btn btn-secondary btn-lg">
                                Try Playground
                            </Link>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-illustration">
                            <div className="floating-card floating-card-1">
                                <Search size={20} /> Search
                            </div>
                            <div className="floating-card floating-card-2">
                                <ArrowUpDown size={20} /> Sort
                            </div>
                            <div className="floating-card floating-card-3">
                                <Network size={20} /> Graph
                            </div>
                            <div className="code-snippet">
                                <pre>{`function sort(arr) {
  // Magic happens here ✨
}`}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="stats-bar">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-value">{stats.totalAlgorithms}</span>
                            <span className="stat-label">Algorithms</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.categories}</span>
                            <span className="stat-label">Categories</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">∞</span>
                            <span className="stat-label">Possibilities</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">
                            Three powerful tools to help you master algorithms at your own pace
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <Link to={feature.link} key={index} className="feature-card card">
                                    <div className="feature-icon" style={{ background: feature.color }}>
                                        <IconComponent size={28} color="white" />
                                    </div>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                    <span className="feature-link">
                                        Explore <ArrowRight size={16} />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Algorithm Categories Preview */}
            <section className="section categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Explore Algorithms</h2>
                        <p className="section-subtitle">
                            From simple searches to complex graph traversals
                        </p>
                    </div>
                    <div className="categories-grid">
                        {algorithmCategories.map((category) => {
                            const IconComponent = categoryIcons[category.id] || Search;
                            return (
                                <Link
                                    to={`/algorithms?category=${category.id}`}
                                    key={category.id}
                                    className="category-card card"
                                >
                                    <div className="category-header">
                                        <span className="category-icon" style={{ background: category.color }}>
                                            <IconComponent size={24} color="white" />
                                        </span>
                                        <div className="category-info">
                                            <h3 className="category-name">{category.name}</h3>
                                            <p className="category-count">
                                                {category.algorithms.length} algorithms
                                            </p>
                                        </div>
                                    </div>
                                    <p className="category-description">{category.description}</p>
                                    <div className="category-algorithms">
                                        {category.algorithms.slice(0, 3).map((algo) => (
                                            <span key={algo.id} className="algo-chip">
                                                {algo.name}
                                            </span>
                                        ))}
                                        {category.algorithms.length > 3 && (
                                            <span className="algo-chip algo-chip-more">
                                                +{category.algorithms.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Start Learning?</h2>
                        <p>Join thousands of learners mastering algorithms through visualization</p>
                        <Link to="/algorithms" className="btn btn-primary btn-lg">
                            Browse All Algorithms <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
