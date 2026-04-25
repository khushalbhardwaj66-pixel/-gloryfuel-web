import { createSlice } from '@reduxjs/toolkit'
import { STORAGE_KEYS } from '@constants'

// Initial state
const initialState = {
    user: null,
    token: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null,
    isAuthenticated: false,
    loading: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true
        },
        loginSuccess: (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload.user
            state.token = action.payload.token
        },
        loginFailure: (state) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.token = null
        },
        logoutSuccess: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            state.loading = false
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
            localStorage.removeItem(STORAGE_KEYS.USER_DATA)
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload }
        },
    },
})

export const { loginStart, loginSuccess, loginFailure, logoutSuccess, updateUser } = authSlice.actions
export default authSlice.reducer
