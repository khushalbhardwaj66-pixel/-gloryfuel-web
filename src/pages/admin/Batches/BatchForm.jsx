import React, { useEffect } from 'react'
import { Form, Input, Button, DatePicker, Select, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import AdminLayout from '@components/common/AdminLayout'
import { addBatchAsync, updateBatchAsync, selectAllBatches } from '@/store/slices/batchSlice'

const { TextArea } = Input
const { Option } = Select

const BatchForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const batches = useSelector(selectAllBatches)
    const isEdit = !!id

    useEffect(() => {
        if (isEdit && id) {
            const batch = batches.find(b => b.id === id)
            if (batch) {
                form.setFieldsValue({
                    ...batch,
                    start_date: batch.start_date ? moment(batch.start_date) : null,
                    end_date: batch.end_date ? moment(batch.end_date) : null,
                })
            }
        }
    }, [isEdit, id, batches, form])

    const onFinish = (values) => {
        const batchData = {
            ...values,
            start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null,
            end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : null,
        }

        if (isEdit) {
            dispatch(updateBatchAsync({ ...batchData, id }))
        } else {
            // Generate a random gradient color for the card
            const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4']
            const randomColor = colors[Math.floor(Math.random() * colors.length)]

            dispatch(addBatchAsync({
                students: 0,
                color: randomColor,
                ...batchData
            }))
        }
        navigate('/admin/batches')
    }

    return (
        <AdminLayout>
            <div className="max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">
                    {isEdit ? 'Edit Batch' : 'Create New Batch'}
                </h1>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Batch Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input batch name!' }]}
                    >
                        <Input placeholder="Enter batch name" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input description!' }]}
                    >
                        <TextArea rows={4} placeholder="Enter batch description" />
                    </Form.Item>

                    <Form.Item
                        label="Start Date"
                        name="start_date"
                        rules={[{ required: true, message: 'Please select start date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="End Date"
                        name="end_date"
                        rules={[{ required: true, message: 'Please select end date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Banner URL"
                        name="banner_url"
                        rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                    >
                        <Input placeholder="https://example.com/banner.jpg" />
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        initialValue="active"
                        rules={[{ required: true, message: 'Please select status!' }]}
                    >
                        <Select>
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                            <Option value="completed">Completed</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {isEdit ? 'Update' : 'Create'} Batch
                            </Button>
                            <Button onClick={() => navigate('/admin/batches')}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </AdminLayout>
    )
}

export default BatchForm
