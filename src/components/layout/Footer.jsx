import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <img src="/logo.png" alt="AlgoPiece" className="footer-logo-img" />
                            <span className="logo-text">AlgoPiece</span>
                        </Link>
                        <p className="footer-tagline">
                            Piece ideas into algorithms. Learn, visualize, and master data structures
                            and algorithms through interactive experiences.
                        </p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-section">
                            <h4>Learn</h4>
                            <Link to="/algorithms">All Algorithms</Link>
                            <Link to="/algorithms?category=sorting">Sorting</Link>
                            <Link to="/algorithms?category=searching">Searching</Link>
                            <Link to="/algorithms?category=graph">Graph</Link>
                        </div>

                        <div className="footer-section">
                            <h4>Practice</h4>
                            <Link to="/playground">Playground</Link>
                            <Link to="/profile">Your Progress</Link>
                        </div>

                        <div className="footer-section">
                            <h4>Connect</h4>
                            <a href="https://github.com/azrylshamin/algopiece" target="_blank" rel="noopener noreferrer" className="github-link">
                                <Github size={16} />
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} AlgoPiece. Built for learning algorithms.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
