import React, { useEffect } from 'react'
import { Table, Button, Space, Tag, Input, Modal } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import AdminLayout from '@components/common/AdminLayout'
import { selectAllBatches, deleteBatchAsync, fetchBatches } from '@/store/slices/batchSlice'
import ExternalImport from './ExternalImport'

const BatchList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const batches = useSelector(selectAllBatches)

    // Fetch batches from database on mount
    useEffect(() => {
        dispatch(fetchBatches())
    }, [dispatch])

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this batch?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                dispatch(deleteBatchAsync(id))
            },
        })
    }

    const columns = [
        {
            title: 'Batch Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Students',
            dataIndex: 'students',
            key: 'students',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'default'}>
                    {status ? status.toUpperCase() : 'UNKNOWN'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/batches/${record.id}/edit`)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Batch Management</h1>
                    <Space>
                        <ExternalImport />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/admin/batches/create')}
                        >
                            Create Batch
                        </Button>
                    </Space>
                </div>

                <div className="mb-4">
                    <Input
                        placeholder="Search batches..."
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                    />
                </div>

                <Table columns={columns} dataSource={batches} rowKey="id" />
            </div>
        </AdminLayout>
    )
}

export default BatchList
