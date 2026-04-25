import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Typography, Space, Button, Spin, Tag, List, Tabs, Divider, Badge, Empty } from 'antd'
import {
    PlayCircleOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    ArrowLeftOutlined,
    DownloadOutlined,
    PlaySquareOutlined,
    FolderOpenOutlined,
    RightOutlined,
    BookOutlined
} from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import UserLayout from '@components/common/UserLayout'
import { API_BASE_URL } from '@/constants'

const { Title, Text } = Typography
const { TabPane } = Tabs

const SubjectHub = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [subject, setSubject] = useState(null)
    const [content, setContent] = useState([])
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true)
            try {
                // 1. Get Subject Info
                const subRes = await fetch(`${API_BASE_URL}/subjects/list.php`)
                const subData = await subRes.json()
                const found = subData.find(s => s.id.toString() === id.toString())
                setSubject(found)

                // 2. Get Videos (grouped by topic)
                const vidRes = await fetch(`${API_BASE_URL}/videos/by_subject.php?subjectId=${id}`)
                const vidData = await vidRes.json()
                setContent(Array.isArray(vidData) ? vidData : [])

                // 3. Get Notes
                const notesRes = await fetch(`${API_BASE_URL}/notes/index.php`)
                const notesData = await notesRes.json()
                const filteredNotes = Array.isArray(notesData) 
                    ? notesData.filter(n => n.subject_id?.toString() === id.toString())
                    : []
                setNotes(filteredNotes)

            } catch (error) {
                console.error('Error fetching subject details:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [id])

    // Helper to group notes by topic name
    const groupedNotes = notes.reduce((acc, note) => {
        const topicName = note.topic_name || 'Other Materials'
        if (!acc[topicName]) acc[topicName] = []
        acc[topicName].push(note)
        return acc
    }, {})

    const totalLectures = content.reduce((acc, t) => acc + (t.videos?.length || 0), 0)

    return (
        <UserLayout>
            <div className="min-h-screen pb-20 animate-fadeIn">
                {/* Back Button & Header */}
                <div className="space-y-6 mb-10">
                    <Button 
                        type="text" 
                        icon={<ArrowLeftOutlined />} 
                        className="text-gray-400 hover:text-white bg-white/5 px-4 rounded-full border border-white/10"
                        onClick={() => navigate(`/user/subjects?batchId=${subject?.batch_id}`)}
                    >
                        Back to Subjects
                    </Button>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Tag color="indigo" className="bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold px-3 py-0.5 rounded-lg uppercase tracking-widest text-[9px]">
                                {subject?.batch_name || 'COURSE CONTENT'}
                            </Tag>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            {subject?.name || 'Loading...'}
                        </h1>
                        <div className="flex items-center gap-4 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><PlaySquareOutlined className="text-indigo-400" /> {totalLectures} Lectures</span>
                            <span className="flex items-center gap-1.5"><FileTextOutlined className="text-purple-400" /> {notes.length} Materials</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Spin size="large" /></div>
                ) : (
                    <Tabs defaultActiveKey="lectures" className="custom-dashboard-tabs">
                        <TabPane 
                            tab={<span className="flex items-center gap-2 px-2"><PlaySquareOutlined /> Lectures</span>} 
                            key="lectures"
                        >
                            <div className="pt-8 space-y-12">
                                {content.some(t => t.videos?.length > 0) ? content.map((topic) => (
                                    topic.videos?.length > 0 && (
                                        <div key={topic.id} className="space-y-6">
                                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 text-sm">
                                                        <FolderOpenOutlined />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-xl font-bold text-white m-0">{topic.name}</h2>
                                                        <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mt-0.5">CHAPTER CONTENT</p>
                                                    </div>
                                                </div>
                                                <Badge count={`${topic.videos.length} Videos`} style={{ backgroundColor: '#6366f1', fontSize: '10px' }} />
                                            </div>

                                            <div className="grid grid-cols-1 gap-3">
                                                {topic.videos.map((vid) => (
                                                    <div 
                                                        key={vid.id}
                                                        className="group flex flex-col md:flex-row items-center gap-4 p-4 rounded-3xl bg-gray-800/15 border border-white/5 hover:bg-gray-800/30 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
                                                        onClick={() => navigate(`/user/videos?subjectId=${id}&videoId=${vid.id}`)}
                                                    >
                                                        <div className="relative w-full md:w-44 aspect-video rounded-xl overflow-hidden shadow-xl">
                                                            <img src={vid.thumbnail_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                                                            <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <PlayCircleOutlined className="text-4xl text-white" />
                                                            </div>
                                                            <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 backdrop-blur-md rounded text-[9px] font-black text-white">
                                                                45:00
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                                                                {vid.title}
                                                            </h3>
                                                            <div className="flex items-center gap-3">
                                                                <Tag className="bg-white/5 border-white/10 text-gray-500 rounded-md px-2 py-0 text-[9px] font-black">RECORDED</Tag>
                                                                <span className="flex items-center gap-1 text-gray-600 text-[10px] font-bold uppercase"><ClockCircleOutlined /> 2 days ago</span>
                                                            </div>
                                                        </div>
                                                        <Button 
                                                            shape="circle" 
                                                            size="small"
                                                            icon={<RightOutlined className="text-[10px]" />} 
                                                            className="hidden md:flex border-0 bg-white/5 text-white hover:bg-indigo-600 hover:text-white" 
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                )) : (
                                    <div className="py-20 text-center">
                                        <Empty description={<span className="text-gray-500">No lectures found for this subject.</span>} />
                                    </div>
                                )}
                            </div>
                        </TabPane>
                        
                        <TabPane 
                            tab={<span className="flex items-center gap-2 px-4"><FileTextOutlined /> Study Notes</span>} 
                            key="notes"
                        >
                            <div className="pt-10 space-y-16">
                                {Object.keys(groupedNotes).length > 0 ? Object.entries(groupedNotes).map(([topicName, topicNotes]) => (
                                    <div key={topicName} className="space-y-8">
                                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                                <BookOutlined />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white m-0">{topicName}</h2>
                                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">RESOURCES</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {topicNotes.map((note) => (
                                                <Card 
                                                    key={note.id}
                                                    className="bg-gray-800/20 border-white/5 rounded-3xl hover:bg-gray-800/40 transition-all border group hover:border-purple-500/30"
                                                    bodyStyle={{ padding: '24px' }}
                                                >
                                                    <div className="space-y-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-3xl text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                                                            <FileTextOutlined />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white font-bold text-lg mb-1 line-clamp-2 min-h-[3.5rem]">{note.title}</h3>
                                                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">PDF DOCUMENT • 2.4 MB</p>
                                                        </div>
                                                        <Button 
                                                            type="primary" 
                                                            icon={<DownloadOutlined />}
                                                            href={note.file_url}
                                                            target="_blank"
                                                            className="bg-purple-600 border-0 rounded-2xl font-bold hover:bg-purple-700 h-12"
                                                            block
                                                        >
                                                            DOWNLOAD
                                                        </Button>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center">
                                        <Empty description={<span className="text-gray-500">No study notes available.</span>} />
                                    </div>
                                )}
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

export default SubjectHub
