// API Base URL
export const API_BASE_URL = import.meta.env.PROD
    ? '/gloryfuel-api'
    : 'http://localhost/gloryfuel-api'

// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    STUDENT: 'student',
}
// Storage Keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
}
