import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { loginSuccess, logoutSuccess } from '@/store/slices/authSlice'
import { USER_ROLES, STORAGE_KEYS, API_BASE_URL } from '@constants'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const isAuthenticated = !!user

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
                const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)

                if (token && userData) {
                    const parsedUser = JSON.parse(userData)
                    setUser(parsedUser)
                    dispatch(loginSuccess({ user: parsedUser, token }))
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
            } finally {
                setLoading(false)
            }
        }

        initAuth()
    }, [dispatch])

    const login = async (credentials) => {
        try {
            setLoading(true)
            console.log('--- Login Attempt ---')
            console.log('Email:', credentials.email)
            console.log('API URL:', `${API_BASE_URL}/auth/login.php`)

            // Real API call
            const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            })

            // Get raw text first to check for PHP errors/spaces
            const responseText = await response.text()
            console.log('Raw API Response Text:', responseText)

            let data
            try {
                data = JSON.parse(responseText)
            } catch (e) {
                console.error('Failed to parse JSON. Raw response was:', responseText)
                throw new Error('Server returned invalid data format. Check console for details.')
            }

            console.log('Login API Response Object:', data)

            if (!response.ok) {
                throw new Error(data.message || 'Login failed')
            }

            const { token, user: apiUser } = data
            console.log('Authenticated Role:', apiUser.role)

            // Store auth data
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(apiUser))

            setUser(apiUser)
            dispatch(loginSuccess({ user: apiUser, token }))

            // Navigate based on role (Case-insensitive check)
            const userRole = (apiUser.role || '').toLowerCase().trim();

            if (userRole === 'admin') {
                console.log('Redirecting to Admin Dashboard')
                navigate('/admin/dashboard')
            } else {
                console.log('Redirecting to User Batches')
                navigate('/user/my-batches')
            }

            toast.success('Login successful!')
            return { success: true, user: apiUser }
        } catch (error) {
            console.error('Login Process Error:', error)
            toast.error(error.message || 'Login failed')
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }

    const register = async (userData) => {
        try {
            // TODO: Replace with actual API call
            // const response = await authService.register(userData)

            // Mock registration
            toast.success('Registration successful! Please login.')
            navigate('/admin/login')
            return { success: true }
        } catch (error) {
            toast.error(error.message || 'Registration failed')
            return { success: false, error: error.message }
        }
    }

    const logout = () => {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER_DATA)

        setUser(null)
        dispatch(logoutSuccess())
        navigate('/admin/login')
        toast.info('Logged out successfully')
    }

    const updateUser = (newData) => {
        const updatedUser = { ...user, ...newData }
        setUser(updatedUser)
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser))
    }

    const isAdmin = user?.role?.toLowerCase() === 'admin'

    const value = {
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

