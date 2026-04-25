import axios from 'axios'
import { API_BASE_URL, STORAGE_KEYS } from '@constants'

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Handle 401 - Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            // Try to refresh token
            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                        refreshToken,
                    })

                    const { token } = response.data
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
                    originalRequest.headers.Authorization = `Bearer ${token}`

                    return axiosInstance(originalRequest)
                } catch (refreshError) {
                    // Refresh failed, logout user
                    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
                    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
                    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
                    window.location.href = '/login'
                    return Promise.reject(refreshError)
                }
            } else {
                // No refresh token, logout
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance
