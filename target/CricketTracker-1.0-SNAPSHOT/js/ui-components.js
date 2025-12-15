/**
 * UI Components Module for Cricket Tracker
 * 
 * Provides reusable UI components including modals, toasts,
 * and notification systems.
 * 
 * @version 1.0.0
 * @date 2025-12-15
 */

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duration in milliseconds
 */
export function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = getToastIcon(type);
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('toast-show'), 10);

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Get icon for toast type
 * @param {string} type - Toast type
 * @returns {string} Icon emoji
 */
function getToastIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

/**
 * Show confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {Function} onConfirm - Callback on confirm
 * @param {Function} onCancel - Callback on cancel (optional)
 */
export function showConfirmDialog(title, message, onConfirm, onCancel = null) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-dialog confirm-dialog">
            <div class="modal-header">
                <h3>${title}</h3>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancel-btn">Cancel</button>
                <button class="btn btn-danger" id="confirm-btn">Confirm</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('modal-show'), 10);

    // Event listeners
    const confirmBtn = modal.querySelector('#confirm-btn');
    const cancelBtn = modal.querySelector('#cancel-btn');

    confirmBtn.addEventListener('click', () => {
        closeModal(modal);
        if (onConfirm) onConfirm();
    });

    cancelBtn.addEventListener('click', () => {
        closeModal(modal);
        if (onCancel) onCancel();
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
            if (onCancel) onCancel();
        }
    });
}

/**
 * Show loading spinner
 * @param {string} message - Loading message
 * @returns {Object} Loading instance with close method
 */
export function showLoading(message = 'Loading...') {
    const loading = document.createElement('div');
    loading.className = 'modal-overlay loading-overlay';
    loading.innerHTML = `
        <div class="loading-dialog">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;

    document.body.appendChild(loading);
    setTimeout(() => loading.classList.add('modal-show'), 10);

    return {
        close: () => closeModal(loading)
    };
}

/**
 * Close modal
 * @param {HTMLElement} modal - Modal element
 */
function closeModal(modal) {
    modal.classList.remove('modal-show');
    setTimeout(() => modal.remove(), 300);
}

/**
 * Show edit match modal
 * @param {Object} matchData - Match data to edit
 * @param {Function} onSave - Callback on save
 * @param {Function} onCancel - Callback on cancel
 */
export function showEditMatchModal(matchData, onSave, onCancel = null) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-dialog edit-match-dialog">
            <div class="modal-header">
                <h3>✏️ Edit Match</h3>
                <button class="close-btn" id="modal-close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <form id="edit-match-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-matchDate">Match Date *</label>
                            <input type="date" id="edit-matchDate" name="matchDate" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-opponent">Opponent *</label>
                            <input type="text" id="edit-opponent" name="opponent" required>
                        </div>
                    </div>
                    
                    <div class="section-title">🏏 Batting Performance</div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-runsScored">Runs Scored</label>
                            <input type="number" id="edit-runsScored" name="runsScored" min="0">
                        </div>
                        <div class="form-group">
                            <label for="edit-ballsFaced">Balls Faced</label>
                            <input type="number" id="edit-ballsFaced" name="ballsFaced" min="0">
                        </div>
                    </div>
                    
                    <div class="section-title">⚾ Bowling Performance</div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-wicketsTaken">Wickets Taken</label>
                            <input type="number" id="edit-wicketsTaken" name="wicketsTaken" min="0" max="10">
                        </div>
                        <div class="form-group">
                            <label for="edit-oversBowled">Overs Bowled</label>
                            <input type="number" id="edit-oversBowled" name="oversBowled" min="0" step="0.1">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-runsConceded">Runs Conceded</label>
                            <input type="number" id="edit-runsConceded" name="runsConceded" min="0">
                        </div>
                        <div class="form-group">
                            <label for="edit-catches">Catches</label>
                            <input type="number" id="edit-catches" name="catches" min="0">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="edit-cancel-btn">Cancel</button>
                <button class="btn btn-primary" id="edit-save-btn">Save Changes</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('modal-show'), 10);

    // Populate form with existing data
    const form = modal.querySelector('#edit-match-form');
    form.elements['matchDate'].value = formatDateForInput(matchData.matchDate);
    form.elements['opponent'].value = matchData.opponent;
    form.elements['runsScored'].value = matchData.runsScored || '';
    form.elements['ballsFaced'].value = matchData.ballsFaced || '';
    form.elements['wicketsTaken'].value = matchData.wicketsTaken || '';
    form.elements['oversBowled'].value = matchData.oversBowled || '';
    form.elements['runsConceded'].value = matchData.runsConceded || '';
    form.elements['catches'].value = matchData.catches || '';

    // Event listeners
    const saveBtn = modal.querySelector('#edit-save-btn');
    const cancelBtn = modal.querySelector('#edit-cancel-btn');
    const closeBtn = modal.querySelector('#modal-close-btn');

    saveBtn.addEventListener('click', () => {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        closeModal(modal);
        if (onSave) onSave(data);
    });

    cancelBtn.addEventListener('click', () => {
        closeModal(modal);
        if (onCancel) onCancel();
    });

    closeBtn.addEventListener('click', () => {
        closeModal(modal);
        if (onCancel) onCancel();
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
            if (onCancel) onCancel();
        }
    });
}

/**
 * Format date for input field (YYYY-MM-DD)
 * @param {Date} date - Date object
 * @returns {string} Formatted date
 */
function formatDateForInput(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Create empty state message
 * @param {string} message - Message to display
 * @param {string} icon - Icon emoji
 * @returns {HTMLElement} Empty state element
 */
export function createEmptyState(message, icon = '📭') {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <div class="empty-state-icon">${icon}</div>
        <p class="empty-state-message">${message}</p>
    `;
    return emptyState;
}
