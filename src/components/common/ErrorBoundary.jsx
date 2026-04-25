import React, { Component } from 'react'
import { Result, Button } from 'antd'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <Result
                        status="error"
                        title="Something went wrong"
                        subTitle="We're sorry for the inconvenience. Please try refreshing the page."
                        extra={
                            <Button type="primary" onClick={() => window.location.reload()}>
                                Refresh Page
                            </Button>
                        }
                    />
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
