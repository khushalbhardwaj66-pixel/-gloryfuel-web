import React from 'react'
import { Layout, Input, Dropdown, Menu, Row, Col, Typography } from 'antd'
const { Title } = Typography
import { 
    SearchOutlined, 
    BellOutlined, 
    UserOutlined, 
    ShoppingCartOutlined,
    FacebookFilled,
    TwitterSquareFilled,
    InstagramFilled,
    LinkedinFilled,
    MenuOutlined
} from '@ant-design/icons'
import PageTransition from './PageTransition'
import { useNavigate, Link } from 'react-router-dom'

const { Header, Content, Footer } = Layout

const NextToppersLayout = ({ children }) => {
    const navigate = useNavigate()

    return (
        <Layout className="min-h-screen bg-white font-['Reddit_Sans']">
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,200..900;1,200..900&display=swap');
                body { font-family: 'Reddit Sans', sans-serif !important; }
                .text-nt-teal { color: #00AD80 !important; }
                .bg-nt-teal { background-color: #00AD80 !important; }
                .border-nt-teal { border-color: #00AD80 !important; }
                .ant-btn-nt { background: #00AD80 !important; border-color: #00AD80 !important; color: white !important; font-weight: 600 !important; }
                .ant-btn-nt:hover { background: #00916b !important; border-color: #00916b !important; }
                .ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused { border-color: #00AD80 !important; box-shadow: 0 0 0 2px rgba(0, 173, 128, 0.1) !important; }
                .ant-layout-header {
                    background: #fff !important;
                    border-bottom: 1px solid rgba(0, 173, 128, 0.1) !important;
                }
            ` }} />

            {/* Premium Header */}
            <Header className="bg-white border-b border-gray-100 px-6 md:px-16 flex items-center justify-between h-24 sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-12 flex-1">
                    <Link to="/nexttoppers" className="flex items-center gap-3 group">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/10 group-hover:scale-105 transition-transform overflow-hidden">
                            <img src="https://decicqog4ulhy.cloudfront.net/0/admin_v2/uploads/courses/thumbnail/3880932_1_4415521540_Group%2018441%20%282%29.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-gray-900 tracking-tighter leading-none">Next<span className="text-nt-teal">Toppers</span></span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Elite Student Portal</span>
                        </div>
                    </Link>

                    <div className="hidden lg:flex flex-1 max-w-2xl mx-12">
                        <Input 
                            placeholder="Search your favorite batch, course or teacher..." 
                            prefix={<SearchOutlined className="text-gray-400 text-lg mr-2" />}
                            className="bg-gray-50 border-gray-100 h-14 rounded-2xl focus:bg-white transition-all text-base font-medium px-6"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-10">
                    <nav className="hidden xl:flex items-center gap-10 text-gray-600 font-black text-xs uppercase tracking-widest">
                        <Link to="/nexttoppers/blogs" className="hover:text-nt-teal transition-colors">Blogs</Link>
                        <Link to="/nexttoppers/products" className="hover:text-nt-teal transition-colors">Products</Link>
                        <Link to="/nexttoppers/contact" className="hover:text-nt-teal transition-colors">Contact</Link>
                    </nav>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-6 border-r border-gray-100 pr-8 hidden md:flex">
                            <ShoppingCartOutlined className="text-2xl text-gray-400 cursor-pointer hover:text-nt-teal transition-colors" />
                            <BellOutlined className="text-2xl text-gray-400 cursor-pointer hover:text-nt-teal transition-colors" />
                        </div>
                        <Dropdown menu={{ items: [{ key: '1', label: 'Dashboard' }, { key: '2', label: 'Logout', danger: true }] }} placement="bottomRight">
                            <div className="flex items-center gap-4 cursor-pointer group">
                                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200 group-hover:border-nt-teal transition-colors overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=student" alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className="hidden lg:flex flex-col">
                                    <span className="text-sm font-black text-gray-900 leading-none">Student User</span>
                                    <span className="text-[10px] font-bold text-nt-teal uppercase tracking-widest mt-1 italic">Verified</span>
                                </div>
                            </div>
                        </Dropdown>
                        <MenuOutlined className="text-2xl xl:hidden text-gray-600 cursor-pointer" />
                    </div>
                </div>
            </Header>

            <Content className="bg-white">
                <PageTransition>
                    {children}
                </PageTransition>
            </Content>

            {/* Premium Multi-Level Footer */}
            <Footer className="bg-[#0f172a] text-white pt-24 pb-12 px-6 md:px-24 mt-24">
                <div className="max-w-7xl mx-auto">
                    <Row gutter={[64, 48]}>
                        <Col xs={24} lg={8} className="space-y-8">
                            <Link to="/nexttoppers" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-nt-teal rounded-xl flex items-center justify-center">
                                    <span className="text-white font-black text-xl italic">NT</span>
                                </div>
                                <span className="text-2xl font-black tracking-tighter">Next<span className="text-nt-teal">Toppers</span></span>
                            </Link>
                            <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                NextToppers is dedicated to providing high-quality educational resources, expert mentorship, and innovative learning tools for students across India.
                            </p>
                            <div className="flex items-center gap-6">
                                <FacebookFilled className="text-2xl text-gray-500 hover:text-blue-500 cursor-pointer transition-colors" />
                                <TwitterSquareFilled className="text-2xl text-gray-500 hover:text-cyan-400 cursor-pointer transition-colors" />
                                <InstagramFilled className="text-2xl text-gray-500 hover:text-pink-500 cursor-pointer transition-colors" />
                                <LinkedinFilled className="text-2xl text-gray-500 hover:text-blue-400 cursor-pointer transition-colors" />
                            </div>
                        </Col>
                        
                        <Col xs={12} md={6} lg={4}>
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Navigation</h4>
                            <ul className="space-y-4 text-gray-400 font-bold text-sm">
                                <li className="hover:text-nt-teal cursor-pointer transition-colors">Home Portal</li>
                                <li className="hover:text-nt-teal cursor-pointer transition-colors">Courses Library</li>
                                <li className="hover:text-nt-teal cursor-pointer transition-colors">Live Classes</li>
                                <li className="hover:text-nt-teal cursor-pointer transition-colors">Study Vault</li>
                            </ul>
                        </Col>

                        <Col xs={12} md={6} lg={4}>
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Support</h4>
                            <ul className="space-y-4 text-gray-400 font-bold text-sm">
                                <li className="hover:text-nt-teal cursor-pointer transition-colors">Help Center</li>
                                <li className="hover:text-nt-teal cursor-pointer transition-colors">Academic Doubt</li>
                                <li className="hover:text-nt-teal cursor-pointer transition-colors">Terms of Use</li>
                                <li className="hover:text-nt-teal cursor-pointer transition-colors">Privacy Policy</li>
                            </ul>
                        </Col>

                        <Col xs={24} md={12} lg={8}>
                            <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] space-y-6">
                                <h4 className="text-white font-black uppercase tracking-widest text-xs">Stay Connected</h4>
                                <Title level={3} className="!text-white !m-0 !text-2xl font-black">Join our learning newsletter</Title>
                                <div className="space-y-4">
                                    <Input placeholder="Your Email Address" className="bg-gray-800/50 border-gray-700 h-14 text-white placeholder:text-gray-500 rounded-2xl px-6" />
                                    <button className="w-full bg-nt-teal text-white h-14 rounded-2xl font-black text-base hover:bg-nt-teal/90 hover:scale-[1.02] transition-all shadow-xl shadow-teal-500/20">
                                        SUBSCRIBE NOW
                                    </button>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <div className="border-t border-white/5 mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
                        <span>&copy; {new Date().getFullYear()} NextToppers Education Group.</span>
                        <div className="flex items-center gap-8">
                            <span>Crafted with Excellence</span>
                            <span>Secure Node: 2026.04</span>
                        </div>
                    </div>
                </div>
            </Footer>
        </Layout>
    )
}

export default NextToppersLayout
