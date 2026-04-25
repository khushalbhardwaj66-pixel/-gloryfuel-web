import React, { useState } from 'react'
import { Layout } from 'antd'
import Header from './Header'
import Sidebar from './Sidebar'
import PageTransition from './PageTransition'

const { Content } = Layout

const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <Layout className="min-h-screen bg-transparent">
            <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
            <Layout className="bg-transparent">
                <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
                <Content className="m-4 md:m-8 p-4 md:p-8 bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </Content>
            </Layout>
        </Layout>
    )
}

export default AdminLayout
