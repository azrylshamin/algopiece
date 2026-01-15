import {
    currentUser,
    learningProgress,
    badges,
    quizHistory,
    recentActivity,
    getUserProgress,
    getUnlockedBadges,
    getCategoryProgress
} from '../data';
import { algorithmCategories, getAlgorithmById } from '../data';
import './Profile.css';

const Profile = () => {
    const userProgress = getUserProgress();
    const unlockedBadges = getUnlockedBadges();

    // Get initials for avatar
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // Format date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Calculate streak text
    const getStreakText = (streak) => {
        if (streak >= 30) return '🔥 On fire!';
        if (streak >= 7) return '💪 Great progress!';
        if (streak >= 3) return '👍 Keep going!';
        return '🌱 Just starting';
    };

    return (
        <div className="profile-page">
            <div className="container">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-card card">
                        <div className="profile-main">
                            <div className="avatar">
                                {currentUser.avatar ? (
                                    <img src={currentUser.avatar} alt={currentUser.name} />
                                ) : (
                                    <span className="avatar-initials">{getInitials(currentUser.name)}</span>
                                )}
                            </div>
                            <div className="profile-info">
                                <h1>{currentUser.name}</h1>
                                <p className="user-email">{currentUser.email}</p>
                                <div className="user-stats">
                                    <div className="stat">
                                        <span className="stat-icon">⭐</span>
                                        <span className="stat-value">Level {currentUser.level}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-icon">🔥</span>
                                        <span className="stat-value">{currentUser.streak} day streak</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-icon">🏆</span>
                                        <span className="stat-value">{unlockedBadges.length} badges</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* XP Progress */}
                        <div className="xp-section">
                            <div className="xp-info">
                                <span>Level {currentUser.level}</span>
                                <span>{currentUser.xp} / {currentUser.xpToNextLevel} XP</span>
                            </div>
                            <div className="progress">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${(currentUser.xp / currentUser.xpToNextLevel) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="profile-content">
                    {/* Left Column */}
                    <div className="profile-main-content">
                        {/* Overall Progress */}
                        <section className="profile-section">
                            <h2>Learning Progress</h2>
                            <div className="card">
                                <div className="overall-progress">
                                    <div className="progress-circle">
                                        <svg viewBox="0 0 100 100">
                                            <circle className="progress-bg" cx="50" cy="50" r="45" />
                                            <circle
                                                className="progress-fill"
                                                cx="50" cy="50" r="45"
                                                style={{
                                                    strokeDasharray: `${userProgress.percentage * 2.83} 283`
                                                }}
                                            />
                                        </svg>
                                        <div className="progress-text">
                                            <span className="progress-value">{userProgress.percentage}%</span>
                                            <span className="progress-label">Complete</span>
                                        </div>
                                    </div>
                                    <div className="progress-details">
                                        <p>{userProgress.completed} of {userProgress.total} algorithms completed</p>
                                        <p className="progress-motivation">{getStreakText(currentUser.streak)}</p>
                                    </div>
                                </div>

                                {/* Category Progress */}
                                <div className="category-progress-list">
                                    {algorithmCategories.map((category) => {
                                        const progress = getCategoryProgress(category.id);
                                        return (
                                            <div key={category.id} className="category-progress-item">
                                                <div className="category-info">
                                                    <span className="category-icon" style={{ background: category.color }}>
                                                        {category.icon}
                                                    </span>
                                                    <span className="category-name">{category.name}</span>
                                                    <span className="category-count">
                                                        {progress.completed}/{progress.total}
                                                    </span>
                                                </div>
                                                <div className="progress">
                                                    <div
                                                        className="progress-bar"
                                                        style={{
                                                            width: `${progress.percentage}%`,
                                                            background: category.color
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        {/* Quiz History Chart */}
                        <section className="profile-section">
                            <h2>Quiz Performance</h2>
                            <div className="card">
                                <div className="quiz-chart">
                                    {quizHistory.slice(-7).map((quiz, index) => {
                                        const algo = getAlgorithmById(quiz.algorithmId);
                                        return (
                                            <div key={index} className="quiz-bar-container">
                                                <div
                                                    className="quiz-bar"
                                                    style={{
                                                        height: `${quiz.score}%`,
                                                        background: quiz.score >= 80 ? 'var(--color-success)' :
                                                            quiz.score >= 60 ? 'var(--color-warning)' :
                                                                'var(--color-error)'
                                                    }}
                                                />
                                                <span className="quiz-score">{quiz.score}%</span>
                                                <span className="quiz-name">{algo?.name.split(' ')[0] || 'Quiz'}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="profile-sidebar">
                        {/* Badges */}
                        <section className="profile-section">
                            <h2>Badges</h2>
                            <div className="card badges-card">
                                <div className="badges-grid">
                                    {badges.map((badge) => (
                                        <div
                                            key={badge.id}
                                            className={`badge-item ${badge.unlocked ? 'unlocked' : 'locked'}`}
                                            title={badge.description}
                                        >
                                            <span className="badge-icon">{badge.icon}</span>
                                            <span className="badge-name">{badge.name}</span>
                                            {badge.unlocked && badge.earnedDate && (
                                                <span className="badge-date">{formatDate(badge.earnedDate)}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Recent Activity */}
                        <section className="profile-section">
                            <h2>Recent Activity</h2>
                            <div className="card activity-card">
                                <div className="activity-list">
                                    {recentActivity.map((activity, index) => (
                                        <div key={index} className="activity-item">
                                            <span className="activity-icon">
                                                {activity.type === 'completed' ? '✅' : '🏆'}
                                            </span>
                                            <div className="activity-content">
                                                <p className="activity-message">{activity.message}</p>
                                                <span className="activity-date">{formatDate(activity.date)}</span>
                                            </div>
                                            {activity.score && (
                                                <span className="activity-score">{activity.score}%</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
