import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PageTransition = ({ children }) => {
    const [isTransitioning, setIsTransitioning] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="w-full h-full relative">
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/60 backdrop-blur-md"
                    >
                        <div className="relative">
                            {/* Outer rotating ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 border-t-2 border-r-2 border-indigo-500 rounded-full"
                            />
                            {/* Inner rotating ring (opposite direction) */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 m-auto w-12 h-12 border-b-2 border-l-2 border-emerald-400 rounded-full"
                            />
                            {/* Core glow */}
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute inset-0 m-auto w-4 h-4 bg-cyan-400 rounded-full blur-[4px]"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </div>
    )
}

export default PageTransition
