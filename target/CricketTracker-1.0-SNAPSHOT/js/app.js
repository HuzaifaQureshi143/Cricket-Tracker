/**
 * Cricket Tracker - Main Application Controller
 * 
 * Handles navigation, state management, and coordinates all modules.
 * 
 * @version 1.0.0
 * @date 2025-12-15
 */

import { db } from './firebase-config.js';
import * as matchService from './match-service.js';
import * as validation from './validation.js';
import * as ui from './ui-components.js';
import * as charts from './charts.js';

// Application state
const AppState = {
    currentView: 'dashboard',
    matches: [],
    stats: null,
    editingMatchId: null
};

/**
 * Initialize application
 */
export async function initApp() {
    console.log('🏏 Initializing Cricket Tracker...');

    try {
        // Set up navigation
        setupNavigation();

        // Load initial data
        await loadDashboard();

        // Set up event listeners
        setupEventListeners();

        console.log('✅ Cricket Tracker initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        ui.showToast('Failed to initialize application. Please refresh the page.', 'error', 5000);
    }
}

/**
 * Set up navigation
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.dataset.view;
            navigateTo(view);
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
        });
    }
}

/**
 * Navigate to a view
 * @param {string} view - View name
 */
async function navigateTo(view) {
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.view === view) {
            link.classList.add('active');
        }
    });

    // Hide all views
    document.querySelectorAll('.view').forEach(v => {
        v.classList.add('hidden');
    });

    // Show selected view
    const viewElement = document.getElementById(`${view}-view`);
    if (viewElement) {
        viewElement.classList.remove('hidden');
        AppState.currentView = view;

        // Load view-specific data
        switch (view) {
            case 'dashboard':
                await loadDashboard();
                break;
            case 'add-match':
                resetAddMatchForm();
                break;
            case 'history':
                await loadHistory();
                break;
            case 'stats':
                await loadStats();
                break;
        }
    }

    // Close mobile menu
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.remove('mobile-open');
    }
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Add Match Form
    const addMatchForm = document.getElementById('add-match-form');
    if (addMatchForm) {
        addMatchForm.addEventListener('submit', handleAddMatch);

        // Real-time validation
        const inputs = addMatchForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                const formData = new FormData(addMatchForm);
                const data = Object.fromEntries(formData.entries());
                const error = validation.validateField(input.name, input.value, data);

                // Clear previous error
                const existingError = input.parentNode.querySelector('.error-message');
                if (existingError) existingError.remove();
                input.classList.remove('input-error');

                // Show new error if exists
                if (error) {
                    input.classList.add('input-error');
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message';
                    errorDiv.textContent = error;
                    input.parentNode.appendChild(errorDiv);
                }
            });
        });
    }
}

/**
 * Load dashboard
 */
async function loadDashboard() {
    const loading = ui.showLoading('Loading dashboard...');

    try {
        // Load stats
        const stats = await matchService.getPlayerStats();
        AppState.stats = stats;

        // Update stats cards
        updateStatsCards(stats);

        // Load recent matches
        const recentMatches = await matchService.getRecentMatches(5);
        AppState.matches = recentMatches;

        // Update recent matches section
        updateRecentMatches(recentMatches);

        // Initialize charts
        charts.initializeDashboardCharts(recentMatches, stats);

        loading.close();
    } catch (error) {
        loading.close();
        console.error('❌ Error loading dashboard:', error);
        ui.showToast('Failed to load dashboard data', 'error');
    }
}

/**
 * Update stats cards
 * @param {Object} stats - Player statistics
 */
function updateStatsCards(stats) {
    document.getElementById('total-matches').textContent = stats.totalMatches || 0;
    document.getElementById('total-runs').textContent = stats.totalRuns || 0;
    document.getElementById('total-wickets').textContent = stats.totalWickets || 0;
    document.getElementById('batting-average').textContent = stats.battingAverage?.toFixed(2) || '0.00';
    document.getElementById('strike-rate').textContent = stats.strikeRate?.toFixed(2) || '0.00';
    document.getElementById('bowling-average').textContent = stats.bowlingAverage?.toFixed(2) || '0.00';
}

/**
 * Update recent matches section
 * @param {Array} matches - Recent matches
 */
function updateRecentMatches(matches) {
    const container = document.getElementById('recent-matches');

    if (matches.length === 0) {
        container.innerHTML = '';
        container.appendChild(ui.createEmptyState('No matches recorded yet. Add your first match!', '<i class="fas fa-inbox"></i>'));
        return;
    }

    const stats = [];
    const html = matches.map(match => {
        const matchStats = [];
        if (match.runsScored > 0) {
            matchStats.push(`<span class="match-stat-item"><i class="fas fa-running"></i> ${match.runsScored} runs</span>`);
        }
        if (match.wicketsTaken > 0) {
            matchStats.push(`<span class="match-stat-item"><i class="fas fa-bullseye"></i> ${match.wicketsTaken} wickets</span>`);
        }
        if (match.catches > 0) {
            matchStats.push(`<span class="match-stat-item"><i class="fas fa-hand-paper"></i> ${match.catches} catches</span>`);
        }

        return `
            <div class="match-summary">
                <div class="match-date">
                    <i class="fas fa-calendar"></i>
                    ${matchService.formatDate(match.matchDate)}
                </div>
                <div class="match-opponent">
                    <i class="fas fa-users"></i>
                    vs ${match.opponent}
                </div>
                <div class="match-stats">
                    ${matchStats.join('')}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

/**
 * Handle add match form submission
 * @param {Event} e - Submit event
 */
async function handleAddMatch(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Validate form
    const errors = validation.validateForm(data);
    if (Object.keys(errors).length > 0) {
        validation.displayValidationErrors(errors);
        ui.showToast('Please fix the errors in the form', 'error');
        return;
    }

    // Clear validation errors
    validation.clearValidationErrors();

    // Sanitize data
    const sanitizedData = validation.sanitizeFormData(data);

    const loading = ui.showLoading('Adding match...');

    try {
        await matchService.addMatch(sanitizedData);
        loading.close();
        ui.showToast('Match added successfully!', 'success');

        // Reset form
        e.target.reset();

        // Refresh dashboard
        await loadDashboard();

        // Navigate to dashboard
        navigateTo('dashboard');
    } catch (error) {
        loading.close();
        console.error('❌ Error adding match:', error);
        ui.showToast(error.message || 'Failed to add match', 'error');
    }
}

/**
 * Reset add match form
 */
function resetAddMatchForm() {
    const form = document.getElementById('add-match-form');
    if (form) {
        form.reset();
        validation.clearValidationErrors();

        // Set today's date as default
        const dateInput = form.elements['matchDate'];
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }
}

/**
 * Load match history
 */
async function loadHistory() {
    const loading = ui.showLoading('Loading match history...');

    try {
        const matches = await matchService.getAllMatches();
        AppState.matches = matches;

        updateHistoryTable(matches);
        loading.close();
    } catch (error) {
        loading.close();
        console.error('❌ Error loading history:', error);
        ui.showToast('Failed to load match history', 'error');
    }
}

/**
 * Update history table
 * @param {Array} matches - All matches
 */
function updateHistoryTable(matches) {
    const tbody = document.getElementById('history-tbody');

    if (matches.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    ${ui.createEmptyState('No matches found. Start tracking your performance!', '<i class="fas fa-chart-line"></i>').outerHTML}
                </td>
            </tr>
        `;
        return;
    }

    const html = matches.map(match => `
        <tr>
            <td>${matchService.formatDate(match.matchDate)}</td>
            <td>${match.opponent}</td>
            <td>${match.runsScored || '-'}</td>
            <td>${match.ballsFaced || '-'}</td>
            <td>${match.wicketsTaken || '-'}</td>
            <td>${match.oversBowled || '-'}</td>
            <td>${match.runsConceded || '-'}</td>
            <td>${match.catches || '-'}</td>
            <td class="table-actions">
                <button class="icon-btn" onclick="window.editMatch('${match.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn delete" onclick="window.deleteMatch('${match.id}')" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `).join('');

    tbody.innerHTML = html;
}

/**
 * Edit match
 * @param {string} matchId - Match ID
 */
window.editMatch = async function (matchId) {
    try {
        const match = await matchService.getMatch(matchId);
        if (!match) {
            ui.showToast('Match not found', 'error');
            return;
        }

        ui.showEditMatchModal(match, async (updatedData) => {
            const loading = ui.showLoading('Updating match...');

            try {
                // Validate
                const errors = validation.validateForm(updatedData);
                if (Object.keys(errors).length > 0) {
                    loading.close();
                    ui.showToast('Please fix the errors in the form', 'error');
                    return;
                }

                // Sanitize
                const sanitizedData = validation.sanitizeFormData(updatedData);

                await matchService.updateMatch(matchId, sanitizedData);
                loading.close();
                ui.showToast('Match updated successfully!', 'success');

                // Refresh current view
                if (AppState.currentView === 'history') {
                    await loadHistory();
                } else {
                    await loadDashboard();
                }
            } catch (error) {
                loading.close();
                console.error('❌ Error updating match:', error);
                ui.showToast(error.message || 'Failed to update match', 'error');
            }
        });
    } catch (error) {
        console.error('❌ Error loading match for edit:', error);
        ui.showToast('Failed to load match data', 'error');
    }
};

/**
 * Delete match
 * @param {string} matchId - Match ID
 */
window.deleteMatch = function (matchId) {
    ui.showConfirmDialog(
        'Delete Match',
        'Are you sure you want to delete this match? This action cannot be undone.',
        async () => {
            const loading = ui.showLoading('Deleting match...');

            try {
                await matchService.deleteMatch(matchId);
                loading.close();
                ui.showToast('Match deleted successfully!', 'success');

                // Refresh current view
                if (AppState.currentView === 'history') {
                    await loadHistory();
                } else {
                    await loadDashboard();
                }
            } catch (error) {
                loading.close();
                console.error('❌ Error deleting match:', error);
                ui.showToast('Failed to delete match', 'error');
            }
        }
    );
};

/**
 * Load detailed statistics
 */
async function loadStats() {
    const loading = ui.showLoading('Loading statistics...');

    try {
        const stats = await matchService.getPlayerStats();
        AppState.stats = stats;

        updateDetailedStats(stats);

        // Load matches for charts
        const matches = await matchService.getAllMatches();
        charts.initializeStatsCharts(matches, stats);
        loading.close();
    } catch (error) {
        loading.close();
        console.error('❌ Error loading stats:', error);
        ui.showToast('Failed to load statistics', 'error');
    }
}

/**
 * Update detailed statistics view
 * @param {Object} stats - Player statistics
 */
function updateDetailedStats(stats) {
    // Batting stats
    document.getElementById('stats-total-runs').textContent = stats.totalRuns || 0;
    document.getElementById('stats-total-balls').textContent = stats.totalBallsFaced || 0;
    document.getElementById('stats-batting-avg').textContent = stats.battingAverage?.toFixed(2) || '0.00';
    document.getElementById('stats-strike-rate').textContent = stats.strikeRate?.toFixed(2) || '0.00';

    // Bowling stats
    document.getElementById('stats-total-wickets').textContent = stats.totalWickets || 0;
    document.getElementById('stats-total-overs').textContent = stats.totalOversBowled?.toFixed(1) || '0.0';
    document.getElementById('stats-runs-conceded').textContent = stats.totalRunsConceded || 0;
    document.getElementById('stats-bowling-avg').textContent = stats.bowlingAverage?.toFixed(2) || '0.00';
    document.getElementById('stats-economy-rate').textContent = stats.economyRate?.toFixed(2) || '0.00';

    // Fielding stats
    document.getElementById('stats-total-catches').textContent = stats.totalCatches || 0;

    // Overall
    document.getElementById('stats-total-matches').textContent = stats.totalMatches || 0;
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
