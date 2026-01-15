import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ArrowUpDown, Network, ChevronRight, Play } from 'lucide-react';
import { getAlgorithmById, getAllAlgorithms } from '../data';
import ArrayVisualizer from '../components/visualizers/ArrayVisualizer';
import './AlgorithmDetail.css';

// Icon mapping for categories
const categoryIcons = {
    searching: Search,
    sorting: ArrowUpDown,
    graph: Network
};

const AlgorithmDetail = () => {
    const { id } = useParams();
    const [algorithm, setAlgorithm] = useState(null);
    const [activeCodeTab, setActiveCodeTab] = useState('javascript');

    useEffect(() => {
        const algo = getAlgorithmById(id);
        setAlgorithm(algo);
    }, [id]);

    if (!algorithm) {
        return (
            <div className="algorithm-detail loading">
                <div className="container">
                    <p>Loading algorithm...</p>
                </div>
            </div>
        );
    }

    const relatedAlgorithms = getAllAlgorithms()
        .filter(a => a.category === algorithm.category && a.id !== algorithm.id)
        .slice(0, 3);

    const getDifficultyClass = (difficulty) => `badge-${difficulty.toLowerCase()}`;

    const IconComponent = categoryIcons[algorithm.category] || Search;

    return (
        <div className="algorithm-detail">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/algorithms">Algorithms</Link>
                    <ChevronRight size={14} className="separator" />
                    <Link to={`/algorithms?category=${algorithm.category}`}>
                        {algorithm.categoryName}
                    </Link>
                    <ChevronRight size={14} className="separator" />
                    <span className="current">{algorithm.name}</span>
                </nav>

                {/* Header */}
                <header className="detail-header">
                    <div className="header-main">
                        <span
                            className="detail-icon"
                            style={{ background: algorithm.categoryColor }}
                        >
                            <IconComponent size={32} color="white" />
                        </span>
                        <div className="header-info">
                            <h1>{algorithm.name}</h1>
                            <div className="header-meta">
                                <span className={`badge ${getDifficultyClass(algorithm.difficulty)}`}>
                                    {algorithm.difficulty}
                                </span>
                                <span className="meta-item">
                                    <strong>Time:</strong> {algorithm.timeComplexity}
                                </span>
                                <span className="meta-item">
                                    <strong>Space:</strong> {algorithm.spaceComplexity}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="detail-content">
                    {/* Visualizer Section */}
                    <section className="detail-section visualizer-section">
                        <h2><Play size={20} /> Visualization</h2>
                        <div className="visualizer-container card">
                            <ArrayVisualizer algorithmId={algorithm.id} />
                        </div>
                    </section>

                    {/* Description Section */}
                    <section className="detail-section">
                        <h2>How It Works</h2>
                        <div className="description-content card">
                            {algorithm.longDescription.split('\n\n').map((paragraph, index) => {
                                if (paragraph.startsWith('**')) {
                                    // Handle bold headers
                                    const text = paragraph.replace(/\*\*/g, '');
                                    return <h4 key={index}>{text}</h4>;
                                }
                                if (paragraph.startsWith('-')) {
                                    // Handle list items
                                    const items = paragraph.split('\n').filter(item => item.startsWith('-'));
                                    return (
                                        <ul key={index}>
                                            {items.map((item, i) => (
                                                <li key={i}>{item.replace(/^- /, '')}</li>
                                            ))}
                                        </ul>
                                    );
                                }
                                if (/^\d\./.test(paragraph)) {
                                    // Handle numbered list
                                    const items = paragraph.split('\n').filter(item => /^\d\./.test(item));
                                    return (
                                        <ol key={index}>
                                            {items.map((item, i) => (
                                                <li key={i}>{item.replace(/^\d\.\s*/, '')}</li>
                                            ))}
                                        </ol>
                                    );
                                }
                                return <p key={index}>{paragraph}</p>;
                            })}
                        </div>
                    </section>

                    {/* Code Section */}
                    <section className="detail-section">
                        <h2>Implementation</h2>
                        <div className="code-section card">
                            <div className="code-tabs">
                                <button
                                    className={`code-tab ${activeCodeTab === 'javascript' ? 'active' : ''}`}
                                    onClick={() => setActiveCodeTab('javascript')}
                                >
                                    JavaScript
                                </button>
                                <button
                                    className={`code-tab ${activeCodeTab === 'python' ? 'active' : ''}`}
                                    onClick={() => setActiveCodeTab('python')}
                                >
                                    Python
                                </button>
                            </div>
                            <div className="code-block">
                                <pre>
                                    <code>{algorithm.code[activeCodeTab]}</code>
                                </pre>
                            </div>
                        </div>
                    </section>

                    {/* Related Algorithms */}
                    {relatedAlgorithms.length > 0 && (
                        <section className="detail-section">
                            <h2>Related Algorithms</h2>
                            <div className="related-grid">
                                {relatedAlgorithms.map((algo) => (
                                    <Link
                                        to={`/algorithms/${algo.id}`}
                                        key={algo.id}
                                        className="related-card card"
                                    >
                                        <h4>{algo.name}</h4>
                                        <p>{algo.description}</p>
                                        <span className={`badge ${getDifficultyClass(algo.difficulty)}`}>
                                            {algo.difficulty}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlgorithmDetail;
