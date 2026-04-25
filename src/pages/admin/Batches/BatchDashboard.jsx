import React, { useEffect } from 'react';
import { Table, Tag, Card, message, Typography, Space, Button, Tooltip, Popconfirm } from 'antd';
import { SyncOutlined, DatabaseOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '@/components/common/AdminLayout';
import ExternalImport from './ExternalImport';
import SyncAll from '@/components/admin/SyncAll';

import {
    fetchBatches,
    deleteBatchAsync,
    selectAllBatches,
    selectBatchesLoading,
} from '@/store/slices/batchSlice';

const { Title, Text } = Typography;

const BatchDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const data = useSelector(selectAllBatches);
    const loading = useSelector(selectBatchesLoading);

    // Fetch batches from the local PHP API on mount
    useEffect(() => {
        dispatch(fetchBatches())
            .unwrap()
            .catch(() => message.error('Failed to load batches'));
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteBatchAsync(id))
            .unwrap()
            .then(() => message.success('Batch deleted successfully'))
            .catch(() => message.error('Failed to delete batch'));
    };

    const columns = [
        {
            title: 'Batch Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong className="text-white">{text}</Text>,
        },
        {
            title: 'Students',
            dataIndex: 'students',
            key: 'students',
            render: (count) => <Tag color="blue">{count || 0} Enrolled</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'gold'}>
                    {status?.toUpperCase() || 'ACTIVE'}
                </Tag>
            ),
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => (
                <Text type="secondary">
                    {date ? new Date(date).toLocaleDateString() : '—'}
                </Text>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Edit Batch">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/admin/batches/${record.id}/edit`)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete this batch?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete Batch">
                            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Card
                className="bg-gray-800/60 border-gray-700 backdrop-blur-xl rounded-2xl shadow-2xl"
                title={
                    <div className="flex justify-between items-center w-full">
                        <Space>
                            <DatabaseOutlined className="text-blue-400" />
                            <Title level={4} style={{ margin: 0 }} className="text-white">
                                Batch Management
                            </Title>
                        </Space>
                        <Space>
                            <SyncAll onSyncSuccess={() => dispatch(fetchBatches())} />
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => navigate('/admin/batches/create')}
                                className="bg-blue-600 border-0"
                            >
                                Add Batch
                            </Button>
                        </Space>
                    </div>
                }
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    className="custom-table"
                    locale={{ emptyText: 'No batches found. Import from rolexcoderz.in or create one.' }}
                />
            </Card>
        </AdminLayout>
    );
};

export default BatchDashboard;
