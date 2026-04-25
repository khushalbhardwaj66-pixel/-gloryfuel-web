import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, Space, message, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import AdminLayout from '@components/common/AdminLayout'
import { API_BASE_URL } from '@/constants'

const SubjectList = () => {
    const [subjects, setSubjects] = useState([])
    const [batches, setBatches] = useState([])
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()
    const [editingId, setEditingId] = useState(null)

    const fetchSubjects = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/api/subjects/index.php`)
            const data = await res.json()
            if (res.ok) {
                setSubjects(Array.isArray(data) ? data : [])
            } else {
                setSubjects([])
            }
        } catch (error) {
            message.error('Failed to fetch subjects')
        } finally {
            setLoading(false)
        }
    }

    const fetchBatches = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/batches/index.php`)
            const data = await res.json()
            setBatches(data)
        } catch (error) {
            message.error('Failed to fetch batches')
        }
    }

    useEffect(() => {
        fetchSubjects()
        fetchBatches()
    }, [])

    const handleAdd = () => {
        setEditingId(null)
        form.resetFields()
        setIsModalVisible(true)
    }

    const handleEdit = (record) => {
        setEditingId(record.id)
        form.setFieldsValue(record)
        setIsModalVisible(true)
    }

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this subject?')) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/subjects/index.php?id=${id}`, { method: 'DELETE' })
                const result = await res.json()
                if (result.status === 'success') {
                    message.success('Subject deleted')
                    fetchSubjects()
                } else {
                    message.error(result.message || 'Delete failed')
                }
            } catch (error) {
                message.error('Failed to delete subject')
            }
        }
    }

    const onFinish = async (values) => {
        const url = `${API_BASE_URL}/api/subjects/index.php`
        const method = editingId ? 'PUT' : 'POST'
        const payload = editingId ? { ...values, id: editingId } : values

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const result = await res.json()
            if (result.status === 'success') {
                message.success(`Subject ${editingId ? 'updated' : 'created'}`)
                setIsModalVisible(false)
                fetchSubjects()
            } else {
                message.error(result.message || 'Operation failed')
            }
        } catch (error) {
            message.error('Operation failed')
        }
    }

    const columns = [
        { title: 'Subject Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Batch',
            dataIndex: 'batch_name',
            key: 'batch_name',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ]

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Subject Management</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Subject
                </Button>
            </div>

            <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-md">
                <Table
                    columns={columns}
                    dataSource={subjects}
                    loading={loading}
                    rowKey="id"
                />
            </Card>

            <Modal
                title={editingId ? 'Edit Subject' : 'Add Subject'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="name" label="Subject Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="batch_id" label="Batch" rules={[{ required: true }]}>
                        <Select>
                            {batches.map(b => (
                                <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {editingId ? 'Update' : 'Create'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    )
}

export default SubjectList
