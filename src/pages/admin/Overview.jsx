import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Card, Typography, Space, Spin, message, Divider } from 'antd';
import {
    DatabaseOutlined,
    VideoCameraOutlined,
    BookOutlined,
    ProfileOutlined,
    BulbOutlined,
} from '@ant-design/icons';
import AdminLayout from '@/components/common/AdminLayout';
import SyncAll from '@/components/admin/SyncAll';

// Batches
import { fetchBatches, selectAllBatches, selectBatchesLoading } from '@/store/slices/batchSlice';
// Notes
import { fetchNotes, selectAllNotes, selectNotesLoading } from '@/store/slices/noteSlice';
// Videos
import { fetchVideos, selectAllVideos, selectVideosLoading } from '@/store/slices/videoSlice';
// Live Classes
import { fetchLiveClasses, selectAllLiveClasses, selectLiveClassesLoading } from '@/store/slices/liveClassSlice';
// Subjects
import { fetchSubjects, selectAllSubjects, selectSubjectsLoading } from '@/store/slices/subjectSlice';

const { Title, Text } = Typography;

const AdminOverview = () => {
    const dispatch = useDispatch();

    // Selectors
    const batches     = useSelector(selectAllBatches);
    const notes       = useSelector(selectAllNotes);
    const videos      = useSelector(selectAllVideos);
    const liveClasses = useSelector(selectAllLiveClasses);
    const subjects    = useSelector(selectAllSubjects);

    const loadingBatches = useSelector(selectBatchesLoading);
    const loadingNotes   = useSelector(selectNotesLoading);
    const loadingVideos  = useSelector(selectVideosLoading);
    const loadingLive    = useSelector(selectLiveClassesLoading);
    const loadingSubjects= useSelector(selectSubjectsLoading);

    // Dispatch all fetches on mount
    useEffect(() => {
        dispatch(fetchBatches()).unwrap().catch(() => message.error('Failed to load batches'));
        dispatch(fetchNotes()).unwrap().catch(() => message.error('Failed to load notes'));
        dispatch(fetchVideos()).unwrap().catch(() => message.error('Failed to load videos'));
        dispatch(fetchLiveClasses()).unwrap().catch(() => message.error('Failed to load live classes'));
        dispatch(fetchSubjects()).unwrap().catch(() => message.error('Failed to load subjects'));
    }, [dispatch]);

    // ─── Column definitions ───────────────────────────────────────────────────

    const batchCols = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Students', dataIndex: 'students', key: 'students',
            render: c => <Tag color="blue">{c || 0} Enrolled</Tag>,
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: s => <Tag color={s === 'active' ? 'green' : 'gold'}>{(s || 'active').toUpperCase()}</Tag>,
        },
        {
            title: 'Created', dataIndex: 'created_at', key: 'created_at',
            render: d => d ? new Date(d).toLocaleDateString() : '—',
        },
    ];

    const noteCols = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Batch', dataIndex: 'batch_name', key: 'batch_name' },
        { title: 'Subject', dataIndex: 'subject_name', key: 'subject_name' },
        { title: 'Type', dataIndex: 'file_type', key: 'file_type', render: t => <Tag>{(t || 'file').toUpperCase()}</Tag> },
        {
            title: 'Link', dataIndex: 'file_url', key: 'file_url',
            render: url => url ? <a href={url} target="_blank" rel="noreferrer">Open ↗</a> : '—',
        },
    ];

    const videoCols = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Subject', dataIndex: 'subject_name', key: 'subject_name' },
        {
            title: 'Watch', dataIndex: 'video_url', key: 'video_url',
            render: url => url ? <a href={url} target="_blank" rel="noreferrer">Watch ↗</a> : '—',
        },
    ];

    const liveCols = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Batch', dataIndex: 'batch_name', key: 'batch_name' },
        { title: 'Instructor', dataIndex: 'instructor', key: 'instructor' },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: s => <Tag color={{ upcoming: 'blue', live: 'green', ended: 'default' }[s] || 'blue'}>{(s || 'upcoming').toUpperCase()}</Tag>,
        },
        {
            title: 'Scheduled', dataIndex: 'scheduled_at', key: 'scheduled_at',
            render: d => d ? new Date(d).toLocaleString() : '—',
        },
        {
            title: 'Meeting', dataIndex: 'meeting_link', key: 'meeting_link',
            render: l => l ? <a href={l} target="_blank" rel="noreferrer">Join ↗</a> : '—',
        },
    ];

    const subjectCols = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Batch', dataIndex: 'batch_name', key: 'batch_name' },
    ];

    // ─── Reusable table card ──────────────────────────────────────────────────

    const DataCard = ({ title, icon, data, loading, columns, emptyText }) => (
        <Card
            style={{ marginBottom: 24, borderRadius: 16 }}
            title={
                <Space>
                    {icon}
                    <Title level={5} style={{ margin: 0 }}>{title}</Title>
                    <Tag color="purple">{data.length} records</Tag>
                </Space>
            }
            extra={loading ? <Spin size="small" /> : <Text type="secondary">✓ Loaded</Text>}
        >
            <Table
                dataSource={data}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="small"
                locale={{ emptyText: emptyText || 'No records found' }}
                scroll={{ x: true }}
            />
        </Card>
    );

    return (
        <AdminLayout>
            <div style={{ padding: '0 8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <Title level={3} style={{ margin: 0 }}>
                        <DatabaseOutlined style={{ marginRight: 8, color: '#7c3aed' }} />
                        Admin Overview — All Data
                    </Title>
                    <SyncAll onSyncSuccess={() => {
                        dispatch(fetchBatches());
                        dispatch(fetchSubjects());
                        dispatch(fetchVideos());
                        dispatch(fetchNotes());
                        dispatch(fetchLiveClasses());
                    }} />
                </div>

                <DataCard
                    title="Batches"
                    icon={<DatabaseOutlined style={{ color: '#3b82f6' }} />}
                    data={batches}
                    loading={loadingBatches}
                    columns={batchCols}
                    emptyText="No batches found. Use the Data Center to sync or create one."
                />

                <DataCard
                    title="Subjects"
                    icon={<ProfileOutlined style={{ color: '#ec4899' }} />}
                    data={subjects}
                    loading={loadingSubjects}
                    columns={subjectCols}
                    emptyText="No subjects found."
                />

            </div>
        </AdminLayout>
    );
};

export default AdminOverview;
