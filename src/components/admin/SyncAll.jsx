import React, { useState, useEffect } from 'react'
import { Button, Modal, Result, Spin, message, Progress, Descriptions, Card, Tag, Tabs, Switch, Select, TimePicker, Divider } from 'antd'
import { SyncOutlined, ClockCircleOutlined, SettingOutlined, CloudDownloadOutlined, SafetyOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { fetchBatches }    from '@/store/slices/batchSlice'
import { fetchSubjects }   from '@/store/slices/subjectSlice'
import { fetchVideos }     from '@/store/slices/videoSlice'
import { fetchNotes }      from '@/store/slices/noteSlice'
import { fetchLiveClasses} from '@/store/slices/liveClassSlice'
import { API_BASE_URL }    from '@/constants'

const SyncAll = ({ onSyncSuccess }) => {
    const dispatch = useDispatch()
    const [open,   setOpen]   = useState(false)
    const [status, setStatus] = useState('idle')  // idle | loading | success | error
    const [mode,   setMode]   = useState('incremental') // incremental | full
    const [result, setResult] = useState(null)
    const [meta,   setMeta]   = useState(null)
    const [sched,  setSched]  = useState({ enabled: false, frequency: 'daily', time: '00:00' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!open) return
        const fetchMeta = async () => {
            try {
                const [mRes, sRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/sync_meta.php`),
                    fetch(`${API_BASE_URL}/sync_schedule.php`)
                ])
                setMeta(await mRes.json())
                setSched(await sRes.json())
            } catch (err) {
                console.error('Failed to fetch data:', err)
            }
        }
        fetchMeta()
    }, [open])

    const handleSync = async () => {
        setStatus('loading')
        try {
            const res  = await fetch(`${API_BASE_URL}/sync_all.php?mode=${mode}`)
            const data = await res.json()

            if (!res.ok || data.error) throw new Error(data.message || 'Sync failed')

            setResult(data)
            setMeta(data.meta)
            setStatus('success')

            dispatch(fetchBatches())
            dispatch(fetchSubjects())
            dispatch(fetchVideos())
            dispatch(fetchNotes())
            dispatch(fetchLiveClasses())

            if (onSyncSuccess) onSyncSuccess()
            message.success(`Sync complete (${mode} mode)`)
        } catch (err) {
            console.error(err)
            setResult({ message: err.message })
            setStatus('error')
        }
    }

    const handleSaveSchedule = async () => {
        setSaving(true)
        try {
            const res = await fetch(`${API_BASE_URL}/sync_schedule.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sched)
            })
            if (res.ok) message.success('Sync schedule updated')
            else throw new Error('Failed to save')
        } catch (err) {
            message.error(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleClose = () => {
        setOpen(false)
        setStatus('idle')
        setResult(null)
    }

    const renderManual = () => {
        if (status === 'loading') {
            return (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <Spin size="large" />
                    <p style={{ marginTop: 16, fontWeight: 600 }}>
                        {mode === 'full' ? 'Performing Full Refresh...' : 'Syncing New Content...'}
                    </p>
                    <p style={{ color: '#888', fontSize: 13 }}>
                        Processing batches → subjects → videos → notes<br />
                        <strong>Estimated Time: {mode === 'full' ? '20-30 mins' : '5-10 mins'}</strong>
                    </p>
                    <Progress percent={100} status="active" showInfo={false} style={{ marginTop: 16 }} />
                </div>
            )
        }

        if (status === 'success') {
            const m = result.stats || result.meta?.new_records || {}
            return (
                <Result
                    status="success"
                    title="Database Update Complete!"
                    subTitle={`The ${mode} synchronization was successful.`}
                    extra={[
                        <Descriptions bordered size="small" column={1} key="stats" style={{ marginBottom: 16 }}>
                            <Descriptions.Item label="✅ Batches Added">  {m.batches ?? 0}</Descriptions.Item>
                            <Descriptions.Item label="📚 Subjects Added"> {m.subjects ?? 0}</Descriptions.Item>
                            <Descriptions.Item label="🎥 Videos Added">   {m.videos ?? 0}</Descriptions.Item>
                            <Descriptions.Item label="📄 Notes Added">    {m.notes ?? 0}</Descriptions.Item>
                        </Descriptions>,
                        <Button type="primary" key="close" onClick={handleClose}>Done</Button>,
                    ]}
                />
            )
        }

        if (status === 'error') {
            return (
                <Result
                    status="error"
                    title="Sync Failed"
                    subTitle={result?.message || 'Check connection.'}
                    extra={[
                        <Button type="primary" key="retry" onClick={handleSync}>Retry</Button>,
                        <Button key="close" onClick={handleClose}>Close</Button>,
                    ]}
                />
            )
        }

        return (
            <div className="space-y-6 pt-2">
                {meta?.last_sync_at && (
                    <div className="bg-gray-800/20 p-4 rounded-xl border border-white/5">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Last Manual Sync</p>
                        <div className="flex justify-between items-center">
                            <span className="text-white font-bold">{new Date(meta.last_sync_at).toLocaleString()}</span>
                            <Tag color="green" className="m-0">SUCCESS</Tag>
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    <Card 
                        hoverable 
                        className={`flex-1 transition-all border-2 ${mode === 'incremental' ? 'border-purple-500 bg-purple-500/5' : 'border-transparent bg-white/5'}`}
                        onClick={() => setMode('incremental')}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <h4 className="font-bold text-white mb-1">Incremental Sync</h4>
                        <p className="text-gray-500 text-xs">Adds new content without deleting. Fast and safe.</p>
                        <div className="mt-2 text-[10px] font-bold text-purple-400">EST: 5-10 MINS</div>
                    </Card>
                    <Card 
                        hoverable 
                        className={`flex-1 transition-all border-2 ${mode === 'full' ? 'border-red-500 bg-red-500/5' : 'border-transparent bg-white/5'}`}
                        onClick={() => setMode('full')}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <h4 className="font-bold text-white mb-1">Full Refresh</h4>
                        <p className="text-gray-500 text-xs">Wipes & re-imports everything. Cleanest data.</p>
                        <div className="mt-2 text-[10px] font-bold text-red-400">EST: 20-30 MINS</div>
                    </Card>
                </div>

                <div className={`p-4 rounded-xl border ${mode === 'full' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'}`}>
                    <SyncOutlined spin={status === 'loading'} className="mr-2" />
                    <strong>{mode === 'full' ? '⚠️ Warning:' : 'Note:'}</strong> {mode === 'full' ? 'This will permanently delete all records and rebuild from scratch.' : 'This will pull only new items and update titles/links.'}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button 
                        type="primary" 
                        danger={mode === 'full'}
                        className={mode === 'incremental' ? 'bg-purple-600 border-0' : ''}
                        icon={<SyncOutlined />} 
                        onClick={handleSync}
                    >
                        Start {mode === 'full' ? 'Full Refresh' : 'Incremental Sync'}
                    </Button>
                </div>
            </div>
        )
    }

    const handleNextToppersSync = async () => {
        setOpen(true)
        setStatus('loading')
        setMode('incremental') // NT currently uses incremental by default
        try {
            const res = await fetch(`${API_BASE_URL}/sync_all.php?brand=NT&mode=incremental`)
            const data = await res.json()
            if (res.ok && !data.error) {
                setResult(data)
                setStatus('success')
                message.success('NextToppers Elite Sync Complete')
                dispatch(fetchBatches())
                dispatch(fetchSubjects())
            } else {
                throw new Error(data.message || 'Sync failed')
            }
        } catch (error) {
            setResult({ message: error.message })
            setStatus('error')
        }
    }

    const renderAutomation = () => (
        <div className="space-y-6 pt-4">
            <div className="bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/20">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h4 className="text-white font-bold text-lg m-0">Scheduled Background Sync</h4>
                        <p className="text-gray-500 text-sm">Automatically sync content without manual intervention.</p>
                    </div>
                    <Switch 
                        checked={sched.enabled} 
                        onChange={e => setSched({...sched, enabled: e})} 
                    />
                </div>

                <div className={`space-y-4 transition-all ${sched.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Frequency</p>
                            <Select 
                                value={sched.frequency} 
                                onChange={v => setSched({...sched, frequency: v})}
                                className="w-full"
                                options={[
                                    { value: 'hourly', label: 'Every Hour' },
                                    { value: 'daily', label: 'Once Daily' },
                                    { value: 'weekly', label: 'Once Weekly' },
                                ]}
                            />
                        </div>
                        <div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Start Time</p>
                            <TimePicker 
                                format="HH:mm" 
                                value={sched.time ? moment(sched.time, 'HH:mm') : null}
                                onChange={(_, ts) => setSched({...sched, time: ts})}
                                className="w-full"
                            />
                        </div>
                    </div>
                    
                    <Button 
                        type="primary" 
                        className="w-full h-12 rounded-xl bg-indigo-600 border-0 font-bold mt-4"
                        onClick={handleSaveSchedule}
                        loading={saving}
                    >
                        Save Schedule Settings
                    </Button>
                </div>
            </div>

            <div className="bg-gray-800/20 p-6 rounded-2xl border border-white/5">
                <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                    <SettingOutlined /> How to Setup on Windows (XAMPP)
                </h5>
                <div className="space-y-4">
                    <div>
                        <p className="text-indigo-400 font-bold text-xs uppercase mb-2">1. For Physics Wallah (Cloud Sync)</p>
                        <code className="block bg-black/40 p-2 rounded text-xs text-gray-400 mb-2">
                            Program: C:\xampp\php\php.exe<br/>
                            Args: -f "C:\xampp\htdocs\gloryfuel-api\sync_all.php" brand=PW mode=incremental
                        </code>
                    </div>
                    <div>
                        <p className="text-green-400 font-bold text-xs uppercase mb-2">2. For NextToppers (Elite Sync)</p>
                        <code className="block bg-black/40 p-2 rounded text-xs text-gray-400 mb-2">
                            Program: C:\xampp\php\php.exe<br/>
                            Args: -f "C:\xampp\htdocs\gloryfuel-api\sync_all.php" brand=NT mode=incremental
                        </code>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs rounded-lg">
                    <strong>Note:</strong> You must create two separate tasks in Windows Task Scheduler to automate both sources.
                </div>
            </div>
        </div>
    )

    const renderNextToppers = () => (
        <div className="space-y-6 pt-4">
            <div className="bg-green-500/10 p-6 rounded-2xl border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-500 p-3 rounded-xl">
                        <SafetyOutlined className="text-white text-xl" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-lg m-0">NextToppers Elite Sync</h4>
                        <p className="text-gray-500 text-sm">Synchronize specialized EduVibe content and elite batches.</p>
                    </div>
                </div>
                
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 mb-6">
                    <ul className="text-gray-400 text-xs space-y-2">
                        <li>• Syncs encrypted video streams securely</li>
                        <li>• Imports DPPs and PDF notes automatically</li>
                        <li>• Updates existing NextToppers batches without data loss</li>
                    </ul>
                </div>

                <Button 
                    type="primary" 
                    className="w-full h-14 rounded-2xl bg-green-600 border-0 font-black text-lg shadow-lg shadow-green-900/20 hover:bg-green-500"
                    onClick={handleNextToppersSync}
                    icon={<CloudDownloadOutlined />}
                >
                    RUN ELITE SYNC NOW
                </Button>
            </div>
        </div>
    )

    return (
        <>
            <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={() => setOpen(true)}
                className="bg-indigo-600 border-0 hover:bg-indigo-500 h-10 px-6 rounded-lg font-bold"
            >
                Data Center
            </Button>

            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <SyncOutlined className="text-indigo-400" />
                        <span>Data Management Center</span>
                    </div>
                }
                open={open}
                onCancel={handleClose}
                footer={null}
                destroyOnClose
                width={650}
                maskClosable={status !== 'loading'}
                className="custom-modal"
            >
                <Tabs 
                    defaultActiveKey="1"
                    className="sync-tabs"
                    items={[
                        {
                            key: '1',
                            label: (
                                <span className="flex items-center gap-2 px-2">
                                    <SyncOutlined /> Manual Sync
                                </span>
                            ),
                            children: renderManual(),
                            disabled: status === 'loading'
                        },
                        {
                            key: '2',
                            label: (
                                <span className="flex items-center gap-2 px-2">
                                    <ClockCircleOutlined /> Automation
                                </span>
                            ),
                            children: renderAutomation(),
                            disabled: status === 'loading'
                        },
                        {
                            key: '3',
                            label: (
                                <span className="flex items-center gap-2 px-2">
                                    <CloudDownloadOutlined /> NextToppers
                                </span>
                            ),
                            children: renderNextToppers(),
                            disabled: status === 'loading'
                        }
                    ]}
                />
            </Modal>
        </>
    )
}

export default SyncAll
