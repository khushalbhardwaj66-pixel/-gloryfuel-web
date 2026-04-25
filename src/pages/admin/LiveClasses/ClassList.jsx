import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, message, Modal, Form, Input, Select, DatePicker } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import AdminLayout from '@components/common/AdminLayout'
import { fetchLiveClasses, deleteLiveClassAsync, createLiveClassAsync, updateLiveClassAsync, selectAllLiveClasses } from '@/store/slices/liveClassSlice'
import { fetchBatches, selectAllBatches } from '@/store/slices/batchSlice'
import dayjs from 'dayjs'

const ClassList = () => {
    const dispatch = useDispatch()
    const classes = useSelector(selectAllLiveClasses)
    const batches = useSelector(selectAllBatches)
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            dispatch(fetchLiveClasses()).unwrap(),
            dispatch(fetchBatches()).unwrap()
        ]).finally(() => setLoading(false))
    }, [dispatch])

    const handleAdd = () => {
        setEditingId(null)
        form.resetFields()
        setIsModalVisible(true)
    }

    const handleEdit = (record) => {
        setEditingId(record.id)
        form.setFieldsValue({
            ...record,
            scheduled_at: dayjs(record.scheduled_at)
        })
        setIsModalVisible(true)
    }

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Delete this live class?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    await dispatch(deleteLiveClassAsync(id)).unwrap()
                    message.success('Class deleted')
                } catch (error) {
                    message.error('Failed to delete')
                }
            }
        })
    }

    const onFinish = async (values) => {
        const payload = {
            ...values,
            scheduled_at: values.scheduled_at.format('YYYY-MM-DD HH:mm:ss'),
            id: editingId
        }

        try {
            if (editingId) {
                await dispatch(updateLiveClassAsync(payload)).unwrap()
                message.success('Class updated')
            } else {
                await dispatch(createLiveClassAsync(payload)).unwrap()
                message.success('Class created')
            }
            setIsModalVisible(false)
        } catch (error) {
            message.error('Failed to save')
        }
    }

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        {
            title: 'Batch',
            dataIndex: 'batch_name',
            key: 'batch_name',
            render: (text) => <Tag color="purple">{text || 'N/A'}</Tag>
        },
        { title: 'Instructor', dataIndex: 'instructor', key: 'instructor' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = { upcoming: 'blue', live: 'green', ended: 'gray' }
                return <Tag color={colors[status] || 'default'}>{(status || 'unknown').toUpperCase()}</Tag>
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
                    <Button icon={<VideoCameraOutlined />} type="link" href={record.meeting_link} target="_blank">Join</Button>
                </Space>
            )
        }
    ]

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Live Classes Management</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Schedule Class
                </Button>
            </div>

            <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-md">
                <Table columns={columns} dataSource={classes} loading={loading} rowKey="id" />
            </Card>

            <Modal
                title={editingId ? 'Edit Class' : 'Schedule New Class'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="title" label="Class Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="batch_id" label="Target Batch" rules={[{ required: true }]}>
                        <Select>
                            {batches.map(b => (
                                <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="instructor" label="Instructor Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="scheduled_at" label="Scheduled Time" rules={[{ required: true }]}>
                        <DatePicker showTime className="w-full" />
                    </Form.Item>
                    <Form.Item name="meeting_link" label="Meeting Link (Zoom/Google Meet/YouTube)" rules={[{ required: true, type: 'url' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Status" initialValue="upcoming">
                        <Select>
                            <Select.Option value="upcoming">Upcoming</Select.Option>
                            <Select.Option value="live">Live Now</Select.Option>
                            <Select.Option value="ended">Ended</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large">
                            {editingId ? 'Update Schedule' : 'Launch Class'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    )
}

export default ClassList
