// App State
let isDark = false;
let currentScreen = 'home';
let hasStartedChallenge = false;
let challengeStartTime = null;
let sidebarOpen = false;

// Motivational Quotes
const quotes = [
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" }
];

// Initialize App
function init() {
    loadData();
    updateTheme();
    updateQuote();
    updateProgress();
    checkFirstTime();
    
    // Update theme every minute
    setInterval(updateTheme, 60000);
    // Update quote every hour
    setInterval(updateQuote, 3600000);
}

// Local Storage Functions
function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadData() {
    const started = localStorage.getItem('hasStartedChallenge');
    const startTime = localStorage.getItem('challengeStartTime');
    const theme = localStorage.getItem('isDark');
    
    if (started) {
        hasStartedChallenge = JSON.parse(started);
        challengeStartTime = startTime ? new Date(JSON.parse(startTime)) : null;
    }
    
    if (theme) {
        isDark = JSON.parse(theme);
    }
}

// Theme Functions
function updateTheme() {
    const hour = new Date().getHours();
    const autoTheme = hour < 6 || hour >= 18;
    
    if (localStorage.getItem('manualTheme') === null) {
        isDark = autoTheme;
    }
    
    document.body.className = isDark ? 'dark' : '';
}

function toggleTheme() {
    isDark = !isDark;
    saveData('isDark', isDark);
    saveData('manualTheme', true);
    document.body.className = isDark ? 'dark' : '';
}

// Quote Functions
function updateQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quoteText').textContent = `"${randomQuote.text}"`;
    document.querySelector('.quote-author').textContent = `- ${randomQuote.author}`;
}

// Progress Functions
function updateProgress() {
    if (!hasStartedChallenge || !challengeStartTime) {
        document.getElementById('daysCount').textContent = '0';
        return;
    }
    
    const now = new Date();
    const diffTime = Math.abs(now - challengeStartTime);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    document.getElementById('daysCount').textContent = diffDays;
    
    // Update circle progress
    const circle = document.querySelector('.circle');
    const progress = Math.min(diffDays / 90, 1); // 90 days target
    const degrees = progress * 360;
    circle.style.background = `conic-gradient(#667eea 0deg, #764ba2 ${degrees}deg, #e0e0e0 ${degrees}deg)`;
}

// Challenge Functions
function checkFirstTime() {
    if (!hasStartedChallenge) {
        document.getElementById('startModal').style.display = 'flex';
    } else {
        document.getElementById('startModal').style.display = 'none';
        updateProgress();
    }
}

function startChallenge() {
    hasStartedChallenge = true;
    challengeStartTime = new Date();
    
    saveData('hasStartedChallenge', true);
    saveData('challengeStartTime', challengeStartTime.toISOString());
    
    document.getElementById('startModal').style.display = 'none';
    updateProgress();
}

function handleRelapse() {
    if (confirm('Are you sure you want to reset your progress?')) {
        hasStartedChallenge = false;
        challengeStartTime = null;
        
        localStorage.removeItem('hasStartedChallenge');
        localStorage.removeItem('challengeStartTime');
        
        document.getElementById('startModal').style.display = 'flex';
        document.getElementById('daysCount').textContent = '0';
        
        // Reset circle
        const circle = document.querySelector('.circle');
        circle.style.background = 'conic-gradient(#667eea 0deg, #764ba2 0deg, #e0e0e0 0deg)';
        
        // Reset habits
        const checkboxes = document.querySelectorAll('.habit-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.classList.remove('checked');
        });
        
        alert('Progress reset. You can start again!');
    }
}

// Habit Functions
function toggleHabit(checkbox) {
    checkbox.classList.toggle('checked');
    
    // Save habit state
    const habitText = checkbox.parentElement.querySelector('span').textContent;
    const isChecked = checkbox.classList.contains('checked');
    const today = new Date().toDateString();
    
    let habits = JSON.parse(localStorage.getItem('habits') || '{}');
    if (!habits[today]) habits[today] = {};
    habits[today][habitText] = isChecked;
    
    saveData('habits', habits);
}

// Load saved habits for today
function loadTodaysHabits() {
    const today = new Date().toDateString();
    const habits = JSON.parse(localStorage.getItem('habits') || '{}');
    const todaysHabits = habits[today] || {};
    
    const habitItems = document.querySelectorAll('.habit-item');
    habitItems.forEach(item => {
        const habitText = item.querySelector('span').textContent;
        const checkbox = item.querySelector('.habit-checkbox');
        
        if (todaysHabits[habitText]) {
            checkbox.classList.add('checked');
        }
    });
}

// Navigation Functions
function navigateTo(screen) {
    currentScreen = screen;
    
    // Hide all screens
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('coachScreen').classList.add('hidden');
    
    // Show selected screen
    if (screen === 'home') {
        document.getElementById('homeScreen').classList.remove('hidden');
        document.getElementById('headerTitle').textContent = 'NoFap Journey';
    } else if (screen === 'coach') {
        document.getElementById('coachScreen').classList.remove('hidden');
        document.getElementById('headerTitle').textContent = 'AI Coach';
    }
    
    closeSidebar();
}

// Sidebar Functions
function toggleSidebar() {
    if (sidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    sidebarOpen = true;
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('open');
}

function closeSidebar() {
    sidebarOpen = false;
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
    loadTodaysHabits();
    
    // Update progress every minute
    setInterval(updateProgress, 60000);
});