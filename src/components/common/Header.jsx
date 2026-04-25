import React from 'react'
import { Layout, Menu, Avatar, Dropdown, Badge } from 'antd'
import {
    UserOutlined,
    LogoutOutlined,
    BellOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const { Header: AntHeader } = Layout

const Header = ({ collapsed, onToggle }) => {
    const { user, logout, isAdmin } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const isInstitutionSelect = location.pathname === '/user/select-institution'

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
            onClick: () => {
                navigate(isAdmin ? '/admin/profile' : '/user/profile');
            }
        },
    ]

    // Only add logout option if the user exists
    if (user) {
        userMenuItems.push({
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: logout,
            danger: true,
        })
    }

    return (
        <AntHeader className="bg-gray-900 border-b border-gray-800 px-6 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-6">
                <div className="text-2xl font-bold text-primary-400">
                    <span className="font-heading">GloryFuel</span>
                </div>
                {onToggle && (
                    <button
                        onClick={onToggle}
                        className="text-xl text-gray-300 hover:text-primary transition-colors"
                    >
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </button>
                )}
                {!onToggle && user && !isInstitutionSelect && (
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-gray-300 hover:text-primary transition-colors">Dashboard</Link>
                        <Link to="/user/my-batches" className="text-gray-300 hover:text-primary transition-colors">My Batches</Link>
                        <Link to="/user/live-classes" className="text-gray-300 hover:text-primary transition-colors">Live Classes</Link>
                        <Link to="/user/notes" className="text-gray-300 hover:text-primary transition-colors">Notes</Link>
                        <Link to="/user/timetable" className="text-gray-300 hover:text-primary transition-colors">Timetable</Link>
                    </nav>
                )}
            </div>

            {!isInstitutionSelect && (
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <Badge count={5} size="small">
                        <BellOutlined className="text-xl cursor-pointer text-gray-300 hover:text-primary transition-colors" />
                    </Badge>

                    {/* User Menu */}
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Avatar icon={<UserOutlined />} className="bg-primary" />
                            <span className="font-medium text-gray-300 hidden md:inline">{user?.name}</span>
                        </div>
                    </Dropdown>
                </div>
            )}
        </AntHeader>
    )
}

export default Header
