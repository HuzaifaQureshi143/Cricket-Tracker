/**
 * Match Service for Cricket Tracker
 * 
 * Handles all match-related operations including CRUD, statistics calculation,
 * duplicate detection, and aggregated stats management.
 * 
 * @version 1.0.0
 * @date 2025-12-15
 */

import { db } from './firebase-config.js';
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    setDoc,
    serverTimestamp,
    Timestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const USER_ID = 'local-player'; // Fixed user ID for single-user version
const MATCHES_COLLECTION = 'matches';
const STATS_COLLECTION = 'playerStats';

/**
 * Add a new match
 * @param {Object} matchData - Match data
 * @returns {Promise<string>} Match ID
 */
export async function addMatch(matchData) {
    try {
        // Check for duplicates
        const duplicate = await checkDuplicate(matchData.matchDate, matchData.opponent);
        if (duplicate) {
            throw new Error(`A match against ${matchData.opponent} on this date already exists`);
        }

        // Prepare match document
        const matchDoc = {
            userId: USER_ID,
            matchDate: Timestamp.fromDate(new Date(matchData.matchDate)),
            opponent: matchData.opponent,
            runsScored: matchData.runsScored || 0,
            ballsFaced: matchData.ballsFaced || 0,
            wicketsTaken: matchData.wicketsTaken || 0,
            oversBowled: matchData.oversBowled || 0,
            runsConceded: matchData.runsConceded || 0,
            catches: matchData.catches || 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        // Add to Firestore
        const docRef = await addDoc(collection(db, MATCHES_COLLECTION), matchDoc);
        console.log('✅ Match added with ID:', docRef.id);

        // Update aggregated statistics
        await updatePlayerStats();

        return docRef.id;
    } catch (error) {
        console.error('❌ Error adding match:', error);
        throw error;
    }
}

/**
 * Get all matches for the user
 * @returns {Promise<Array>} Array of matches
 */
export async function getAllMatches() {
    try {
        // Simple query without orderBy to avoid index requirement
        const q = query(
            collection(db, MATCHES_COLLECTION),
            where('userId', '==', USER_ID)
        );

        const querySnapshot = await getDocs(q);
        const matches = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            matches.push({
                id: doc.id,
                ...data,
                matchDate: data.matchDate.toDate() // Convert Timestamp to Date
            });
        });

        // Sort by date in memory (newest first)
        matches.sort((a, b) => b.matchDate - a.matchDate);

        console.log(`✅ Retrieved ${matches.length} matches`);
        return matches;
    } catch (error) {
        console.error('❌ Error getting matches:', error);
        throw error;
    }
}

/**
 * Get a single match by ID
 * @param {string} matchId - Match ID
 * @returns {Promise<Object|null>} Match data or null
 */
export async function getMatch(matchId) {
    try {
        const docRef = doc(db, MATCHES_COLLECTION, matchId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                matchDate: data.matchDate.toDate()
            };
        }
        return null;
    } catch (error) {
        console.error('❌ Error getting match:', error);
        throw error;
    }
}

/**
 * Update a match
 * @param {string} matchId - Match ID
 * @param {Object} matchData - Updated match data
 * @returns {Promise<void>}
 */
export async function updateMatch(matchId, matchData) {
    try {
        const docRef = doc(db, MATCHES_COLLECTION, matchId);

        // Get existing match to check if date/opponent changed
        const existingMatch = await getMatch(matchId);
        if (!existingMatch) {
            throw new Error('Match not found');
        }

        // Check for duplicates if date or opponent changed
        const dateChanged = new Date(matchData.matchDate).getTime() !== existingMatch.matchDate.getTime();
        const opponentChanged = matchData.opponent !== existingMatch.opponent;

        if (dateChanged || opponentChanged) {
            const duplicate = await checkDuplicate(matchData.matchDate, matchData.opponent, matchId);
            if (duplicate) {
                throw new Error(`A match against ${matchData.opponent} on this date already exists`);
            }
        }

        // Update document
        const updateData = {
            matchDate: Timestamp.fromDate(new Date(matchData.matchDate)),
            opponent: matchData.opponent,
            runsScored: matchData.runsScored || 0,
            ballsFaced: matchData.ballsFaced || 0,
            wicketsTaken: matchData.wicketsTaken || 0,
            oversBowled: matchData.oversBowled || 0,
            runsConceded: matchData.runsConceded || 0,
            catches: matchData.catches || 0,
            updatedAt: serverTimestamp()
        };

        await updateDoc(docRef, updateData);
        console.log('✅ Match updated:', matchId);

        // Recalculate statistics
        await updatePlayerStats();
    } catch (error) {
        console.error('❌ Error updating match:', error);
        throw error;
    }
}

/**
 * Delete a match
 * @param {string} matchId - Match ID
 * @returns {Promise<void>}
 */
export async function deleteMatch(matchId) {
    try {
        await deleteDoc(doc(db, MATCHES_COLLECTION, matchId));
        console.log('✅ Match deleted:', matchId);

        // Recalculate statistics
        await updatePlayerStats();
    } catch (error) {
        console.error('❌ Error deleting match:', error);
        throw error;
    }
}

/**
 * Check for duplicate match (same date and opponent)
 * @param {string} matchDate - Match date
 * @param {string} opponent - Opponent name
 * @param {string} excludeId - Match ID to exclude from check (for updates)
 * @returns {Promise<boolean>} True if duplicate exists
 */
async function checkDuplicate(matchDate, opponent, excludeId = null) {
    try {
        // Get all matches for the user (simpler query, no index needed)
        const q = query(
            collection(db, MATCHES_COLLECTION),
            where('userId', '==', USER_ID)
        );

        const querySnapshot = await getDocs(q);

        // Normalize the input date for comparison
        const inputDate = new Date(matchDate);
        inputDate.setHours(0, 0, 0, 0);
        const inputDateStr = inputDate.toDateString();

        // Check for duplicates in memory
        for (const docSnap of querySnapshot.docs) {
            // Skip if this is the match we're updating
            if (excludeId && docSnap.id === excludeId) {
                continue;
            }

            const data = docSnap.data();

            // Compare opponent (case-insensitive)
            if (data.opponent.toLowerCase() !== opponent.toLowerCase()) {
                continue;
            }

            // Compare dates (same day)
            const matchDate = data.matchDate.toDate();
            matchDate.setHours(0, 0, 0, 0);
            const matchDateStr = matchDate.toDateString();

            if (inputDateStr === matchDateStr) {
                return true; // Duplicate found
            }
        }

        return false; // No duplicate
    } catch (error) {
        console.error('❌ Error checking duplicate:', error);
        return false;
    }
}

/**
 * Calculate and update player statistics
 * @returns {Promise<void>}
 */
export async function updatePlayerStats() {
    try {
        // Get all matches
        const matches = await getAllMatches();

        if (matches.length === 0) {
            // No matches, set stats to zero
            const statsDoc = {
                userId: USER_ID,
                totalMatches: 0,
                totalRuns: 0,
                totalBallsFaced: 0,
                totalWickets: 0,
                totalOversBowled: 0,
                totalRunsConceded: 0,
                totalCatches: 0,
                battingAverage: 0,
                strikeRate: 0,
                bowlingAverage: 0,
                economyRate: 0,
                updatedAt: serverTimestamp()
            };

            await setDoc(doc(db, STATS_COLLECTION, USER_ID), statsDoc);
            return;
        }

        // Calculate totals
        let totalRuns = 0;
        let totalBallsFaced = 0;
        let totalWickets = 0;
        let totalOversBowled = 0;
        let totalRunsConceded = 0;
        let totalCatches = 0;
        let matchesWithRuns = 0;

        matches.forEach(match => {
            totalRuns += match.runsScored || 0;
            totalBallsFaced += match.ballsFaced || 0;
            totalWickets += match.wicketsTaken || 0;
            totalOversBowled += match.oversBowled || 0;
            totalRunsConceded += match.runsConceded || 0;
            totalCatches += match.catches || 0;

            if (match.runsScored > 0) {
                matchesWithRuns++;
            }
        });

        // Calculate averages and rates
        const battingAverage = matchesWithRuns > 0 ? totalRuns / matchesWithRuns : 0;
        const strikeRate = totalBallsFaced > 0 ? (totalRuns / totalBallsFaced) * 100 : 0;
        const bowlingAverage = totalWickets > 0 ? totalRunsConceded / totalWickets : 0;
        const economyRate = totalOversBowled > 0 ? totalRunsConceded / totalOversBowled : 0;

        // Update stats document
        const statsDoc = {
            userId: USER_ID,
            totalMatches: matches.length,
            totalRuns,
            totalBallsFaced,
            totalWickets,
            totalOversBowled,
            totalRunsConceded,
            totalCatches,
            battingAverage: parseFloat(battingAverage.toFixed(2)),
            strikeRate: parseFloat(strikeRate.toFixed(2)),
            bowlingAverage: parseFloat(bowlingAverage.toFixed(2)),
            economyRate: parseFloat(economyRate.toFixed(2)),
            updatedAt: serverTimestamp()
        };

        await setDoc(doc(db, STATS_COLLECTION, USER_ID), statsDoc);
        console.log('✅ Player stats updated');
    } catch (error) {
        console.error('❌ Error updating player stats:', error);
        throw error;
    }
}

/**
 * Get player statistics
 * @returns {Promise<Object>} Player statistics
 */
export async function getPlayerStats() {
    try {
        const docRef = doc(db, STATS_COLLECTION, USER_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }

        // If no stats exist, create default
        await updatePlayerStats();
        const newDocSnap = await getDoc(docRef);
        return newDocSnap.data();
    } catch (error) {
        console.error('❌ Error getting player stats:', error);
        throw error;
    }
}

/**
 * Get recent matches (last N matches)
 * @param {number} limit - Number of matches to retrieve
 * @returns {Promise<Array>} Array of recent matches
 */
export async function getRecentMatches(limit = 5) {
    try {
        const matches = await getAllMatches();
        return matches.slice(0, limit);
    } catch (error) {
        console.error('❌ Error getting recent matches:', error);
        throw error;
    }
}

/**
 * Format date for display
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Format date for input field
 * @param {Date} date - Date object
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export function formatDateForInput(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
