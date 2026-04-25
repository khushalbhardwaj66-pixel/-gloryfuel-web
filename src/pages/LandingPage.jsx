import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import PageTransition from '../components/common/PageTransition'

const LandingPage = () => {
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleStartLearning = async () => {
        try {
            console.log('Start Learning clicked');
            // Auto-login as a demo user
            const result = await login({
                email: 'student@gloryfuel.com',
                password: 'password'
            })

            console.log('Login result:', result);

            if (result && result.success) {
                console.log('Login success, navigating...');
                navigate('/user/select-institution')
            } else {
                console.error('Login did not return success:', result);
            }
        } catch (error) {
            console.error('Start Learning redirect failed:', error)
        }
    }

    return (
        <PageTransition>
            <div className="relative min-h-screen bg-slate-900 text-white overflow-hidden font-sans">
                {/* Background */}
                <div className="absolute inset-0 z-0 bg-slate-900">
                </div>

                {/* Navigation (Transparent) */}
                <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                    <div className="text-2xl font-bold font-heading tracking-tight">
                        Glory<span className="text-primary-400">Fuel</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        {/* Navigation links removed as requested */}
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Buttons removed as requested */}
                    </div>
                </nav>

                {/* Hero Content */}
                <main className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] text-center px-4">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary-300 text-xs font-medium uppercase tracking-wider mb-4 animate-fadeIn">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            <span>Now Enrolling New Batches</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight tracking-tight">
                            Ignite Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-primary-400 to-cyan-400">
                                Learning Potential
                            </span>
                        </h1>

                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                            Experience a new era of education with our immersive platform.
                            Live classes, interactive notes, and a community dedicated to your success.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
                            <button
                                onClick={handleStartLearning}
                                className="px-8 py-4 rounded-full text-base font-semibold btn-liquid btn-liquid-primary"
                            >
                                Start Learning Now
                            </button>
                            <button className="px-8 py-4 rounded-full text-base font-semibold btn-liquid bg-transparent border-white/30 hover:bg-white/10">
                                View Courses
                            </button>
                        </div>
                    </div>
                </main>

                {/* Footer / Credits */}
                <footer className="relative z-10 py-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} GloryFuel Education. All rights reserved.</p>
                </footer>
            </div>
        </PageTransition>
    )
}

export default LandingPage
