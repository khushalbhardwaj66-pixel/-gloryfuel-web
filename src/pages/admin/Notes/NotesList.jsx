import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, message, Modal, Form, Input, Select } from 'antd'
import { PlusOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import AdminLayout from '@components/common/AdminLayout'
import { fetchNotes, deleteNoteAsync, createNoteAsync, selectAllNotes } from '@/store/slices/noteSlice'
import { fetchBatches, selectAllBatches } from '@/store/slices/batchSlice'
import { fetchSubjects, selectAllSubjects } from '@/store/slices/subjectSlice'

const NotesList = () => {
    const dispatch = useDispatch()
    const notes = useSelector(selectAllNotes)
    const batches = useSelector(selectAllBatches)
    const subjects = useSelector(selectAllSubjects)
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()

    useEffect(() => {
        setLoading(true)
        Promise.all([
            dispatch(fetchNotes()).unwrap(),
            dispatch(fetchBatches()).unwrap(),
            dispatch(fetchSubjects()).unwrap()
        ]).finally(() => setLoading(false))
    }, [dispatch])

    const handleAdd = () => {
        form.resetFields()
        setIsModalVisible(true)
    }

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Delete this note?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    await dispatch(deleteNoteAsync(id)).unwrap()
                    message.success('Note deleted')
                } catch (error) {
                    message.error('Failed to delete')
                }
            }
        })
    }

    const onFinish = async (values) => {
        try {
            await dispatch(createNoteAsync(values)).unwrap()
            message.success('Note added')
            setIsModalVisible(false)
        } catch (error) {
            message.error('Failed to add')
        }
    }

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Batch', dataIndex: 'batch_name', key: 'batch_name' },
        { title: 'Subject', dataIndex: 'subject_name', key: 'subject_name' },
        {
            title: 'Type',
            dataIndex: 'file_type',
            key: 'file_type',
            render: (type) => <Tag color="blue">{(type || 'file').toUpperCase()}</Tag>
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<DownloadOutlined />} href={record.file_url} target="_blank" />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ]

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Notes Management</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Note
                </Button>
            </div>

            <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-md">
                <Table columns={columns} dataSource={notes} loading={loading} rowKey="id" />
            </Card>

            <Modal
                title="Add Study Material / Note"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="title" label="Note Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="batch_id" label="Batch" rules={[{ required: true }]}>
                        <Select>
                            {batches.map(b => <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="subject_id" label="Subject" rules={[{ required: true }]}>
                        <Select>
                            {subjects.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="file_url" label="File URL (PDF/DOCX/Drive)" rules={[{ required: true, type: 'url' }]}>
                        <Input placeholder="https://drive.google.com/file/d/..." />
                    </Form.Item>
                    <Form.Item name="file_type" label="File Type" initialValue="pdf">
                        <Select>
                            <Select.Option value="pdf">PDF Document</Select.Option>
                            <Select.Option value="docx">Word Document</Select.Option>
                            <Select.Option value="ppt">PowerPoint</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large">
                            Upload Note Entry
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    )
}

export default NotesList
