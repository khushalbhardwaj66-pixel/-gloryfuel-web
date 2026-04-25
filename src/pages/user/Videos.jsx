import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Input, Button, Tag, Select, Empty, Spin, Modal } from 'antd'
import { SearchOutlined, PlayCircleOutlined, FilterOutlined } from '@ant-design/icons'
import UserLayout from '@components/common/UserLayout'
import Aurora from '@/Aurora'
import { API_BASE_URL } from '@/constants'

import { useNavigate, useSearchParams } from 'react-router-dom'

const UserVideos = () => {
    const [searchParams] = useSearchParams()
    const subjectIdFromUrl = searchParams.get('subjectId')

    const [videos, setVideos] = useState([])
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSubject, setSelectedSubject] = useState(subjectIdFromUrl || 'all')
    const [currentVideo, setCurrentVideo] = useState(null)

    useEffect(() => {
        if (subjectIdFromUrl) {
            setSelectedSubject(subjectIdFromUrl)
        }
    }, [subjectIdFromUrl])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [vidRes, subRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/videos/list.php`),
                    fetch(`${API_BASE_URL}/subjects/list.php`)
                ])
                setVideos(await vidRes.json())
                setSubjects(await subRes.json())
            } catch (error) {
                console.error('Error fetching videos:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const filteredVideos = videos.filter(video => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSubject = selectedSubject === 'all' || video.subject_id.toString() === selectedSubject.toString()
        return matchesSearch && matchesSubject
    })

    return (
        <UserLayout>
            <div className="relative z-10 space-y-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Video Library</h1>
                        <p className="text-gray-400">Watch and learn from our curated video lessons.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 bg-gray-900/50 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                    <div className="flex-1">
                        <Input
                            placeholder="Search video title..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            className="h-12"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select
                        className="w-full md:w-64 h-12"
                        value={selectedSubject}
                        onChange={setSelectedSubject}
                        suffixIcon={<FilterOutlined />}
                    >
                        <Select.Option value="all">All Subjects</Select.Option>
                        {subjects.map(sub => (
                            <Select.Option key={sub.id} value={sub.id}>{sub.name}</Select.Option>
                        ))}
                    </Select>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : filteredVideos.length > 0 ? (
                    <Row gutter={[24, 24]}>
                        {filteredVideos.map((video, index) => (
                            <Col xs={24} sm={12} lg={8} key={video.id}>
                                <Card
                                    hoverable
                                    className="bg-gray-800/40 border-gray-700/50 backdrop-blur-xl rounded-2xl overflow-hidden group border shadow-xl"
                                    bodyStyle={{ padding: '20px' }}
                                    cover={
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={video.thumbnail_url || 'https://via.placeholder.com/640x360?text=No+Thumbnail'}
                                                alt={video.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Button
                                                    type="primary"
                                                    shape="circle"
                                                    icon={<PlayCircleOutlined className="text-2xl" />}
                                                    size="large"
                                                    onClick={() => setCurrentVideo(video)}
                                                    className="h-16 w-16"
                                                />
                                            </div>
                                            <div className="absolute top-4 left-4">
                                                <Tag color="indigo" className="m-0 border-0 bg-indigo-600/80 backdrop-blur-md font-bold px-3 py-1 rounded-lg">
                                                    {video.subject_name}
                                                </Tag>
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                                            {video.title}
                                        </h3>
                                        <div className="flex items-center justify-between text-gray-400 text-sm">
                                            <span>Lesson Video</span>
                                            <Button type="link" className="p-0 text-indigo-400 font-bold" onClick={() => setCurrentVideo(video)}>
                                                Watch Now
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Empty description={<span className="text-gray-500">No videos found matching your search.</span>} />
                )}
            </div>

            {/* Video Player Modal */}
            <Modal
                title={currentVideo?.title || 'Video Player'}
                open={!!currentVideo}
                onCancel={() => setCurrentVideo(null)}
                footer={null}
                width={1000}
                centered
                destroyOnClose
                bodyStyle={{ padding: 0, height: '70vh' }}
            >
                {currentVideo && (
                    <iframe
                        src={currentVideo.video_url.replace('https://rolexcoderz.in/RC/player/', `${API_BASE_URL}/player_proxy.php`)}
                        className="w-full h-full border-0 rounded-b-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                )}
            </Modal>
        </UserLayout>
    )
}

export default UserVideos
