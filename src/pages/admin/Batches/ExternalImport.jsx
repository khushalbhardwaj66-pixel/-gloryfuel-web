import React, { useState } from 'react'
import { Button, Modal, Result, Spin, message } from 'antd'
import { CloudDownloadOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { importBatchAsync } from '@/store/slices/batchSlice'

const ExternalImport = ({ onImportSuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [status, setStatus] = useState('idle') // idle, loading, success, error
    const dispatch = useDispatch()

    const [importedCount, setImportedCount] = useState(0)

    const handleImport = async () => {
        setStatus('loading')
        try {
            const result = await dispatch(importBatchAsync()).unwrap()
            setImportedCount(result?.imported_count || 1)
            setStatus('success')
            message.success(`${result?.imported_count || 1} batch(es) imported from rolexcoderz.in!`)
            // Refresh the parent table if callback is provided
            if (onImportSuccess) onImportSuccess()
        } catch (error) {
            console.error(error)
            setStatus('error')
        }
    }

    const handleClose = () => {
        setIsModalOpen(false)
        setStatus('idle')
    }

    const renderContent = () => {
        if (status === 'loading') {
            return (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Spin size="large" />
                    <p className="mt-4 text-gray-700 font-semibold">Fetching batches from rolexcoderz.in...</p>
                    <p className="mt-2 text-gray-400 text-sm">Deleting old batches → Reading batch list → Saving names</p>
                    <p className="mt-1 text-gray-400 text-xs">This may take 20–40 seconds. Please wait.</p>
                </div>
            )
        }

        if (status === 'success') {
            return (
                <Result
                    status="success"
                    title="Import Successful!"
                    subTitle={`${importedCount} batch(es) were fetched from rolexcoderz.in and saved to your database.`}
                    extra={[
                        <Button type="primary" key="close" onClick={handleClose}>
                            Close
                        </Button>,
                    ]}
                />
            )
        }

        if (status === 'error') {
            return (
                <Result
                    status="error"
                    title="Import Failed"
                    subTitle="Could not fetch batches from rolexcoderz.in. Please check your API key, make sure XAMPP is running, and try again."
                    extra={[
                        <Button key="retry" type="primary" onClick={handleImport}>Try Again</Button>,
                        <Button key="close" onClick={handleClose}>Close</Button>,
                    ]}
                />
            )
        }

        return (
            <div className="py-4">
                <p className="mb-4">
                    This will <strong>delete all existing batches</strong> and replace them with <strong>all fresh batches</strong> from <strong>rolexcoderz.in/PW/</strong>.
                </p>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-3">
                    <h4 className="font-semibold text-amber-800 mb-1">⚠️ Warning</h4>
                    <p className="text-sm text-amber-700">
                        All your current batches will be <strong>permanently deleted</strong> and replaced with the latest ones from rolexcoderz.in. This cannot be undone.
                    </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                    <h4 className="font-semibold text-blue-800 mb-1">⏱️ Please be patient</h4>
                    <p className="text-sm text-blue-600">
                        The server will fetch all 20+ batch names one by one. This may take <strong>20–40 seconds</strong>. Do not close this window.
                    </p>
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleClose} className="mr-2">Cancel</Button>
                    <Button type="primary" danger icon={<CloudDownloadOutlined />} onClick={handleImport}>
                        Delete Old &amp; Import Fresh
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <>
            <Button
                icon={<CloudDownloadOutlined />}
                onClick={() => setIsModalOpen(true)}
                type="primary"
            >
                Import from rolexcoderz.in
            </Button>

            <Modal
                title="Import External Batch"
                open={isModalOpen}
                onCancel={handleClose}
                footer={null}
                destroyOnClose
            >
                {renderContent()}
            </Modal>
        </>
    )
}

export default ExternalImport
