import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Tag, Button, Empty, Spin, Typography, Space, Tabs, Badge } from 'antd'
import { 
    BookOutlined, 
    RightOutlined, 
    ArrowLeftOutlined, 
    ClockCircleOutlined, 
    GlobalOutlined,
    NotificationOutlined,
    PlayCircleOutlined,
    InfoCircleOutlined,
    CalendarOutlined
} from '@ant-design/icons'
import UserLayout from '@components/common/UserLayout'
import { API_BASE_URL } from '@/constants'
import { useNavigate, useSearchParams } from 'react-router-dom'

const { Title, Text } = Typography
const { TabPane } = Tabs

const UserSubjects = () => {
    const [batchData, setBatchData] = useState(null)
    const [subjects, setSubjects] = useState([])
    const [timetable, setTimetable] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const batchIdFromUrl = searchParams.get('batchId')

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                if (batchIdFromUrl) {
                    const [subRes, batchRes, timeRes] = await Promise.all([
                        fetch(`${API_BASE_URL}/subjects/list.php`),
                        fetch(`${API_BASE_URL}/batches/list.php`),
                        fetch(`${API_BASE_URL}/live-classes/index.php?batchId=${batchIdFromUrl}`)
                    ])

                    const allSubjects = await subRes.json()
                    const allBatches = await batchRes.json()
                    const timeData = await timeRes.json()

                    const currentBatch = allBatches.find(b => b.id.toString() === batchIdFromUrl.toString())
                    const filteredSubjects = allSubjects.filter(sub => sub.batch_id?.toString() === batchIdFromUrl.toString())

                    setBatchData(currentBatch)
                    setSubjects(filteredSubjects)
                    setTimetable(Array.isArray(timeData) ? timeData : [])
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [batchIdFromUrl])

    if (!batchIdFromUrl && !loading) {
        return (
            <UserLayout>
                <div className="text-center py-20">
                    <Title level={2} className="!text-white">Select a Batch First</Title>
                    <Button type="primary" onClick={() => navigate('/user/my-batches')}>Go to My Batches</Button>
                </div>
            </UserLayout>
        )
    }

    const liveNowCount = timetable.filter(t => t.status === 'live').length

    return (
        <UserLayout>
            <div className="min-h-screen pb-20 animate-fadeIn">
                {/* Header Section */}
                <div className="space-y-8 mb-12">
                    <Button 
                        type="text" 
                        icon={<ArrowLeftOutlined />} 
                        className="text-gray-400 hover:text-white bg-white/5 px-4 rounded-full border border-white/10"
                        onClick={() => {
                            const brand = batchData?.brand || localStorage.getItem('selected_institution');
                            if (brand === 'NT' || brand === 'nexttoppers') {
                                navigate('/nexttoppers/dashboard');
                            } else {
                                navigate('/user/my-batches');
                            }
                        }}
                    >
                        Back
                    </Button>

                    <div className="space-y-4">
                        <Tag color="blue" className="bg-blue-500/10 border-blue-500/20 text-blue-400 font-bold px-3 py-0.5 rounded-lg uppercase tracking-widest text-[9px]">
                            ✦ BATCH DASHBOARD
                        </Tag>
                        
                        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight leading-tight">
                            {batchData?.name || 'Batch Details'}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/40 border border-white/5 rounded-xl">
                                <BookOutlined className="text-green-400 text-xs" />
                                <span className="text-white font-bold text-xs">{subjects.length} Subjects</span>
                            </div>
                            
                            {liveNowCount > 0 && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-xl animate-pulse">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"></div>
                                    <span className="text-red-400 font-bold text-xs">{liveNowCount} Live Now</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/40 border border-white/5 rounded-xl">
                                <CalendarOutlined className="text-blue-400 text-xs" />
                                <span className="text-white font-bold text-xs">Today's Classes</span>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/40 border border-white/5 rounded-xl">
                                <NotificationOutlined className="text-pink-400 text-xs" />
                                <span className="text-white font-bold text-xs">20 Updates</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                {loading ? (
                    <div className="flex justify-center py-20"><Spin size="large" /></div>
                ) : (
                    <Tabs defaultActiveKey="subjects" className="custom-dashboard-tabs">
                        <TabPane 
                            tab={<span className="flex items-center gap-2 px-2"><InfoCircleOutlined className="text-xs" /> Overview</span>} 
                            key="overview"
                        >
                            <div className="pt-6 max-w-3xl">
                                <Card className="bg-gray-800/20 border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
                                    <div className="space-y-5 p-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 text-xs">
                                                <CalendarOutlined />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-0.5">Course Duration</p>
                                                <p className="text-blue-400 font-bold text-sm">13 April 2026 - 30 November 2026</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 text-xs">
                                                <PlayCircleOutlined />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-0.5">Validity</p>
                                                <p className="text-amber-400 font-bold text-sm">31 March 2027</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-3 border-t border-white/5">
                                            {['Exam guidance at our PW Offline centers', 'One-to-one emotional well-being support', 'In-person support and helpdesk at PW'].map((text, i) => (
                                                <div key={i} className="flex items-center gap-3 text-gray-400">
                                                    <div className="text-amber-500 text-[10px]">✦</div>
                                                    <span className="text-xs font-medium">{text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </TabPane>

                        <TabPane 
                            tab={
                                <Badge count={liveNowCount} size="small" offset={[10, 0]}>
                                    <span className="flex items-center gap-2 px-4 text-white"><PlayCircleOutlined /> Live Today</span>
                                </Badge>
                            } 
                            key="live"
                        >
                            <div className="pt-8">
                                <Row gutter={[20, 20]}>
                                    {timetable.length > 0 ? timetable.map((item) => (
                                        <Col xs={24} md={12} lg={8} key={item.id}>
                                            <Card className="bg-gray-800/40 border-white/5 rounded-3xl hover:border-indigo-500/30 transition-all group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <Tag color={item.status === 'live' ? 'error' : 'blue'} className="rounded-full px-4 border-0 font-black text-[10px]">
                                                        {item.status?.toUpperCase()}
                                                    </Tag>
                                                    <Text className="text-gray-500 text-xs">{new Date(item.scheduled_at).toLocaleDateString()}</Text>
                                                </div>
                                                <h3 className="text-white font-bold text-xl mb-2 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                                                <p className="text-gray-400 text-sm mb-6">{item.instructor}</p>
                                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                    <span className="text-indigo-400 font-bold">{new Date(item.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    {item.status === 'live' && (
                                                        <Button type="primary" shape="round" className="bg-indigo-600 border-0 font-bold" onClick={() => window.open(item.meeting_link, '_blank')}>
                                                            JOIN LIVE
                                                        </Button>
                                                    )}
                                                </div>
                                            </Card>
                                        </Col>
                                    )) : (
                                        <Col span={24}><Empty description={<span className="text-gray-500">No classes scheduled for today.</span>} /></Col>
                                    )}
                                </Row>
                            </div>
                        </TabPane>

                        <TabPane 
                            tab={<span className="flex items-center gap-2 px-4"><BookOutlined /> Subjects <Badge count={subjects.length} className="ml-1" style={{ backgroundColor: '#4f46e5' }} /></span>} 
                            key="subjects"
                        >
                            <div className="pt-8">
                                <Row gutter={[24, 24]}>
                                    {subjects.length > 0 ? subjects.map((subject) => (
                                        <Col xs={24} sm={12} lg={8} key={subject.id}>
                                            <Card
                                                hoverable
                                                className="bg-gray-800/20 border-white/5 backdrop-blur-md rounded-[2.5rem] group border shadow-2xl hover:border-indigo-500/50 transition-all duration-500 overflow-hidden"
                                                bodyStyle={{ padding: '40px' }}
                                                onClick={() => navigate(`/user/subjects/${subject.id}`)}
                                            >
                                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-all duration-700 rotate-12 group-hover:rotate-0">
                                                    <BookOutlined className="text-[80px] text-white" />
                                                </div>

                                                <div className="relative z-10 space-y-6">
                                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                                        <BookOutlined className="text-4xl text-indigo-400" />
                                                    </div>

                                                    <div>
                                                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                                            {subject.name}
                                                        </h3>
                                                        <Text className="text-gray-500 text-xs font-black uppercase tracking-widest">
                                                            SUBJECT MODULE
                                                        </Text>
                                                    </div>

                                                    <div className="pt-4">
                                                        <Button 
                                                            block 
                                                            className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold hover:bg-indigo-600 hover:border-indigo-600 transition-all flex items-center justify-center gap-3"
                                                        >
                                                            ACCESS RESOURCES <RightOutlined className="text-xs" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Col>
                                    )) : (
                                        <Col span={24}><Empty description={<span className="text-gray-500">No subjects found.</span>} /></Col>
                                    )}
                                </Row>
                            </div>
                        </TabPane>
                    </Tabs>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-dashboard-tabs .ant-tabs-nav {
                    margin-bottom: 0 !important;
                }
                .custom-dashboard-tabs .ant-tabs-tab {
                    padding: 16px 0 !important;
                    margin: 0 40px 0 0 !important;
                    color: rgba(255,255,255,0.4) !important;
                    font-weight: 700 !important;
                    font-size: 15px !important;
                    transition: all 0.3s ease !important;
                }
                .custom-dashboard-tabs .ant-tabs-tab-active {
                    color: #fff !important;
                }
                .custom-dashboard-tabs .ant-tabs-ink-bar {
                    background: #6366f1 !important;
                    height: 4px !important;
                    border-radius: 4px 4px 0 0;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            ` }} />
        </UserLayout>
    )
}

export default UserSubjects
