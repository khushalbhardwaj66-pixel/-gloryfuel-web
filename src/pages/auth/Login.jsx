import React from 'react'
import { Form, Input, Button, Card, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Aurora from '@/Aurora'

const Login = () => {
    const { login, isAuthenticated, loading } = useAuth()
    const [form] = Form.useForm()

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    const onFinish = async (values) => {
        await login(values)
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
            {/* Aurora Background */}
            <div className="absolute inset-0 w-full h-full">
                <Aurora
                    colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={1}
                />
            </div>

            {/* Login Card */}
            <Card className="w-full max-w-md shadow-2xl relative z-10 backdrop-blur-sm bg-white/95">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary font-heading mb-2">
                        GloryFuel
                    </h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Enter your email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Enter your password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <div className="flex items-center justify-between">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <Link to="/forgot-password" className="text-primary hover:text-primary-600">
                                Forgot password?
                            </Link>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Sign In
                        </Button>
                    </Form.Item>

                    <div className="text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:text-primary-600 font-medium">
                            Sign up
                        </Link>
                    </div>
                </Form>

                <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
                    <p className="mb-2">Demo Credentials:</p>
                    <p>Admin: admin@gloryfuel.com / password</p>
                    <p>User: user@gloryfuel.com / password</p>
                </div>
            </Card>
        </div>
    )
}

export default Login
