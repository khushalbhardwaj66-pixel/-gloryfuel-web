import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, List, Tag, Spin } from 'antd'
import {
    BookOutlined,
    VideoCameraOutlined,
    FileTextOutlined,
    CalendarOutlined,
    ArrowRightOutlined,
    PlayCircleOutlined
} from '@ant-design/icons'
import UserLayout from '@components/common/UserLayout'
import { API_BASE_URL } from '@/constants'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

const Dashboard = () => {
    const [stats, setStats] = useState({ batches: 0, live: 0, notes: 0, subjects: 0 })
    const [recentLive, setRecentLive] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true)
            try {
                const [liveRes, noteRes, batchRes, subRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/live-classes/index.php`),
                    fetch(`${API_BASE_URL}/notes/index.php`),
                    fetch(`${API_BASE_URL}/batches/list.php`),
                    fetch(`${API_BASE_URL}/subjects/list.php`)
                ])

                const liveData = await liveRes.json()
                const noteData = await noteRes.json()
                const batchData = await batchRes.json()
                const subData = await subRes.json()

                setStats({
                    batches: batchData.length,
                    live: liveData.filter(c => c.status === 'live').length,
                    notes: noteData.length,
                    subjects: subData.length
                })
                setRecentLive(liveData.slice(0, 3))
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    return (
        <UserLayout>
            <div className="space-y-8 animate-fadeIn">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2">My Learning Portal</h1>
                        <p className="text-gray-400">Track your progress and access your study resources.</p>
                    </div>
                    <div className="hidden md:block">
                        <Tag color="indigo" className="px-4 py-1 rounded-full border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-bold">
                            Level: Intermediate Student
                        </Tag>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Spin size="large" /></div>
                ) : (
                    <>
                        {/* Interactive Stat Cards */}
                        <Row gutter={[20, 20]}>
                            <Col xs={24} sm={12} lg={6}>
                                <Card className="bg-gradient-to-br from-indigo-600/20 to-indigo-900/40 border-indigo-500/20 rounded-2xl overflow-hidden group hover:border-indigo-500/50 transition-all">
                                    <Statistic
                                        title={<span className="text-indigo-300 font-bold uppercase tracking-widest text-xs">My Batches</span>}
                                        value={stats.batches}
                                        prefix={<BookOutlined className="mr-2 text-indigo-400" />}
                                        valueStyle={{ color: '#fff', fontWeight: '800', fontSize: '2.5rem' }}
                                    />
                                    <Link to="/user/my-batches" className="text-indigo-400 text-xs font-bold mt-4 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                        VIEW ALL <ArrowRightOutlined />
                                    </Link>
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <Card className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/40 border-emerald-500/20 rounded-2xl overflow-hidden group hover:border-emerald-500/50 transition-all">
                                    <Statistic
                                        title={<span className="text-emerald-300 font-bold uppercase tracking-widest text-xs">Total Subjects</span>}
                                        value={stats.subjects}
                                        prefix={<CalendarOutlined className="mr-2 text-emerald-400" />}
                                        valueStyle={{ color: '#fff', fontWeight: '800', fontSize: '2.5rem' }}
                                    />
                                    <Link to="/user/subjects" className="text-emerald-400 text-xs font-bold mt-4 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                        EXPLORE CURRICULUM <ArrowRightOutlined />
                                    </Link>
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <Card className="bg-gradient-to-br from-rose-600/20 to-rose-900/40 border-rose-500/20 rounded-2xl overflow-hidden group hover:border-rose-500/50 transition-all">
                                    <Statistic
                                        title={<span className="text-rose-300 font-bold uppercase tracking-widest text-xs">Live Now</span>}
                                        value={stats.live}
                                        prefix={<VideoCameraOutlined className="mr-2 text-rose-400" />}
                                        valueStyle={{ color: '#fff', fontWeight: '800', fontSize: '2.5rem' }}
                                    />
                                    <Link to="/user/live-classes" className="text-rose-400 text-xs font-bold mt-4 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                        JOIN SESSIONS <ArrowRightOutlined />
                                    </Link>
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <Card className="bg-gradient-to-br from-amber-600/20 to-amber-900/40 border-amber-500/20 rounded-2xl overflow-hidden group hover:border-amber-500/50 transition-all">
                                    <Statistic
                                        title={<span className="text-amber-300 font-bold uppercase tracking-widest text-xs">Study Notes</span>}
                                        value={stats.notes}
                                        prefix={<FileTextOutlined className="mr-2 text-amber-400" />}
                                        valueStyle={{ color: '#fff', fontWeight: '800', fontSize: '2.5rem' }}
                                    />
                                    <Link to="/user/notes" className="text-amber-400 text-xs font-bold mt-4 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                        DOWNLOAD PDFS <ArrowRightOutlined />
                                    </Link>
                                </Card>
                            </Col>
                        </Row>

                        {/* Recent Activity Sections */}
                        <Row gutter={[20, 20]}>
                            <Col xs={24} lg={16}>
                                <Card title="Next Live Sessions" className="bg-gray-800/40 border-gray-700/50 rounded-2xl backdrop-blur-md overflow-hidden">
                                    <List
                                        dataSource={recentLive}
                                        renderItem={item => (
                                            <List.Item className="border-gray-700/50 py-4 px-2 hover:bg-white/5 transition-colors rounded-xl m-1">
                                                <List.Item.Meta
                                                    avatar={
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.status === 'live' ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                                            <PlayCircleOutlined className="text-xl" />
                                                        </div>
                                                    }
                                                    title={<span className="text-white font-bold">{item.title}</span>}
                                                    description={<span className="text-gray-400">{item.batch_name} • {item.instructor}</span>}
                                                />
                                                <div className="text-right">
                                                    <div className="text-white font-bold text-xs mb-1">{dayjs(item.scheduled_at).format('DD MMM, h:mm A')}</div>
                                                    {item.status === 'live' ? <Tag color="error">LIVE</Tag> : <Tag color="blue">Upcoming</Tag>}
                                                </div>
                                            </List.Item>
                                        )}
                                        locale={{ emptyText: <span className="text-gray-500">No scheduled classes found</span> }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Card title="Quick Resources" className="bg-gray-800/40 border-gray-700/50 rounded-2xl backdrop-blur-md">
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all cursor-pointer group">
                                            <h4 className="text-white font-bold mb-1 group-hover:text-indigo-400">Class Timetable</h4>
                                            <p className="text-gray-400 text-xs">Verify your upcoming schedule for the week.</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group">
                                            <h4 className="text-white font-bold mb-1 group-hover:text-emerald-400">Recorded Videos</h4>
                                            <p className="text-gray-400 text-xs">Access past lessons and revision materials.</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer group">
                                            <h4 className="text-white font-bold mb-1 group-hover:text-amber-400">My Profile</h4>
                                            <p className="text-gray-400 text-xs">Update your information and preferences.</p>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </div>
        </UserLayout>
    )
}

export default Dashboard
