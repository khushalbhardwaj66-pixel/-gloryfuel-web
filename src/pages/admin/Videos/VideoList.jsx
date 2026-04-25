import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, Space, message, Image } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import AdminLayout from '@components/common/AdminLayout'
import { fetchVideos, deleteVideoAsync, createVideoAsync, updateVideoAsync, selectAllVideos } from '@/store/slices/videoSlice'
import { fetchSubjects, selectAllSubjects } from '@/store/slices/subjectSlice'
import { API_BASE_URL } from '@/constants'

const VideoList = () => {
    const dispatch = useDispatch()
    const videos = useSelector(selectAllVideos)
    const subjects = useSelector(selectAllSubjects)
    const [batches, setBatches] = useState([])
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()
    const [editingId, setEditingId] = useState(null)
    const [selectedBatch, setSelectedBatch] = useState(null)

    // Watch for form batch changes to filter subjects
    const batchIdWatch = Form.useWatch('batch_id', form)

    useEffect(() => {
        setLoading(true)
        const fetchAll = async () => {
            try {
                await Promise.all([
                    dispatch(fetchVideos()).unwrap(),
                    dispatch(fetchSubjects()).unwrap(),
                    fetchBatches()
                ])
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [dispatch])

    const fetchBatches = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/batches/index.php?_t=${Date.now()}`)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)

            const data = await res.json()
            setBatches(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error(error)
            message.error(`Failed to fetch batches: ${error.message}`)
        }
    }

    // Filter subjects based on selected batch
    const filteredSubjects = batchIdWatch
        ? subjects.filter(s => s.batch_id?.toString() === batchIdWatch.toString())
        : []

    const handleAdd = () => {
        setEditingId(null)
        form.resetFields()
        setIsModalVisible(true)
    }

    // When editing, we need to pre-fill batch based on the subject
    const handleEdit = (record) => {
        setEditingId(record.id)

        // Find the batch_id for this subject
        const subject = subjects.find(s => s.id === record.subject_id)
        const batchId = subject?.batch_id

        form.setFieldsValue({
            ...record,
            batch_id: batchId
        })
        setIsModalVisible(true)
    }

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Delete this video?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/videos/index.php?id=${id}`, { method: 'DELETE' })
                    const result = await res.json()

                    if (result.status === 'success') {
                        message.success('Video deleted')
                        dispatch(fetchVideos())
                    } else {
                        throw new Error('Deletion failed')
                    }
                } catch (error) {
                    message.error('Failed to delete video')
                }
            }
        })
    }

    const onFinish = async (values) => {
        // We assume Redux slice needs update or we call API directly. 
        // For consistency with recent changes, let's call API directly to ensure index.php usage

        const url = `${API_BASE_URL}/api/videos/index.php`
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
                message.success(`Video ${editingId ? 'updated' : 'created'}`)
                setIsModalVisible(false)
                dispatch(fetchVideos()) // Refresh Redux state
            } else {
                message.error(result.message || 'Operation failed')
            }
        } catch (error) {
            message.error('Operation failed')
        }
    }

    const columns = [
        {
            title: 'Thumbnail',
            dataIndex: 'thumbnail_url',
            key: 'thumbnail_url',
            render: (url) => <Image src={url} width={80} className="rounded" fallback="https://via.placeholder.com/80x45?text=No+Image" />
        },
        { title: 'Video Title', dataIndex: 'title', key: 'title' },
        { title: 'Subject', dataIndex: 'subject_name', key: 'subject_name' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
                    <Button icon={<PlayCircleOutlined />} type="link" href={record.video_url} target="_blank">Watch</Button>
                </Space>
            )
        }
    ]

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Video Management</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Video
                </Button>
            </div>

            <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-md">
                <Table
                    columns={columns}
                    dataSource={videos}
                    loading={loading}
                    rowKey="id"
                />
            </Card>

            <Modal
                title={editingId ? 'Edit Video' : 'Add Video'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="title" label="Video Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    {/* Dependent Dropdowns */}
                    <Form.Item name="batch_id" label="Select Batch (First)" rules={[{ required: true, message: 'Please select a batch first' }]}>
                        <Select placeholder="Choose a batch...">
                            {batches.map(b => (
                                <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="subject_id"
                        label="Select Subject"
                        rules={[{ required: true, message: 'Please select a subject' }]}
                        dependencies={['batch_id']}
                    >
                        <Select
                            placeholder={batchIdWatch ? "Choose a subject..." : "Select a batch first"}
                            disabled={!batchIdWatch}
                        >
                            {filteredSubjects.map(s => (
                                <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="thumbnail_url" label="Thumbnail Image URL" rules={[{ required: true, type: 'url' }]}>
                        <Input placeholder="https://example.com/image.jpg" />
                    </Form.Item>
                    <Form.Item name="video_url" label="Video URL (YouTube/Vimeo/Internal)" rules={[{ required: true, type: 'url' }]}>
                        <Input placeholder="https://youtube.com/watch?v=..." />
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

export default VideoList
