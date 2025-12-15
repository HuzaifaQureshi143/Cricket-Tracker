/**
 * Firestore Service - Helper functions for Cricket Tracker
 * 
 * Provides reusable CRUD operations and real-time listeners for Firestore.
 * All functions include error handling and logging.
 * 
 * @version 1.0.0
 * @date 2025-12-15
 */

import { db } from './firebase-config.js';
import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

/**
 * Add a new document to a collection with auto-generated ID
 * @param {string} collectionName - Name of the collection
 * @param {Object} data - Document data
 * @returns {Promise<string>} Document ID
 */
export async function addDocument(collectionName, data) {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        console.log(`✅ Document added to ${collectionName} with ID:`, docRef.id);
        return docRef.id;
    } catch (error) {
        console.error(`❌ Error adding document to ${collectionName}:`, error);
        throw error;
    }
}

/**
 * Set a document with a specific ID (creates or overwrites)
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {Object} data - Document data
 * @returns {Promise<void>}
 */
export async function setDocument(collectionName, docId, data) {
    try {
        await setDoc(doc(db, collectionName, docId), {
            ...data,
            updatedAt: serverTimestamp()
        });
        console.log(`✅ Document set in ${collectionName} with ID:`, docId);
    } catch (error) {
        console.error(`❌ Error setting document in ${collectionName}:`, error);
        throw error;
    }
}

/**
 * Get a single document by ID
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<Object|null>} Document data or null if not found
 */
export async function getDocument(collectionName, docId) {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log(`✅ Document retrieved from ${collectionName}:`, docId);
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log(`⚠️ Document not found in ${collectionName}:`, docId);
            return null;
        }
    } catch (error) {
        console.error(`❌ Error getting document from ${collectionName}:`, error);
        throw error;
    }
}

/**
 * Get all documents from a collection
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Array>} Array of documents
 */
export async function getAllDocuments(collectionName) {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const documents = [];

        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });

        console.log(`✅ Retrieved ${documents.length} documents from ${collectionName}`);
        return documents;
    } catch (error) {
        console.error(`❌ Error getting documents from ${collectionName}:`, error);
        throw error;
    }
}

/**
 * Query documents with filters
 * @param {string} collectionName - Name of the collection
 * @param {Array} filters - Array of filter objects [{field, operator, value}]
 * @param {string} orderByField - Field to order by (optional)
 * @param {number} limitCount - Maximum number of documents (optional)
 * @returns {Promise<Array>} Array of matching documents
 */
export async function queryDocuments(collectionName, filters = [], orderByField = null, limitCount = null) {
    try {
        let q = collection(db, collectionName);

        // Apply filters
        const constraints = [];
        filters.forEach(filter => {
            constraints.push(where(filter.field, filter.operator, filter.value));
        });

        // Apply ordering
        if (orderByField) {
            constraints.push(orderBy(orderByField));
        }

        // Apply limit
        if (limitCount) {
            constraints.push(limit(limitCount));
        }

        if (constraints.length > 0) {
            q = query(q, ...constraints);
        }

        const querySnapshot = await getDocs(q);
        const documents = [];

        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });

        console.log(`✅ Query returned ${documents.length} documents from ${collectionName}`);
        return documents;
    } catch (error) {
        console.error(`❌ Error querying documents from ${collectionName}:`, error);
        throw error;
    }
}

/**
 * Update a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {Object} data - Fields to update
 * @returns {Promise<void>}
 */
export async function updateDocument(collectionName, docId, data) {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        console.log(`✅ Document updated in ${collectionName}:`, docId);
    } catch (error) {
        console.error(`❌ Error updating document in ${collectionName}:`, error);
        throw error;
    }
}

/**
 * Delete a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<void>}
 */
export async function deleteDocument(collectionName, docId) {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        console.log(`✅ Document deleted from ${collectionName}:`, docId);
    } catch (error) {
        console.error(`❌ Error deleting document from ${collectionName}:`, error);
        throw error;
    }
}

/**
 * Listen to real-time updates on a collection
 * @param {string} collectionName - Name of the collection
 * @param {Function} callback - Function to call when data changes
 * @param {Array} filters - Optional filters
 * @returns {Function} Unsubscribe function
 */
export function listenToCollection(collectionName, callback, filters = []) {
    try {
        let q = collection(db, collectionName);

        if (filters.length > 0) {
            const constraints = filters.map(filter =>
                where(filter.field, filter.operator, filter.value)
            );
            q = query(q, ...constraints);
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const documents = [];
            snapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            console.log(`🔄 Real-time update: ${documents.length} documents in ${collectionName}`);
            callback(documents);
        }, (error) => {
            console.error(`❌ Error in real-time listener for ${collectionName}:`, error);
        });

        console.log(`✅ Real-time listener attached to ${collectionName}`);
        return unsubscribe;
    } catch (error) {
        console.error(`❌ Error setting up listener for ${collectionName}:`, error);
        throw error;
    }
}

/**
 * Listen to real-time updates on a single document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {Function} callback - Function to call when data changes
 * @returns {Function} Unsubscribe function
 */
export function listenToDocument(collectionName, docId, callback) {
    try {
        const docRef = doc(db, collectionName, docId);

        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                const data = { id: doc.id, ...doc.data() };
                console.log(`🔄 Real-time update for document ${docId} in ${collectionName}`);
                callback(data);
            } else {
                console.log(`⚠️ Document ${docId} no longer exists in ${collectionName}`);
                callback(null);
            }
        }, (error) => {
            console.error(`❌ Error in real-time listener for document ${docId}:`, error);
        });

        console.log(`✅ Real-time listener attached to document ${docId} in ${collectionName}`);
        return unsubscribe;
    } catch (error) {
        console.error(`❌ Error setting up listener for document ${docId}:`, error);
        throw error;
    }
}
