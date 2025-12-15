/**
 * Validation Module for Cricket Tracker
 * 
 * Provides input validation rules and error message generation
 * for all form inputs in the application.
 * 
 * @version 1.0.0
 * @date 2025-12-15
 */

/**
 * Validation rules and error messages
 */
const ValidationRules = {
    matchDate: {
        required: true,
        validate: (value) => {
            if (!value) return 'Match date is required';
            const date = new Date(value);
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            if (date > today) return 'Match date cannot be in the future';
            return null;
        }
    },

    opponent: {
        required: true,
        validate: (value) => {
            if (!value || value.trim().length === 0) return 'Opponent name is required';
            if (value.trim().length < 2) return 'Opponent name must be at least 2 characters';
            if (value.trim().length > 50) return 'Opponent name must be less than 50 characters';
            return null;
        }
    },

    runsScored: {
        required: false,
        validate: (value, formData) => {
            if (value === '' || value === null || value === undefined) return null;
            const runs = Number(value);
            if (isNaN(runs)) return 'Runs must be a number';
            if (runs < 0) return 'Runs cannot be negative';
            if (runs > 500) return 'Runs seems unrealistic (max 500)';
            if (!Number.isInteger(runs)) return 'Runs must be a whole number';

            // If balls faced is provided, runs should not exceed balls
            const balls = formData?.ballsFaced;
            if (balls !== '' && balls !== null && balls !== undefined) {
                const ballsNum = Number(balls);
                if (!isNaN(ballsNum) && runs > ballsNum * 6) {
                    return 'Runs cannot exceed 6 times balls faced';
                }
            }

            return null;
        }
    },

    ballsFaced: {
        required: false,
        validate: (value, formData) => {
            if (value === '' || value === null || value === undefined) return null;
            const balls = Number(value);
            if (isNaN(balls)) return 'Balls faced must be a number';
            if (balls < 0) return 'Balls faced cannot be negative';
            if (balls > 500) return 'Balls faced seems unrealistic (max 500)';
            if (!Number.isInteger(balls)) return 'Balls faced must be a whole number';

            // If runs is provided, balls should be at least runs/6
            const runs = formData?.runsScored;
            if (runs !== '' && runs !== null && runs !== undefined) {
                const runsNum = Number(runs);
                if (!isNaN(runsNum) && balls < Math.ceil(runsNum / 6)) {
                    return 'Balls faced seems too low for runs scored';
                }
            }

            return null;
        }
    },

    wicketsTaken: {
        required: false,
        validate: (value) => {
            if (value === '' || value === null || value === undefined) return null;
            const wickets = Number(value);
            if (isNaN(wickets)) return 'Wickets must be a number';
            if (wickets < 0) return 'Wickets cannot be negative';
            if (wickets > 10) return 'Wickets cannot exceed 10';
            if (!Number.isInteger(wickets)) return 'Wickets must be a whole number';
            return null;
        }
    },

    oversBowled: {
        required: false,
        validate: (value) => {
            if (value === '' || value === null || value === undefined) return null;
            const overs = Number(value);
            if (isNaN(overs)) return 'Overs must be a number';
            if (overs < 0) return 'Overs cannot be negative';
            if (overs > 50) return 'Overs seems unrealistic (max 50)';

            // Check decimal part (should be 0-5 for valid overs)
            const decimalPart = overs % 1;
            const balls = Math.round(decimalPart * 10);
            if (balls > 5) return 'Invalid overs format (decimal part should be 0-5, e.g., 4.5)';

            return null;
        }
    },

    runsConceded: {
        required: false,
        validate: (value) => {
            if (value === '' || value === null || value === undefined) return null;
            const runs = Number(value);
            if (isNaN(runs)) return 'Runs conceded must be a number';
            if (runs < 0) return 'Runs conceded cannot be negative';
            if (runs > 500) return 'Runs conceded seems unrealistic (max 500)';
            if (!Number.isInteger(runs)) return 'Runs conceded must be a whole number';
            return null;
        }
    },

    catches: {
        required: false,
        validate: (value) => {
            if (value === '' || value === null || value === undefined) return null;
            const catches = Number(value);
            if (isNaN(catches)) return 'Catches must be a number';
            if (catches < 0) return 'Catches cannot be negative';
            if (catches > 10) return 'Catches seems unrealistic (max 10)';
            if (!Number.isInteger(catches)) return 'Catches must be a whole number';
            return null;
        }
    }
};

/**
 * Validate a single field
 * @param {string} fieldName - Name of the field to validate
 * @param {any} value - Value to validate
 * @param {Object} formData - Complete form data for cross-field validation
 * @returns {string|null} Error message or null if valid
 */
export function validateField(fieldName, value, formData = {}) {
    const rule = ValidationRules[fieldName];
    if (!rule) return null;

    return rule.validate(value, formData);
}

/**
 * Validate entire form
 * @param {Object} formData - Form data object
 * @returns {Object} Object with field names as keys and error messages as values
 */
export function validateForm(formData) {
    const errors = {};

    for (const [fieldName, value] of Object.entries(formData)) {
        const error = validateField(fieldName, value, formData);
        if (error) {
            errors[fieldName] = error;
        }
    }

    return errors;
}

/**
 * Check if form data is valid
 * @param {Object} formData - Form data object
 * @returns {boolean} True if valid, false otherwise
 */
export function isFormValid(formData) {
    const errors = validateForm(formData);
    return Object.keys(errors).length === 0;
}

/**
 * Sanitize and normalize form data
 * @param {Object} formData - Raw form data
 * @returns {Object} Sanitized form data
 */
export function sanitizeFormData(formData) {
    const sanitized = {};

    // Trim strings
    if (formData.opponent) {
        sanitized.opponent = formData.opponent.trim();
    }

    // Convert numbers
    const numericFields = ['runsScored', 'ballsFaced', 'wicketsTaken', 'oversBowled', 'runsConceded', 'catches'];
    numericFields.forEach(field => {
        if (formData[field] !== '' && formData[field] !== null && formData[field] !== undefined) {
            sanitized[field] = Number(formData[field]);
        } else {
            sanitized[field] = 0; // Default to 0 for numeric fields
        }
    });

    // Keep date as is
    sanitized.matchDate = formData.matchDate;

    return sanitized;
}

/**
 * Display validation errors on form
 * @param {Object} errors - Errors object from validateForm
 */
export function displayValidationErrors(errors) {
    // Clear all previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    // Display new errors
    for (const [fieldName, errorMessage] of Object.entries(errors)) {
        const input = document.getElementById(fieldName);
        if (input) {
            input.classList.add('input-error');

            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;

            input.parentNode.appendChild(errorDiv);
        }
    }
}

/**
 * Clear validation errors
 */
export function clearValidationErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}
