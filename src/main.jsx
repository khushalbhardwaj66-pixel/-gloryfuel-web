import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import App from './App.jsx'
import store from './store'
import './styles/index.css'

// Create React Query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
})

// Ant Design theme configuration
const theme = {
    token: {
        colorPrimary: '#4F46E5',
        colorSuccess: '#10B981',
        colorWarning: '#F59E0B',
        colorError: '#EF4444',
        fontFamily: 'Inter, Roboto, sans-serif',
        borderRadius: 8,
    },
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <ConfigProvider theme={theme}>
                        <App />
                    </ConfigProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>,
)
