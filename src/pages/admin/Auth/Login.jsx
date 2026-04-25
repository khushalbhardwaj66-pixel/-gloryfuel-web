import React from 'react'
import { Form, Input, Button, Card, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Aurora from '@/Aurora'
import { AURORA_THEMES } from '@/constants/theme'

const AdminLogin = () => {
    const { login, isAuthenticated, isAdmin, loading } = useAuth()
    const navigate = useNavigate()
    const [form] = Form.useForm()

    // Redirect to dashboard ONLY if the user is already an admin
    if (isAuthenticated && isAdmin) {
        return <Navigate to="/admin/dashboard" replace />
    }

    const onFinish = async (values) => {
        const result = await login(values)
        if (result && result.success) {
            // Success! The AuthContext already started navigation, 
            // but we add this as a fallback for the admin page.
            if (result.user?.role === 'admin') {
                navigate('/admin/dashboard')
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 bg-slate-900">
            {/* Aurora Background */}
            <div className="absolute inset-0 w-full h-full">
                <Aurora {...AURORA_THEMES.ADMIN} />
            </div>

            {/* Login Card */}
            <Card className="w-full max-w-md shadow-2xl relative z-10 backdrop-blur-md bg-white/10 border border-white/20 lg-card">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white font-heading mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-gray-300">Secure Access Control</p>
                </div>

                <Form
                    form={form}
                    name="admin_login"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        label={<span className="text-gray-300">Email Address</span>}
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="admin@gloryfuel.com"
                            className="h-11 font-medium"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={<span className="text-gray-300">Password</span>}
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="••••••••"
                            className="h-11 font-medium"
                        />
                    </Form.Item>

                    <Form.Item>
                        <div className="flex items-center justify-between">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox className="text-gray-300">Remember me</Checkbox>
                            </Form.Item>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            className="btn-liquid-primary h-12 border-0 shadow-lg text-lg font-semibold tracking-wide"
                        >
                            Access Dashboard
                        </Button>
                    </Form.Item>

                    <div className="text-center text-gray-400 text-xs mt-4">
                        <p>Restricted Area. Authorized Personnel Only.</p>
                    </div>
                </Form>
            </Card>
        </div>
    )
}

export default AdminLogin
