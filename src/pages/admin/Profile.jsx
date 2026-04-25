import React, { useState } from 'react'
import { Card, Form, Input, Button, Typography, message, Space, Divider, Tag } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, SaveOutlined } from '@ant-design/icons'
import AdminLayout from '@components/common/AdminLayout'
import { useAuth } from '@/context/AuthContext'
import { API_BASE_URL } from '@/constants'

const { Title, Text } = Typography

const AdminProfile = () => {
    const { user, updateUser, loading: authLoading } = useAuth()
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const [passwordForm] = Form.useForm()

    // Sync form with user data
    React.useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user?.name,
                email: user?.email
            })
        }
    }, [user, form])

    if (authLoading || !user) {
        return <div className="flex items-center justify-center min-h-[400px]"><Text className="text-gray-400 italic">Synchronizing account data...</Text></div>
    }

    const onUpdateProfile = async (values) => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/auth/update_profile.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    name: values.name,
                    email: values.email
                })
            })
            const data = await res.json()
            if (data.success) {
                message.success('Profile updated successfully')
                updateUser({ name: values.name, email: values.email })
            } else {
                message.error(data.message || 'Failed to update profile')
            }
        } catch (error) {
            message.error('An error occurred during profile update')
        } finally {
            setLoading(false)
        }
    }

    const onChangePassword = async (values) => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/auth/update_profile.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    current_password: values.current_password,
                    new_password: values.new_password,
                    action: 'change_password'
                })
            })
            const data = await res.json()
            if (data.success) {
                message.success('Password changed successfully')
                passwordForm.resetFields()
            } else {
                message.error(data.message || 'Failed to change password')
            }
        } catch (error) {
            message.error('An error occurred during password change')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
                <div className="flex flex-col gap-2">
                    <Title level={2} className="!text-white !m-0">Account Settings</Title>
                    <Text className="text-gray-400 text-lg">Manage your admin credentials and security</Text>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Profile Information */}
                    <Card
                        className="bg-gray-800/40 border-gray-700/50 backdrop-blur-xl rounded-3xl border-2 shadow-2xl"
                        title={<span className="text-white text-xl font-bold">General Information</span>}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{ name: user?.name, email: user?.email }}
                            onFinish={onUpdateProfile}
                        >
                            <Form.Item name="name" label={<span className="text-gray-300">Full Name</span>}>
                                <Input prefix={<UserOutlined />} className="h-12 bg-gray-900/50 border-gray-700 text-white rounded-xl" />
                            </Form.Item>
                            <Form.Item name="email" label={<span className="text-gray-300">Email Address</span>}>
                                <Input prefix={<MailOutlined />} className="h-12 bg-gray-900/50 border-gray-700 text-white rounded-xl" />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} block className="h-12 bg-indigo-600 border-0 rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                                Save Changes
                            </Button>
                        </Form>
                    </Card>

                    {/* Change Password */}
                    <Card
                        className="bg-gray-800/40 border-gray-700/50 backdrop-blur-xl rounded-3xl border-2 shadow-2xl"
                        title={<span className="text-white text-xl font-bold">Security & Password</span>}
                    >
                        <Form
                            form={passwordForm}
                            layout="vertical"
                            onFinish={onChangePassword}
                        >
                            <Form.Item name="current_password" label={<span className="text-gray-300">Current Password</span>} rules={[{ required: true }]}>
                                <Input.Password prefix={<LockOutlined />} className="h-12 bg-gray-900/50 border-gray-700 text-white rounded-xl shadow-none" />
                            </Form.Item>
                            <Form.Item name="new_password" label={<span className="text-gray-300">New Password</span>} rules={[{ required: true, min: 6 }]}>
                                <Input.Password prefix={<LockOutlined />} className="h-12 bg-gray-900/50 border-gray-700 text-white rounded-xl shadow-none" />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" icon={<LockOutlined />} loading={loading} block className="h-12 bg-emerald-600 hover:bg-emerald-700 border-0 rounded-xl font-bold shadow-lg shadow-emerald-600/20">
                                Update Password
                            </Button>
                        </Form>
                    </Card>
                </div>

                {/* Account Status Card */}
                <Card className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-indigo-500/20 rounded-3xl border shadow-xl">
                    <div className="flex items-center justify-between">
                        <Space size={16}>
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                <UserOutlined className="text-2xl text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold m-0">Administrator Access</h3>
                                <p className="text-gray-400 m-0 text-sm">Your account has full system permissions.</p>
                            </div>
                        </Space>
                        <Tag color="indigo" className="m-0 border-0 bg-indigo-500/20 text-indigo-400 font-bold px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
                            Level 1 Admin
                        </Tag>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    )
}

export default AdminProfile
