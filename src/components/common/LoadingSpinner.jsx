import React from 'react'
import { Spin } from 'antd'

const LoadingSpinner = ({ fullScreen = false, size = 'large', tip = 'Loading...' }) => {
    if (fullScreen) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spin size={size} tip={tip} />
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center p-8">
            <Spin size={size} tip={tip} />
        </div>
    )
}

export default LoadingSpinner
