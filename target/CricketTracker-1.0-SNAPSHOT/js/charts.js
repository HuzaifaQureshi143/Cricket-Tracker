/**
 * Charts Module for Cricket Tracker
 * 
 * Creates and manages Chart.js visualizations for cricket statistics
 * 
 * @version 1.0.0
 * @date 2025-12-15
 */

// Chart instances
const charts = {
    dashboard: {
        trend: null,
        distribution: null
    },
    stats: {
        trend: null,
        distribution: null
    }
};

/**
 * Initialize dashboard charts
 * @param {Array} matches - Match history data
 * @param {Object} stats - Player statistics
 */
export function initializeDashboardCharts(matches, stats) {
    charts.dashboard.trend = createPerformanceTrendChart(matches, 'performanceTrendChart', charts.dashboard.trend, 10);
    charts.dashboard.distribution = createBattingBowlingChart(stats, 'battingBowlingChart', charts.dashboard.distribution);
}

/**
 * Initialize stats page charts
 * @param {Array} matches - Match history data
 * @param {Object} stats - Player statistics
 */
export function initializeStatsCharts(matches, stats) {
    charts.stats.trend = createPerformanceTrendChart(matches, 'statsPerformanceTrendChart', charts.stats.trend, 20);
    charts.stats.distribution = createBattingBowlingChart(stats, 'statsBattingBowlingChart', charts.stats.distribution);
}

/**
 * Create performance trend chart (line chart showing runs and wickets over time)
 * @param {Array} matches - Match history data
 * @param {string} canvasId - DOM ID of the canvas element
 * @param {Object} existingChart - Existing Chart instance to destroy
 * @param {number} limit - Number of matches to show
 * @returns {Object|null} New Chart instance or null
 */
function createPerformanceTrendChart(matches, canvasId, existingChart, limit = 10) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');

    // Destroy existing chart if it exists
    if (existingChart) {
        existingChart.destroy();
    }

    // Prepare data
    // Matches are assumed to be sorted Newest -> Oldest by service
    const matchesToDisplay = matches.slice(0, limit).reverse();

    if (matchesToDisplay.length === 0) {
        // Show empty state
        ctx.font = '16px Inter';
        ctx.fillStyle = '#6b7280';
        ctx.textAlign = 'center';
        ctx.fillText('No match data available', canvas.width / 2, canvas.height / 2);
        return null;
    }

    const labels = matchesToDisplay.map((match, index) => {
        const date = new Date(match.matchDate);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const runsData = matchesToDisplay.map(match => match.runsScored || 0);
    const wicketsData = matchesToDisplay.map(match => match.wicketsTaken || 0);

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Runs Scored',
                    data: runsData,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#22c55e',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Wickets Taken',
                    data: wicketsData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#e5e7eb',
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#374151',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        title: function (context) {
                            const index = context[0].dataIndex;
                            const match = matchesToDisplay[index];
                            return `vs ${match.opponent}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#9ca3af',
                        font: {
                            family: 'Inter'
                        }
                    },
                    grid: {
                        color: 'rgba(75, 85, 99, 0.3)'
                    }
                },
                x: {
                    ticks: {
                        color: '#9ca3af',
                        font: {
                            family: 'Inter'
                        }
                    },
                    grid: {
                        color: 'rgba(75, 85, 99, 0.3)'
                    }
                }
            }
        }
    });
}

/**
 * Create batting vs bowling comparison chart (doughnut chart)
 * @param {Object} stats - Player statistics
 * @param {string} canvasId - DOM ID of the canvas element
 * @param {Object} existingChart - Existing Chart instance to destroy
 * @returns {Object|null} New Chart instance or null
 */
function createBattingBowlingChart(stats, canvasId, existingChart) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');

    // Destroy existing chart if it exists
    if (existingChart) {
        existingChart.destroy();
    }

    const totalRuns = stats.totalRuns || 0;
    const totalWickets = stats.totalWickets || 0;
    const totalCatches = stats.totalCatches || 0;

    if (totalRuns === 0 && totalWickets === 0 && totalCatches === 0) {
        // Show empty state
        ctx.font = '16px Inter';
        ctx.fillStyle = '#6b7280';
        ctx.textAlign = 'center';
        ctx.fillText('No statistics available', canvas.width / 2, canvas.height / 2);
        return null;
    }

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Runs Scored', 'Wickets Taken', 'Catches'],
            datasets: [{
                data: [totalRuns, totalWickets * 10, totalCatches * 5], // Normalize for better visualization
                backgroundColor: [
                    '#22c55e',
                    '#3b82f6',
                    '#f59e0b'
                ],
                borderColor: '#1f2937',
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#e5e7eb',
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#374151',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            let value = context.parsed;

                            // Show actual values
                            if (label === 'Runs Scored') {
                                return `${label}: ${totalRuns}`;
                            } else if (label === 'Wickets Taken') {
                                return `${label}: ${totalWickets}`;
                            } else if (label === 'Catches') {
                                return `${label}: ${totalCatches}`;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}
/**
 * Destroy all charts (cleanup)
 */
export function destroyCharts() {
    Object.values(charts.dashboard).forEach(chart => {
        if (chart) chart.destroy();
    });
    
    Object.values(charts.stats).forEach(chart => {
        if (chart) chart.destroy();
    });
    
    charts.dashboard.trend = null;
    charts.dashboard.distribution = null;
    charts.stats.trend = null;
    charts.stats.distribution = null;
}
