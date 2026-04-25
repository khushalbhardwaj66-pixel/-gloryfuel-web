import React from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    DashboardOutlined,
    TeamOutlined,
    VideoCameraOutlined,
    FileTextOutlined,
    CalendarOutlined,
    UserOutlined,
    BookOutlined,
    PlayCircleOutlined,
    ProjectOutlined,
    AppstoreOutlined
} from '@ant-design/icons'
import { useAuth } from '@/context/AuthContext'

const { Sider } = Layout

const Sidebar = ({ collapsed, onCollapse }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAdmin } = useAuth()

    // Admin menu items
    const adminMenuItems = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/admin/overview',
            icon: <AppstoreOutlined />,
            label: 'Overview',
        },
        {
            key: '/admin/batches',
            icon: <TeamOutlined />,
            label: 'Batches',
        },
        {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: 'Users',
        },
        {
            key: '/admin/profile',
            icon: <UserOutlined />,
            label: 'Profile',
        },
    ]

    // User menu items
    const userMenuItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/user/my-batches',
            icon: <ProjectOutlined />,
            label: 'My Batches',
        },
        {
            key: '/user/subjects',
            icon: <BookOutlined />,
            label: 'Subjects',
        },
        {
            key: '/user/videos',
            icon: <PlayCircleOutlined />,
            label: 'Videos',
        },
        {
            key: '/user/live-classes',
            icon: <VideoCameraOutlined />,
            label: 'Live Classes',
        },
        {
            key: '/user/notes',
            icon: <FileTextOutlined />,
            label: 'Notes',
        },
        {
            key: '/user/timetable',
            icon: <CalendarOutlined />,
            label: 'Timetable',
        },
        {
            key: '/user/profile',
            icon: <UserOutlined />,
            label: 'Profile',
        },
    ]

    const menuItems = isAdmin ? adminMenuItems : userMenuItems

    const handleMenuClick = ({ key }) => {
        navigate(key)
    }

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            className="border-r border-gray-800"
            breakpoint="lg"
            theme="dark"
            style={{ background: '#111827' }}
        >
            <div className="p-4 text-center border-b border-gray-800">
                {!collapsed && (
                    <h2 className="text-lg font-bold text-primary-400 font-heading">
                        {isAdmin ? 'Admin Panel' : 'Student Portal'}
                    </h2>
                )}
            </div>

            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
                className="border-r-0 bg-gray-900"
                theme="dark"
            />
        </Sider>
    )
}

export default Sidebar
