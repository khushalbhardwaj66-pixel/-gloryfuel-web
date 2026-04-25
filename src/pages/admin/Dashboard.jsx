import React, { useEffect, useState } from 'react'
import { Row, Col, Card, List, Button, Tag, Space } from 'antd'
import {
    UserOutlined,
    TeamOutlined,
    VideoCameraOutlined,
    FileTextOutlined,
    PlusOutlined,
    RightOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import AdminLayout from '@components/common/AdminLayout'
import Aurora from '@/Aurora'
import { AURORA_THEMES } from '@/constants/theme'
import { API_BASE_URL } from '@/constants'
import { selectAllBatches, fetchBatches } from '@/store/slices/batchSlice'

const Dashboard = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const batches = useSelector(selectAllBatches)
    const [dbStats, setDbStats] = useState({
        students: 0,
        batches: 0,
        classes: 0,
        notes: 0
    })

    useEffect(() => {
        dispatch(fetchBatches())

        // Fetch real stats from database
        fetch(`${API_BASE_URL}/dashboard/stats.php`)
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setDbStats(data)
                }
            })
            .catch(err => console.error('Stats fetch error:', err))
    }, [dispatch])

    const stats = [
        {
            title: 'Total Students',
            value: dbStats.students.toLocaleString(),
            change: '+12%',
            icon: <UserOutlined />,
            color: '#4F46E5',
        },
        {
            title: 'Active Batches',
            value: dbStats.batches,
            change: '+3',
            icon: <TeamOutlined />,
            color: '#10B981',
        },
        {
            title: 'Live Classes',
            value: dbStats.classes,
            change: 'Today',
            icon: <VideoCameraOutlined />,
            color: '#F59E0B',
        },
        {
            title: 'Total Notes',
            value: dbStats.notes,
            change: '+24',
            icon: <FileTextOutlined />,
            color: '#06B6D4',
        },
    ]

    const chartData = [
        { name: 'Mon', students: 400 },
        { name: 'Tue', students: 300 },
        { name: 'Wed', students: 600 },
        { name: 'Thu', students: 800 },
        { name: 'Fri', students: 500 },
        { name: 'Sat', students: 900 },
        { name: 'Sun', students: 700 },
    ]

    return (
        <AdminLayout>
            <div className="relative">
                {/* Fixed Aurora Background */}
                <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
                    <Aurora {...AURORA_THEMES.ADMIN} />
                </div>

                <div className="relative z-10 space-y-8 animate-fadeIn">
                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2 underline-primary">Admin Dashboard</h1>
                            <p className="text-gray-400">Welcome back! Here's a snapshot of your platform.</p>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/admin/batches/create')}
                            className="h-11 px-6 rounded-xl bg-indigo-600 border-0 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 flex items-center font-bold"
                        >
                            Create New Batch
                        </Button>
                    </div>

                    {/* Stats Grid */}
                    <Row gutter={[20, 20]}>
                        {stats.map((stat, index) => (
                            <Col xs={24} sm={12} lg={6} key={index}>
                                <Card
                                    className="bg-gray-800/40 border-gray-700/50 backdrop-blur-xl rounded-2xl hover:translate-y-[-5px] transition-all duration-300 border shadow-xl"
                                    bodyStyle={{ padding: '24px' }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{stat.title}</p>
                                            <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                                            <Tag color={stat.color} className="border-0 bg-opacity-20 text-[10px] font-black px-2 rounded-md m-0">
                                                {stat.change}
                                            </Tag>
                                        </div>
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner"
                                            style={{ backgroundColor: `${stat.color}15`, color: stat.color, border: `1px solid ${stat.color}30` }}
                                        >
                                            {stat.icon}
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Row gutter={[24, 24]}>
                        {/* Student Engagement Chart */}
                        <Col xs={24} lg={16}>
                            <Card
                                title={<span className="text-white text-lg font-bold">Student Engagement</span>}
                                className="bg-gray-800/40 border-gray-700/50 backdrop-blur-xl rounded-2xl border shadow-xl"
                                bodyStyle={{ height: 350, padding: '20px' }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                        <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="students"
                                            stroke="#4F46E5"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorStudents)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>

                        {/* Recent Activity Log */}
                        <Col xs={24} lg={8}>
                            <Card
                                title={<span className="text-white text-lg font-bold">System Status</span>}
                                className="bg-gray-800/40 border-gray-700/50 backdrop-blur-xl rounded-2xl border shadow-xl h-full"
                            >
                                <div className="space-y-4">
                                    {[
                                        { label: 'Database', status: 'Optimal', color: '#10B981' },
                                        { label: 'API Gateway', status: 'Online', color: '#10B981' },
                                        { label: 'File Storage', status: 'Stable', color: '#10B981' },
                                        { label: 'Email Server', status: 'Slow', color: '#F59E0B' },
                                    ].map((service, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                            <span className="text-gray-300 font-medium">{service.label}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: service.color }} />
                                                <span style={{ color: service.color }} className="text-xs font-bold uppercase">{service.status}</span>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="mt-8 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                        <h4 className="text-indigo-400 font-bold text-sm mb-1">Server Traffic</h4>
                                        <p className="text-gray-400 text-xs mb-3">Load is currently 12% below average.</p>
                                        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                            <div className="bg-indigo-500 h-full w-[38%] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Recent Batches Section */}
                    <Card
                        title={<span className="text-white text-lg font-bold">Active Batches</span>}
                        extra={<Button type="link" onClick={() => navigate('/admin/batches')} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold">All Batches <RightOutlined style={{ fontSize: 10 }} /></Button>}
                        className="bg-gray-800/40 border-gray-700/50 backdrop-blur-xl rounded-2xl border shadow-xl"
                        bodyStyle={{ padding: 0 }}
                    >
                        <List
                            dataSource={batches.slice(0, 5)}
                            renderItem={(batch, index) => (
                                <List.Item
                                    className="px-6 py-5 hover:bg-white/5 border-b border-gray-700/50 last:border-0 transition-all cursor-pointer group"
                                    onClick={() => navigate(`/admin/batches/${batch.id}/edit`)}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <div
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transform group-hover:scale-110 transition-transform"
                                                style={{ background: `linear-gradient(135deg, ${batch.color || '#4F46E5'} 0%, ${batch.color || '#4F46E5'}88 100%)` }}
                                            >
                                                {batch.name.charAt(0)}
                                            </div>
                                        }
                                        title={<span className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors">{batch.name}</span>}
                                        description={<span className="text-gray-400 text-sm line-clamp-1">{batch.description || 'No description provided for this batch.'}</span>}
                                    />
                                    <div className="flex items-center gap-8">
                                        <div className="hidden md:flex flex-col items-end">
                                            <p className="text-white font-black text-lg m-0">{batch.students || 0}</p>
                                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter">Students</p>
                                        </div>
                                        <Tag color={batch.status === 'active' ? 'green' : 'red'} className="border-0 uppercase text-[10px] font-black px-3 py-1 rounded-md shadow-sm">
                                            {batch.status}
                                        </Tag>
                                        <RightOutlined className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                </List.Item>
                            )}
                            locale={{
                                emptyText: <div className="py-20 text-gray-500 italic flex flex-col items-center gap-4">
                                    <TeamOutlined style={{ fontSize: 40, opacity: 0.3 }} />
                                    <span>No batches found in the system.</span>
                                </div>
                            }}
                        />
                    </Card>
                </div>
            </div>

            <style jsx>{`
                .animate-fadeIn {
                    animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .underline-primary {
                    position: relative;
                }
                .underline-primary::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 40px;
                    height: 4px;
                    background: #4F46E5;
                    border-radius: 2px;
                }
            `}</style>
        </AdminLayout>
    )
}

export default Dashboard
