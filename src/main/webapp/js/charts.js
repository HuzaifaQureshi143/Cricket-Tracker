/**
 * Charts Module for Cricket Tracker
 * 
 * Creates and manages Chart.js visualizations for cricket statistics
 * 
 * @version 1.0.0
 * @date 2025-12-15
 */

// Chart instances
let performanceTrendChart = null;
let battingBowlingChart = null;

/**
 * Initialize all charts
 * @param {Array} matches - Match history data
 * @param {Object} stats - Player statistics
 */
export function initializeCharts(matches, stats) {
    createPerformanceTrendChart(matches);
    createBattingBowlingChart(stats);
}

/**
 * Create performance trend chart (line chart showing runs and wickets over time)
 * @param {Array} matches - Match history data
 */
function createPerformanceTrendChart(matches) {
    const canvas = document.getElementById('performanceTrendChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Destroy existing chart if it exists
    if (performanceTrendChart) {
        performanceTrendChart.destroy();
    }

    // Prepare data (last 10 matches)
    const recentMatches = matches.slice(0, 10).reverse();

    if (recentMatches.length === 0) {
        // Show empty state
        ctx.font = '16px Inter';
        ctx.fillStyle = '#6b7280';
        ctx.textAlign = 'center';
        ctx.fillText('No match data available', canvas.width / 2, canvas.height / 2);
        return;
    }

    const labels = recentMatches.map((match, index) => {
        const date = new Date(match.matchDate);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const runsData = recentMatches.map(match => match.runsScored || 0);
    const wicketsData = recentMatches.map(match => match.wicketsTaken || 0);

    performanceTrendChart = new Chart(ctx, {
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
                            const match = recentMatches[index];
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
 */
function createBattingBowlingChart(stats) {
    const canvas = document.getElementById('battingBowlingChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Destroy existing chart if it exists
    if (battingBowlingChart) {
        battingBowlingChart.destroy();
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
        return;
    }

    battingBowlingChart = new Chart(ctx, {
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
 * Update charts with new data
 * @param {Array} matches - Match history data
 * @param {Object} stats - Player statistics
 */
export function updateCharts(matches, stats) {
    createPerformanceTrendChart(matches);
    createBattingBowlingChart(stats);
}

/**
 * Destroy all charts (cleanup)
 */
export function destroyCharts() {
    if (performanceTrendChart) {
        performanceTrendChart.destroy();
        performanceTrendChart = null;
    }
    if (battingBowlingChart) {
        battingBowlingChart.destroy();
        battingBowlingChart = null;
    }
}
