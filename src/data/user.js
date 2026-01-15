/**
 * AlgoPiece MVP - User Mock Data
 * User profile, progress, and achievements
 */

export const currentUser = {
    id: 'user-1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    avatar: null, // Will use initials
    level: 7,
    xp: 2450,
    xpToNextLevel: 3000,
    joinedDate: '2024-09-15',
    streak: 12, // days
};

export const learningProgress = {
    'linear-search': { completed: true, score: 100, attempts: 1, lastAttempt: '2025-01-10' },
    'binary-search': { completed: true, score: 85, attempts: 2, lastAttempt: '2025-01-12' },
    'bubble-sort': { completed: true, score: 90, attempts: 1, lastAttempt: '2025-01-08' },
    'insertion-sort': { completed: true, score: 95, attempts: 1, lastAttempt: '2025-01-09' },
    'merge-sort': { completed: false, score: 60, attempts: 2, lastAttempt: '2025-01-14' },
    'quick-sort': { completed: false, score: 0, attempts: 0, lastAttempt: null },
    'bfs': { completed: false, score: 45, attempts: 1, lastAttempt: '2025-01-13' },
    'dfs': { completed: false, score: 0, attempts: 0, lastAttempt: null },
    'dijkstra': { completed: false, score: 0, attempts: 0, lastAttempt: null },
};

export const badges = [
    {
        id: 'first-step',
        name: 'First Step',
        description: 'Complete your first algorithm',
        icon: '🎯',
        earnedDate: '2025-01-08',
        unlocked: true,
    },
    {
        id: 'search-master',
        name: 'Search Master',
        description: 'Complete all searching algorithms',
        icon: '🔍',
        earnedDate: '2025-01-12',
        unlocked: true,
    },
    {
        id: 'sort-beginner',
        name: 'Sort Beginner',
        description: 'Complete 2 sorting algorithms',
        icon: '📊',
        earnedDate: '2025-01-09',
        unlocked: true,
    },
    {
        id: 'streak-7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        earnedDate: '2025-01-14',
        unlocked: true,
    },
    {
        id: 'sort-master',
        name: 'Sort Master',
        description: 'Complete all sorting algorithms',
        icon: '🏆',
        earnedDate: null,
        unlocked: false,
    },
    {
        id: 'graph-explorer',
        name: 'Graph Explorer',
        description: 'Complete all graph algorithms',
        icon: '🌐',
        earnedDate: null,
        unlocked: false,
    },
    {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Score 100% on 5 algorithms',
        icon: '💎',
        earnedDate: null,
        unlocked: false,
    },
    {
        id: 'speed-demon',
        name: 'Speed Demon',
        description: 'Complete an algorithm in under 2 minutes',
        icon: '⚡',
        earnedDate: null,
        unlocked: false,
    },
];

export const quizHistory = [
    { algorithmId: 'linear-search', score: 100, date: '2025-01-08', duration: 180 },
    { algorithmId: 'bubble-sort', score: 90, date: '2025-01-08', duration: 240 },
    { algorithmId: 'insertion-sort', score: 95, date: '2025-01-09', duration: 200 },
    { algorithmId: 'linear-search', score: 100, date: '2025-01-10', duration: 120 },
    { algorithmId: 'binary-search', score: 70, date: '2025-01-11', duration: 300 },
    { algorithmId: 'binary-search', score: 85, date: '2025-01-12', duration: 250 },
    { algorithmId: 'bfs', score: 45, date: '2025-01-13', duration: 400 },
    { algorithmId: 'merge-sort', score: 55, date: '2025-01-14', duration: 350 },
    { algorithmId: 'merge-sort', score: 60, date: '2025-01-14', duration: 320 },
];

export const recentActivity = [
    { type: 'completed', algorithmId: 'merge-sort', message: 'Practiced Merge Sort', date: '2025-01-14', score: 60 },
    { type: 'badge', badgeId: 'streak-7', message: 'Earned Week Warrior badge', date: '2025-01-14' },
    { type: 'completed', algorithmId: 'bfs', message: 'Started learning BFS', date: '2025-01-13', score: 45 },
    { type: 'completed', algorithmId: 'binary-search', message: 'Mastered Binary Search', date: '2025-01-12', score: 85 },
    { type: 'badge', badgeId: 'search-master', message: 'Earned Search Master badge', date: '2025-01-12' },
];

// Helper functions
export const getUserProgress = () => {
    const total = Object.keys(learningProgress).length;
    const completed = Object.values(learningProgress).filter(p => p.completed).length;
    return {
        total,
        completed,
        percentage: Math.round((completed / total) * 100),
    };
};

export const getUnlockedBadges = () => badges.filter(b => b.unlocked);
export const getLockedBadges = () => badges.filter(b => !b.unlocked);

export const getCategoryProgress = (categoryId) => {
    const categoryAlgos = {
        searching: ['linear-search', 'binary-search'],
        sorting: ['bubble-sort', 'insertion-sort', 'merge-sort', 'quick-sort'],
        graph: ['bfs', 'dfs', 'dijkstra'],
    };

    const algos = categoryAlgos[categoryId] || [];
    const completed = algos.filter(id => learningProgress[id]?.completed).length;

    return {
        total: algos.length,
        completed,
        percentage: Math.round((completed / algos.length) * 100),
    };
};
