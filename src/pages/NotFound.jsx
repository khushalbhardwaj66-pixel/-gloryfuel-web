import React from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import Aurora from '@/Aurora'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
            {/* Dark Aurora Background */}
            <div className="absolute inset-0 w-full h-full opacity-40">
                <Aurora
                    colorStops={['#1e293b', '#4F46E5', '#0f172a']}
                    blend={0.6}
                    amplitude={1.2}
                    speed={0.4}
                />
            </div>

            <div className="relative z-10 p-8 backdrop-blur-xl bg-black/20 border border-white/10 rounded-3xl shadow-2xl animate-fadeIn">
                <Result
                    status="404"
                    title={<span className="text-6xl font-black text-white tracking-tighter">404</span>}
                    subTitle={<span className="text-gray-400 text-lg">Oops! The page you're looking for has vanished into space.</span>}
                    extra={
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => navigate('/')}
                            className="h-12 px-8 bg-indigo-600 border-0 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-indigo-600/30"
                        >
                            Back to Home
                        </Button>
                    }
                />
            </div>

            <style jsx>{`
                .animate-fadeIn {
                    animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    )
}

export default NotFound
