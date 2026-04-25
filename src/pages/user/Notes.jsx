import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Input, Button, Tag, Select, Empty, Spin } from 'antd'
import { SearchOutlined, DownloadOutlined, FileTextOutlined, FilterOutlined } from '@ant-design/icons'
import UserLayout from '@components/common/UserLayout'
import Aurora from '@/Aurora'
import { API_BASE_URL } from '@/constants'

import { useNavigate, useSearchParams } from 'react-router-dom'

const UserNotes = () => {
    const [searchParams] = useSearchParams()
    const subjectIdFromUrl = searchParams.get('subjectId')

    const [notes, setNotes] = useState([])
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSubject, setSelectedSubject] = useState(subjectIdFromUrl || 'all')

    useEffect(() => {
        if (subjectIdFromUrl) {
            setSelectedSubject(subjectIdFromUrl)
        }
    }, [subjectIdFromUrl])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [notesRes, subRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/notes/index.php`),
                    fetch(`${API_BASE_URL}/subjects/list.php`)
                ])
                setNotes(await notesRes.json())
                setSubjects(await subRes.json())
            } catch (error) {
                console.error('Error fetching notes:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSubject = selectedSubject === 'all' || note.subject_id?.toString() === selectedSubject.toString()
        return matchesSearch && matchesSubject
    })

    const getFileIcon = (type) => {
        return <FileTextOutlined className="text-3xl text-indigo-400" />
    }

    return (
        <UserLayout>
            <div className="relative z-10 space-y-8 animate-fadeIn">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Study Materials</h1>
                    <p className="text-gray-400">Access and download your course notes, PDFs, and resources.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 bg-gray-900/50 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
                    <div className="flex-1">
                        <Input
                            placeholder="Search notes title..."
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
                ) : filteredNotes.length > 0 ? (
                    <Row gutter={[20, 20]}>
                        {filteredNotes.map((note) => (
                            <Col xs={24} sm={12} lg={8} key={note.id}>
                                <Card
                                    hoverable
                                    className="bg-gray-800/40 border-gray-700/50 backdrop-blur-xl rounded-2xl group border shadow-xl hover:-translate-y-1 transition-all"
                                    bodyStyle={{ padding: '24px' }}
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="w-16 h-16 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                                            {getFileIcon(note.file_type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Tag color="blue" className="mb-2 border-0 bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                                                {note.subject_name || 'General'}
                                            </Tag>
                                            <h3 className="text-white text-lg font-bold mb-1 line-clamp-1">{note.title}</h3>
                                            <p className="text-gray-400 text-xs mb-4">{note.batch_name}</p>
                                            <Button
                                                type="primary"
                                                icon={<DownloadOutlined />}
                                                block
                                                className="bg-indigo-600 border-0 hover:bg-indigo-700 h-10 rounded-lg font-bold"
                                                href={note.file_url}
                                                target="_blank"
                                            >
                                                Download {note.file_type.toUpperCase()}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Empty description={<span className="text-gray-500">No study materials found.</span>} />
                )}
            </div>
        </UserLayout>
    )
}

export default UserNotes
