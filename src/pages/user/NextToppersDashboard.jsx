import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Typography, Tag, Space, Input, Badge, Spin, Empty } from 'antd'
import { 
    SearchOutlined,
    RightOutlined,
    FolderOpenOutlined,
    PlayCircleOutlined,
    FireOutlined,
    ThunderboltOutlined,
    BookOutlined,
    GlobalOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchBatches } from '@/store/slices/batchSlice'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const { Title, Text } = Typography

const NextToppersDashboard = () => {
    const [search, setSearch] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { items: allBatches, status } = useSelector(state => state.batches)
    
    useEffect(() => {
        dispatch(fetchBatches())
    }, [dispatch])

    const categories = [
        'ALL', 'CLASS 10TH', 'CLASS 8TH', 'CLASS 11TH PCMB', 'CLASS 11TH COMMERCE',
        'CLASS 11TH HUMANITIES', 'CLASS 12TH COMMERCE', 'CLASS 12TH PCMB', 'CLASS 9TH',
        'CLASS 12TH HUMANITIES'
    ]

    // Filter real batches from DB
    const batches = allBatches.filter(b => 
        b.brand === 'NT' && 
        (b.name.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="min-h-screen bg-[#0a0e14] text-white font-['Inter']">
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800;900&display=swap');
                
                body {
                    background-color: #0a0e14 !important;
                }

                .rc-header {
                    border-bottom: 2px solid #ff8c00;
                    padding: 20px 60px;
                    background: rgba(10, 14, 20, 0.95);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    backdrop-filter: blur(10px);
                }

                .rc-logo {
                    background: linear-gradient(135deg, #ff8c00, #ff4500);
                    color: white;
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-weight: 900;
                    font-size: 20px;
                    display: inline-block;
                    margin-right: 15px;
                }

                .rc-brand {
                    font-size: 24px;
                    font-weight: 900;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                .search-container {
                    max-width: 900px;
                    margin: 40px auto;
                    padding: 0 20px;
                }

                .rc-search {
                    background: #151a22 !important;
                    border: 1px solid #232a35 !important;
                    height: 60px !important;
                    border-radius: 12px !important;
                    color: white !important;
                    font-size: 16px !important;
                }

                .rc-search .ant-input {
                    background: transparent !important;
                    color: white !important;
                }

                .rc-search .ant-input::placeholder {
                    color: #4b5563 !important;
                    font-weight: 600;
                }

                .filter-container {
                    max-width: 1000px;
                    margin: 0 auto 40px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 12px;
                    padding: 0 20px;
                }

                .filter-tag {
                    background: #151a22;
                    border: 1px solid #232a35;
                    color: #9ca3af;
                    padding: 8px 20px;
                    border-radius: 30px;
                    font-weight: 800;
                    font-size: 11px;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-transform: uppercase;
                }

                .filter-tag.active {
                    border-color: #ff8c00;
                    color: #ff8c00;
                    background: rgba(255, 140, 0, 0.05);
                }

                .filter-tag:hover {
                    border-color: #ff8c00;
                }

                .stats-bar {
                    max-width: 1200px;
                    margin: 0 auto 30px;
                    padding: 0 60px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #232a35;
                    padding-bottom: 20px;
                }

                .stats-text {
                    font-size: 11px;
                    font-weight: 900;
                    color: #4b5563;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }

                .stats-text b {
                    color: #ff8c00;
                }

                .batch-card {
                    background: #151a22 !important;
                    border: 1px solid #232a35 !important;
                    border-radius: 20px !important;
                    overflow: hidden !important;
                    transition: all 0.3s !important;
                }

                .batch-card:hover {
                    border-color: #ff8c00 !important;
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }

                .batch-img-container {
                    height: 220px;
                    position: relative;
                    overflow: hidden;
                }

                .batch-img {
                    width: 100%;
                    height: 100%;
                    object-cover;
                }

                .price-tag {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(10, 14, 20, 0.8);
                    backdrop-filter: blur(5px);
                    padding: 5px 12px;
                    border-radius: 8px;
                    text-align: right;
                }

                .old-price {
                    text-decoration: line-through;
                    color: #9ca3af;
                    font-size: 10px;
                    display: block;
                }

                .new-price {
                    color: #ff8c00;
                    font-weight: 900;
                    font-size: 16px;
                }

                .batch-tag-overlay {
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    background: rgba(255, 140, 0, 0.1);
                    border: 1px solid rgba(255, 140, 0, 0.3);
                    color: #ff8c00;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 9px;
                    font-weight: 900;
                }

                .card-content {
                    padding: 20px;
                }

                .batch-title {
                    color: white;
                    font-size: 18px;
                    font-weight: 900;
                    margin-bottom: 15px;
                    line-height: 1.2;
                }

                .batch-meta {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 25px;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #6b7280;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                }

                .meta-item .anticon {
                    font-size: 12px;
                }

                .start-btn {
                    width: 100%;
                    height: 50px !important;
                    background: transparent !important;
                    border: 1px solid #232a35 !important;
                    color: #6b7280 !important;
                    font-weight: 900 !important;
                    font-size: 12px !important;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 20px !important;
                    border-radius: 12px !important;
                    transition: all 0.3s !important;
                }

                .batch-card:hover .start-btn {
                    border-color: #ff8c00 !important;
                    color: #ff8c00 !important;
                    background: rgba(255, 140, 0, 0.05) !important;
                }

                .arrow-circle {
                    width: 24px;
                    height: 24px;
                    border: 1px solid #232a35;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .batch-card:hover .arrow-circle {
                    border-color: #ff8c00;
                }
            ` }} />

            {/* Header */}
            <header className="rc-header">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="rc-logo">NT</div>
                        <span className="rc-brand">NEXT<span className="text-[#ff8c00]">TOPPERS</span></span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Badge count={0} showZero className="text-gray-400">
                            <Text className="text-white font-black text-xs uppercase cursor-pointer">My Library</Text>
                        </Badge>
                        <div className="w-10 h-10 rounded-full bg-[#151a22] border border-[#232a35] flex items-center justify-center">
                            <Text className="text-[#ff8c00] font-black">S</Text>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search */}
            <div className="search-container">
                <Input 
                    prefix={<SearchOutlined style={{ color: '#ff8c00', fontSize: 20 }} />}
                    placeholder="BATCH DHUNDO..."
                    className="rc-search"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="filter-container">
                {categories.map((cat, i) => (
                    <div key={cat} className={`filter-tag ${i === 0 ? 'active' : ''}`}>
                        {cat}
                    </div>
                ))}
            </div>

            {/* Stats Bar */}
            <div className="stats-bar">
                <div className="stats-text">
                    SHOWING <b>{batches.length}</b> OF <b>{batches.length}</b> BATCHES
                </div>
                <div className="stats-text cursor-pointer hover:text-white">
                    A-Z ORDER
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-[1300px] mx-auto px-10 pb-20">
                {status === 'loading' ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : batches.length === 0 ? (
                    <div className="py-20 text-center">
                        <Empty description={<span className="text-gray-500">No NextToppers batches found. Please run sync from admin.</span>} />
                    </div>
                ) : (
                    <Row gutter={[30, 40]}>
                        {batches.map((batch, idx) => (
                            <Col xs={24} sm={12} lg={8} key={batch.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="h-full"
                                >
                                    <Card className="batch-card" bodyStyle={{ padding: 0 }}>
                                    <div className="batch-img-container">
                                        <img src={batch.banner_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400'} alt={batch.name} className="batch-img" />
                                        <div className="price-tag">
                                            <span className="old-price">₹3499/-</span>
                                            <span className="new-price">₹2999</span>
                                        </div>
                                        <div className="batch-tag-overlay">
                                            {batch.tag || 'ELITE BATCH'}
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="batch-title">{batch.name}</h3>
                                        <div className="batch-meta">
                                            <div className="meta-item">
                                                <FolderOpenOutlined />
                                                BATCH #{String(idx + 1).padStart(2, '0')}
                                            </div>
                                            <div className="meta-item">
                                                <PlayCircleOutlined />
                                                START ANYTIME
                                            </div>
                                        </div>
                                        <Button 
                                            className="start-btn"
                                            onClick={() => navigate(`/user/subjects?batchId=${batch.id}`)}
                                        >
                                            START LEARNING
                                            <div className="arrow-circle">
                                                <RightOutlined />
                                            </div>
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                    </Row>
                )}
            </div>
        </div>
    )
}

export default NextToppersDashboard
