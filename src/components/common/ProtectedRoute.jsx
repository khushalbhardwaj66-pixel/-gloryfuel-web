import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { user, loading, isAuthenticated } = useAuth()
    const location = useLocation()

    if (loading) {
        return <LoadingSpinner fullScreen />
    }

    if (!isAuthenticated) {
        // Dynamic redirect based on the URL the user is trying to access
        const isPathAdmin = location.pathname.startsWith('/admin')
        return <Navigate to={isPathAdmin ? "/admin/login" : "/login"} replace state={{ from: location }} />
    }

    // Check if user has required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // Redirect based on user role
        if (user?.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />
        } else {
            return <Navigate to="/" replace />
        }
    }

    return <Outlet />
}

export default ProtectedRoute
