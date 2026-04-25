import React from 'react'
import { Row, Col, Card, Typography, Button, Space } from 'antd'
import { ArrowRightOutlined, SafetyCertificateOutlined, GlobalOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import UserLayout from '@components/common/UserLayout'

const { Title, Text } = Typography

const InstitutionSelect = () => {
    const navigate = useNavigate()

    const institutions = [
        {
            id: 'pw',
            name: 'Physics Wallah',
            abbr: 'PW',
            description: 'Access batches from India\'s most loved education platform.',
            color: 'from-blue-600 to-indigo-900',
            icon: '/pw_logo_minimal_1777021127143.png',
            tag: 'Most Popular'
        },
        {
            id: 'nexttoppers',
            name: 'NextToppers',
            abbr: 'NT',
            description: 'Premium quality education for competitive exams.',
            color: 'from-emerald-500 to-teal-800',
            icon: '/nexttoppers_logo_minimal_1777021147408.png',
            tag: 'Top Rated'
        }
    ]

    const handleSelect = (id) => {
        localStorage.setItem('selected_institution', id)
        if (id === 'pw') {
            navigate('/user/my-batches')
        } else {
            navigate('/nexttoppers/dashboard')
        }
    }

    return (
        <UserLayout>
            <div className="min-h-[80vh] flex flex-col justify-center items-center space-y-12 py-12 animate-fadeIn">
                <div className="text-center space-y-4 max-w-2xl">
                    <Title className="!text-white !text-5xl font-black tracking-tight">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Path to Success</span>
                    </Title>
                    <Text className="text-gray-400 text-lg block">
                        Select the institution you are studying with to access your personalized dashboard and resources.
                    </Text>
                </div>

                <Row gutter={[32, 32]} className="w-full max-w-5xl px-4">
                    {institutions.map((inst) => (
                        <Col xs={24} md={12} key={inst.id}>
                            <Card
                                hoverable
                                className={`bg-gradient-to-br ${inst.color} border-0 rounded-[2.5rem] overflow-hidden group shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-indigo-500/20`}
                                bodyStyle={{ padding: '48px' }}
                                onClick={() => handleSelect(inst.id)}
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <GlobalOutlined className="text-[120px] text-white" />
                                </div>

                                <div className="relative z-10 space-y-8">
                                    <div className="flex justify-between items-start">
                                        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                            <img src={inst.icon} alt={inst.name} className="w-12 h-12 object-contain" />
                                        </div>
                                        <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                                            {inst.tag}
                                        </span>
                                    </div>

                                    <div>
                                        <Title level={2} className="!text-white !mb-2 text-3xl font-bold">
                                            {inst.name}
                                        </Title>
                                        <Text className="text-white/70 text-base leading-relaxed block">
                                            {inst.description}
                                        </Text>
                                    </div>

                                    <Button
                                        block
                                        size="large"
                                        className="h-14 rounded-2xl bg-white text-indigo-900 border-0 font-black text-lg flex items-center justify-center gap-3 group-hover:gap-5 transition-all shadow-xl"
                                    >
                                        ENTER PORTAL <ArrowRightOutlined />
                                    </Button>

                                    <div className="flex items-center gap-4 pt-4 text-white/40 text-xs font-bold uppercase tracking-widest">
                                        <div className="flex items-center gap-1">
                                            <SafetyCertificateOutlined /> SECURE ACCESS
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                        <div>24/7 SUPPORT</div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div className="pt-8 text-center">
                    <Text className="text-gray-500 text-sm font-medium">
                        Don't see your institution? <Button type="link" className="text-indigo-400 p-0 h-auto font-bold">Contact Support</Button>
                    </Text>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .animate-fadeIn {
                    animation: fadeIn 1s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            ` }} />
        </UserLayout>
    )
}

export default InstitutionSelect
