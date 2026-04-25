import React from 'react'
import { Card } from 'antd'
import AdminLayout from '@components/common/AdminLayout'

const UserList = () => {
    return (
        <AdminLayout>
            <div>
                <h1 className="text-2xl font-bold mb-6">User Management</h1>
                <Card>
                    <p className="text-gray-600">User management page - Coming soon</p>
                </Card>
            </div>
        </AdminLayout>
    )
}

export default UserList
