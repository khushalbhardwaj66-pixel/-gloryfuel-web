/**
 * External API Service
 * Handles all requests to the external content API
 * API Key and Base URL are stored safely in the .env file
 */

import axios from 'axios'

// These values are read from your .env file - never hardcoded!
const EXTERNAL_API_URL = import.meta.env.VITE_EXTERNAL_API_URL
const EXTERNAL_API_KEY = import.meta.env.VITE_EXTERNAL_API_KEY

// Create a dedicated axios instance for the external API
const externalApi = axios.create({
    baseURL: EXTERNAL_API_URL,
    headers: {
        'Content-Type': 'application/json',
        // The API key is sent in the Authorization header
        'Authorization': `Bearer ${EXTERNAL_API_KEY}`,
        // Some APIs also accept the key as a custom header like this:
        'X-API-Key': EXTERNAL_API_KEY,
    }
})

// ─────────────────────────────────────────
// API FUNCTIONS — call these in your pages
// ─────────────────────────────────────────

/**
 * Fetch all contents/batches from the external API
 * Usage: const data = await getContents()
 */
export const getContents = async () => {
    try {
        const response = await externalApi.get('/', {
            params: {
                action: 'get_contents'
            }
        })
        return response.data
    } catch (error) {
        console.error('Failed to fetch contents:', error.message)
        throw error
    }
}

/**
 * Fetch all batches from the external API
 * Usage: const batches = await getBatches()
 */
export const getBatches = async () => {
    try {
        const response = await externalApi.get('/', {
            params: {
                action: 'get_batches'  // change action name if different
            }
        })
        return response.data
    } catch (error) {
        console.error('Failed to fetch batches:', error.message)
        throw error
    }
}

/**
 * Generic function — pass any action name you want
 * Usage: const data = await callAction('get_users')
 */
export const callAction = async (actionName, extraParams = {}) => {
    try {
        const response = await externalApi.get('/', {
            params: {
                action: actionName,
                ...extraParams
            }
        })
        return response.data
    } catch (error) {
        console.error(`Failed to call action "${actionName}":`, error.message)
        throw error
    }
}

export default externalApi
