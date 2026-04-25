import React from 'react'
import { Card } from 'antd'
import UserLayout from '@components/common/UserLayout'

const StudentProfile = () => {
    return (
        <UserLayout>
            <div>
                <h1 className="text-2xl font-bold mb-6">My Profile</h1>
                <Card>
                    <p className="text-gray-600">Profile page - Coming soon</p>
                </Card>
            </div>
        </UserLayout>
    )
}

export default StudentProfile
