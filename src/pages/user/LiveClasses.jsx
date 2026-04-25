import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Tag, Button, Empty, Spin, message } from 'antd'
import { VideoCameraOutlined, ClockCircleOutlined, UserOutlined, RightOutlined } from '@ant-design/icons'
import UserLayout from '@components/common/UserLayout'
import Aurora from '@/Aurora'
import { API_BASE_URL } from '@/constants'
import dayjs from 'dayjs'

import { useNavigate, useSearchParams } from 'react-router-dom'

const UserLiveClasses = () => {
    const [searchParams] = useSearchParams()
    const subjectIdFromUrl = searchParams.get('subjectId')

    const [liveClasses, setLiveClasses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${API_BASE_URL}/live-classes/index.php`)
                const data = await res.json()
                setLiveClasses(data)
            } catch (error) {
                message.error('Failed to load live classes')
            } finally {
                setLoading(false)
            }
        }
        fetchClasses()
    }, [])

    const filteredClasses = liveClasses.filter(session => {
        if (!subjectIdFromUrl) return true;
        return session.subject_id?.toString() === subjectIdFromUrl.toString();
    })

    const getStatusTag = (status) => {
        switch (status) {
            case 'live': return <Tag color="error" className="animate-pulse border-0 px-3 py-1 font-black rounded-lg m-0">LIVE NOW</Tag>
            case 'upcoming': return <Tag color="processing" className="border-0 px-3 py-1 font-black rounded-lg m-0 text-blue-400 bg-blue-500/10">UPCOMING</Tag>
            default: return <Tag color="default" className="border-0 px-3 py-1 font-black rounded-lg m-0 opacity-50">ENDED</Tag>
        }
    }

    return (
        <UserLayout>
            <div className="relative z-10 space-y-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 underline-primary">Live Sessions</h1>
                        <p className="text-gray-400">Join real-time interactive classes with your instructors.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : filteredClasses.length > 0 ? (
                    <div className="space-y-6">
                        {filteredClasses.map((session) => (
                            <Card
                                key={session.id}
                                className="bg-gray-800/40 border-gray-700/50 backdrop-blur-xl rounded-2xl group border shadow-2xl hover:border-indigo-500/30 transition-all overflow-hidden"
                                bodyStyle={{ padding: 0 }}
                                onClick={() => session.status !== 'ended' && window.open(session.meeting_link, '_blank')}
                            >
                                <div className="flex flex-col md:flex-row items-stretch">
                                    <div className={`w-full md:w-3 px-1 ${session.status === 'live' ? 'bg-error' : 'bg-indigo-600'}`}></div>
                                    <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                {getStatusTag(session.status)}
                                                <Tag color="cyan" className="border-0 px-3 py-1 font-bold rounded-lg m-0 bg-cyan-500/10 text-cyan-400 capitalize">{session.batch_name}</Tag>
                                            </div>
                                            <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                                {session.title}
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-6 text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <UserOutlined className="text-indigo-400" />
                                                    <span className="font-medium">{session.instructor}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ClockCircleOutlined className="text-indigo-400" />
                                                    <span className="font-medium">{dayjs(session.scheduled_at).format('DD MMM, h:mm A')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<VideoCameraOutlined />}
                                                disabled={session.status === 'ended'}
                                                className={`h-14 px-8 rounded-xl font-bold text-lg border-0 shadow-lg transition-all ${session.status === 'live'
                                                    ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                                                    }`}
                                            >
                                                {session.status === 'live' ? 'Join Now' : 'Remind Me'}
                                            </Button>
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                                <RightOutlined className="text-gray-500 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Empty description={<span className="text-gray-500 text-lg">No live classes scheduled at the moment.</span>} />
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .underline-primary {
                    position: relative;
                }
                .underline-primary::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 60px;
                    height: 4px;
                    background: #4F46E5;
                    border-radius: 2px;
                }
            ` }} />
        </UserLayout>
    )
}

export default UserLiveClasses
