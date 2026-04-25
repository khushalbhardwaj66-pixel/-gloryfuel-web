import React from 'react'
import { Layout } from 'antd'
import Header from './Header'
import PageTransition from './PageTransition'

const { Content } = Layout

const UserLayout = ({ children }) => {
    return (
        <Layout className="min-h-screen bg-transparent">
            <Header collapsed={false} onToggle={null} />
            <Content className="m-4 md:m-8 p-4 md:p-8 bg-gray-900/40 backdrop-blur-md rounded-3xl border border-white/5 max-w-7xl mx-auto w-full shadow-2xl overflow-hidden">
                <PageTransition>
                    {children}
                </PageTransition>
            </Content>
        </Layout>
    )
}

export default UserLayout
