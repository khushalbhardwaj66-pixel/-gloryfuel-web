import axiosInstance from '@utils/axios'

const authService = {
    // Login
    async login(credentials) {
        const response = await axiosInstance.post('/auth/login', credentials)
        return response.data
    },

    // Register
    async register(userData) {
        const response = await axiosInstance.post('/auth/register', userData)
        return response.data
    },

    // Logout
    async logout() {
        const response = await axiosInstance.post('/auth/logout')
        return response.data
    },

    // Refresh token
    async refreshToken(refreshToken) {
        const response = await axiosInstance.post('/auth/refresh-token', { refreshToken })
        return response.data
    },

    // Get current user
    async getCurrentUser() {
        const response = await axiosInstance.get('/auth/me')
        return response.data
    },
}

export default authService
