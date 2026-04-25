import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Input, Button, Tag } from 'antd'
import { SearchOutlined, RightOutlined, ProjectOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import UserLayout from '@components/common/UserLayout'
import { selectAllBatches, fetchBatches } from '@/store/slices/batchSlice'
import { useNavigate } from 'react-router-dom'

const MyBatches = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const batches = useSelector(selectAllBatches)
    const [searchTerm, setSearchTerm] = useState('')

    // Fetch batches from database on component mount
    useEffect(() => {
        dispatch(fetchBatches())
    }, [dispatch])

    // Filter real batches from DB - Exclude NextToppers
    const filteredBatches = batches.filter(batch =>
        batch.brand === 'PW' &&
        batch.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Enhanced color palette
    const getEnhancedColor = (originalColor) => {
        const colorMap = {
            '#4F46E5': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple gradient
            '#10B981': 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // Green gradient
            '#F59E0B': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink gradient
            '#EC4899': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Warm gradient
            '#8B5CF6': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue gradient
            '#06B6D4': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', // Cyan gradient
        }
        return colorMap[originalColor] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }

    // Helper to transform Google Drive share links to direct image links
    const getDirectImageUrl = (url) => {
        if (!url) return null;
        if (url.includes('drive.google.com')) {
            const id = url.match(/[-\w]{25,}/);
            return id ? `https://drive.google.com/uc?export=view&id=${id[0]}` : url;
        }
        return url;
    }

    return (
        <UserLayout>


            <div className="space-y-6 relative z-10">
                {/* Animated Header */}
                <div className="animate-fadeIn">
                    <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
                        Batches
                    </h1>
                    <p className="text-gray-400">Discover and explore your courses</p>
                </div>

                {/* Enhanced Search Bar with Animation */}
                <div className="flex gap-3 animate-slideInUp">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Search Your Batch"
                            prefix={<SearchOutlined className="text-gray-400" />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="large"
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 search-input"
                            style={{
                                backgroundColor: '#1f2937',
                                borderColor: '#374151',
                                color: 'white'
                            }}
                        />
                    </div>
                </div>

                {/* Batch Grid with Stagger Animation */}
                <Row gutter={[24, 24]}>
                    {filteredBatches.map((batch, index) => {
                        const banner = getDirectImageUrl(batch.banner_url || batch.bannerUrl);
                        return (
                            <Col
                                xs={24}
                                sm={12}
                                lg={8}
                                xl={6}
                                key={batch.id}
                                className="batch-card-col"
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <Card
                                    hoverable
                                    className="batch-card bg-gray-900 border-gray-700/50 backdrop-blur-xl group h-full overflow-hidden"
                                    bodyStyle={{ padding: 0 }}
                                    onClick={() => navigate(`/user/subjects?batchId=${batch.id}`)}
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        {/* Gradient Overlay for Text Readability */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>

                                        {banner ? (
                                            <img
                                                src={banner}
                                                alt={batch.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/640x360?text=Invalid+Banner+URL';
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="w-full h-full flex items-center justify-center"
                                                style={{ background: getEnhancedColor(batch.color || '#4F46E5') }}
                                            >
                                                <div className="shimmer opacity-20"></div>
                                                <ProjectOutlined className="text-6xl text-white/20" />
                                            </div>
                                        )}

                                        <div className="absolute top-4 right-4 z-20">
                                            <Tag color={batch.status === 'active' ? 'green' : 'gray'} className="m-0 border-0 bg-black/40 backdrop-blur-md px-3 font-bold">
                                                {batch.status?.toUpperCase() || 'ACTIVE'}
                                            </Tag>
                                        </div>

                                        <div className="absolute bottom-4 left-6 z-20 pr-4">
                                            <h3 className="text-white text-xl font-black tracking-tight drop-shadow-2xl">
                                                {batch.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 h-10">
                                            {batch.description || 'Access all your course contents, live sessions and recordings here.'}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-widest pt-2 border-t border-white/5">
                                            <span>Course Access</span>
                                            <span className="text-indigo-400">View Modules</span>
                                        </div>

                                        <Button
                                            type="primary"
                                            block
                                            size="large"
                                            className="h-12 font-bold rounded-xl border-0 shadow-lg"
                                            style={{
                                                background: getEnhancedColor(batch.color || '#4F46E5'),
                                            }}
                                            icon={<RightOutlined />}
                                            iconPosition="end"
                                        >
                                            Enter Batch
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>

                {filteredBatches.length === 0 && (
                    <div className="text-center py-16 animate-fadeIn">
                        <p className="text-gray-400 text-lg">No batches found</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                /* Card Animations */
                .batch-card-col {
                    animation: slideInUp 0.6s ease-out forwards;
                    opacity: 0;
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out;
                }

                .animate-slideInUp {
                    animation: slideInUp 0.6s ease-out 0.2s backwards;
                }

                /* Enhanced Card Styling */
                .batch-card {
                    border-radius: 12px;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .batch-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(102, 126, 234, 0.3);
                    border-color: rgba(102, 126, 234, 0.3);
                }

                /* Shimmer Effect */
                .shimmer {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.1) 50%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    transform: rotate(25deg);
                    animation: shimmer 3s infinite;
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%) rotate(25deg); }
                    100% { transform: translateX(100%) rotate(25deg); }
                }

                /* Search Input Animations */
                .search-input {
                    transition: all 0.3s ease;
                }

                .search-input:focus {
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
                    border-color: #667eea !important;
                }

                /* Utility Classes */
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </UserLayout>
    )
}

export default MyBatches
