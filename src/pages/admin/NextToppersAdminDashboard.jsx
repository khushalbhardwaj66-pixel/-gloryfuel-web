import React from 'react'
import { Row, Col, Card, Statistic, Table, Tag, Button } from 'antd'
import {
    SettingOutlined,
    UsergroupAddOutlined,
    LineChartOutlined,
    SafetyOutlined,
    PlusOutlined
} from '@ant-design/icons'
import NextToppersLayout from '@components/common/NextToppersLayout'

const NextToppersAdminDashboard = () => {
    return (
        <NextToppersLayout>
            <div className="space-y-8 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-green-500/20 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <SafetyOutlined className="text-green-500" />
                            <span className="text-green-500 font-black text-[10px] uppercase tracking-widest">Administrative Secure Node</span>
                        </div>
                        <h1 className="text-4xl font-black text-white">NextToppers <span className="text-green-500">Elite Admin</span></h1>
                    </div>
                    <Button type="primary" icon={<PlusOutlined />} className="h-12 px-6 rounded-xl font-bold bg-green-500 text-black border-0 hover:bg-green-400">
                        CONFIGURE NEW BATCH
                    </Button>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="bg-black border-green-500/10">
                            <Statistic
                                title={<span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Total Elite Students</span>}
                                value={1284}
                                prefix={<UsergroupAddOutlined className="text-green-500 mr-2" />}
                                valueStyle={{ color: '#fff', fontWeight: '900' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="bg-black border-green-500/10">
                            <Statistic
                                title={<span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">System Efficiency</span>}
                                value={99.8}
                                suffix="%"
                                prefix={<LineChartOutlined className="text-green-500 mr-2" />}
                                valueStyle={{ color: '#fff', fontWeight: '900' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="bg-black border-green-500/10">
                            <Statistic
                                title={<span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Active Mentors</span>}
                                value={42}
                                prefix={<SettingOutlined className="text-green-500 mr-2" />}
                                valueStyle={{ color: '#fff', fontWeight: '900' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="bg-black border-green-500/10 text-center flex items-center justify-center">
                            <Button type="link" className="text-green-500 font-black tracking-widest uppercase text-xs">
                                VIEW SYSTEM LOGS
                            </Button>
                        </Card>
                    </Col>
                </Row>

                <Card title={<span className="text-white font-black tracking-widest uppercase">Elite Batch Management</span>} className="bg-black/40 border-green-500/10">
                    <Table
                        pagination={false}
                        dataSource={[]}
                        columns={[
                            { title: 'BATCH IDENTIFIER', dataIndex: 'name', key: 'name' },
                            { title: 'STATUS', dataIndex: 'status', key: 'status' },
                            { title: 'CAPACITY', dataIndex: 'capacity', key: 'capacity' },
                            { title: 'OPERATIONS', key: 'ops' },
                        ]}
                        locale={{ emptyText: <span className="text-gray-600 font-bold uppercase tracking-widest text-xs">Waiting for deployment data...</span> }}
                    />
                </Card>
            </div>
        </NextToppersLayout>
    )
}

export default NextToppersAdminDashboard
