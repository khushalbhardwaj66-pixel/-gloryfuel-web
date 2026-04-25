import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import ProtectedRoute from './components/common/ProtectedRoute'

// Auth Pages
import AdminLogin from './pages/admin/Auth/Login'
import UserLogin from './pages/user/Auth/Login'
import LandingPage from './pages/LandingPage'
import NotFound from './pages/NotFound'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import BatchList from './pages/admin/Batches/BatchList'
import BatchDashboard from './pages/admin/Batches/BatchDashboard'
import BatchForm from './pages/admin/Batches/BatchForm'
import ClassList from './pages/admin/LiveClasses/ClassList'
import ClassForm from './pages/admin/LiveClasses/ClassForm'
import NotesList from './pages/admin/Notes/NotesList'
import NotesUpload from './pages/admin/Notes/NotesUpload'
import TimetableEditor from './pages/admin/Timetable/TimetableEditor'
import UserList from './pages/admin/Users/UserList'
import SubjectList from './pages/admin/Subjects/SubjectList'
import VideoList from './pages/admin/Videos/VideoList'
import AdminProfile from './pages/admin/Profile'
import AdminOverview from './pages/admin/Overview'

// User Pages
import UserDashboard from './pages/user/Dashboard'
import MyBatches from './pages/user/MyBatches'
import LiveClasses from './pages/user/LiveClasses'
import Notes from './pages/user/Notes'
import Videos from './pages/user/Videos'
import Subjects from './pages/user/Subjects'
import SubjectHub from './pages/user/SubjectHub'
import Timetable from './pages/user/Timetable'
import StudentProfile from './pages/user/Profile'
import InstitutionSelect from './pages/user/InstitutionSelect'
import NextToppersDashboard from './pages/user/NextToppersDashboard'
import NextToppersAdminDashboard from './pages/admin/NextToppersAdminDashboard'

function App() {
    const location = useLocation()

    return (
        <ErrorBoundary>
            <AuthProvider>
                {/* Persistent Global Background */}
                <div className="fixed inset-0 pointer-events-none z-0 bg-[#050505]">
                </div>

                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            {/* Admin Routes */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>

                                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                                <Route path="dashboard" element={<AdminDashboard />} />
                                <Route path="batches" element={<BatchDashboard />} />
                                <Route path="batches/list" element={<BatchList />} />
                                <Route path="batches/create" element={<BatchForm />} />
                                <Route path="batches/:id/edit" element={<BatchForm />} />
                                <Route path="live-classes" element={<ClassList />} />
                                <Route path="live-classes/create" element={<ClassForm />} />
                                <Route path="live-classes/:id/edit" element={<ClassForm />} />
                                <Route path="notes" element={<NotesList />} />
                                <Route path="notes/upload" element={<NotesUpload />} />
                                <Route path="timetable" element={<TimetableEditor />} />
                                <Route path="subjects" element={<SubjectList />} />
                                <Route path="videos" element={<VideoList />} />
                                <Route path="users" element={<UserList />} />
                                <Route path="profile" element={<AdminProfile />} />
                                <Route path="overview" element={<AdminOverview />} />
                            </Route>

                            {/* Public Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<UserLogin />} />

                            {/* User Routes */}
                            <Route path="/user" element={<ProtectedRoute allowedRoles={['user', 'student']} />}>
                                <Route index element={<Navigate to="/user/select-institution" replace />} />
                                <Route path="dashboard" element={<UserDashboard />} />
                                <Route path="select-institution" element={<InstitutionSelect />} />
                                <Route path="my-batches" element={<MyBatches />} />
                                <Route path="subjects" element={<Subjects />} />
                                <Route path="subjects/:id" element={<SubjectHub />} />
                                <Route path="videos" element={<Videos />} />
                                <Route path="live-classes" element={<LiveClasses />} />
                                <Route path="notes" element={<Notes />} />
                                <Route path="timetable" element={<Timetable />} />
                                <Route path="profile" element={<StudentProfile />} />
                            </Route>

                            {/* NextToppers Routes */}
                            <Route path="/nexttoppers" element={<ProtectedRoute allowedRoles={['user', 'student', 'admin']} />}>
                                <Route index element={<Navigate to="/nexttoppers/dashboard" replace />} />
                                <Route path="dashboard" element={<NextToppersDashboard />} />
                                <Route path="admin" element={<NextToppersAdminDashboard />} />
                            </Route>

                            {/* 404 Not Found */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </AnimatePresence>
                </div>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </AuthProvider>
        </ErrorBoundary>
    )
}

export default App
