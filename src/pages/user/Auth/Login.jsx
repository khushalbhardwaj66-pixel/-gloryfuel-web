import React from 'react'
import { Form, Input, Button, Card } from 'antd'
import { MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'


const UserLogin = () => {
    const { login, isAuthenticated, isAdmin, loading } = useAuth()
    const navigate = useNavigate()
    const [form] = Form.useForm()

    // Redirect ONLY if already authenticated as a non-admin
    if (isAuthenticated && !isAdmin) {
        return <Navigate to="/user/my-batches" replace />
    }

    const onFinish = async (values) => {
        const result = await login(values)
        if (result.success) {
            navigate('/user/my-batches')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 bg-slate-950">
            {/* Dark Aurora Background */}
            <div className="absolute inset-0 w-full h-full">
                <Aurora
                    colorStops={['#4F46E5', '#7cff67', '#06b6d4']}
                    blend={0.6}
                    amplitude={1.2}
                    speed={0.4}
                />
            </div>

            {/* Login Card with Modern Aesthetic */}
            <Card className="w-full max-w-md relative z-10 backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="text-center mb-8">
                    <div className="text-3xl font-bold text-white mb-2 tracking-tight">
                        Glory<span className="text-primary-400">Fuel</span>
                    </div>
                    <p className="text-gray-400">Fuel your future. Sign in to continue.</p>
                </div>

                <Form
                    form={form}
                    name="student_login"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        label={<span className="text-gray-300 font-medium">Email Address</span>}
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Enter a valid email' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined className="text-gray-500" />}
                            placeholder="you@example.com"
                            className="h-12 font-medium"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={<span className="text-gray-300 font-medium">Password</span>}
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-500" />}
                            placeholder="••••••••"
                            className="h-12 font-medium"
                        />
                    </Form.Item>

                    <div className="flex justify-end mb-6">
                        <a href="#" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">Forgot password?</a>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            className="h-12 bg-gradient-to-r from-primary-600 to-cyan-600 border-0 text-lg font-bold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Sign In
                        </Button>
                    </Form.Item>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-transparent text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        block
                        icon={<GoogleOutlined />}
                        className="h-12 bg-white/5 border-white/10 text-white rounded-lg hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                    >
                        Google
                    </Button>

                    <p className="text-center text-gray-500 mt-8 text-sm">
                        Don't have an account? <a href="#" className="text-primary-400 hover:underline">Sign up</a>
                    </p>
                </Form>
            </Card>
        </div>
    )
}

export default UserLogin
