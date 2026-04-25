import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'

// Fetch batches from API
export const fetchBatches = createAsyncThunk('batches/fetchBatches', async () => {
    const response = await api.get('/batches/index.php')
    return response.data
})

// Add batch to API
export const addBatchAsync = createAsyncThunk('batches/addBatch', async (batchData) => {
    const response = await api.post('/batches/index.php', batchData)
    return { ...batchData, id: response.data.id.toString() }
})

// Update batch in API
export const updateBatchAsync = createAsyncThunk('batches/updateBatch', async (batchData) => {
    await api.put('/batches/index.php', batchData)
    return batchData
})

// Delete batch from API
export const deleteBatchAsync = createAsyncThunk('batches/deleteBatch', async (id) => {
    await api.delete(`/batches/index.php?id=${id}`)
    return id
})

// Import all batches from external API (rolexcoderz.in)
export const importBatchAsync = createAsyncThunk('batches/importBatch', async () => {
    const response = await api.post('/batches/import_external.php')
    // Return the full response so UI can show count and Redux can push all batches
    return response.data
})

const initialState = {
    items: [],
    loading: false,
    error: null,
}

const batchSlice = createSlice({
    name: 'batches',
    initialState,
    reducers: {
        // Keep local actions for backwards compatibility
        addBatch: (state, action) => {
            state.items.push(action.payload)
        },
        updateBatch: (state, action) => {
            const index = state.items.findIndex(batch => batch.id === action.payload.id)
            if (index !== -1) {
                state.items[index] = action.payload
            }
        },
        deleteBatch: (state, action) => {
            state.items = state.items.filter(batch => batch.id !== action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch batches
            .addCase(fetchBatches.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchBatches.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchBatches.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            // Add batch
            .addCase(addBatchAsync.fulfilled, (state, action) => {
                state.items.push(action.payload)
            })
            // Delete batch
            .addCase(deleteBatchAsync.fulfilled, (state, action) => {
                state.items = state.items.filter(batch => batch.id !== action.payload)
            })
            // Update batch
            .addCase(updateBatchAsync.fulfilled, (state, action) => {
                const index = state.items.findIndex(batch => batch.id === action.payload.id)
                if (index !== -1) {
                    state.items[index] = action.payload
                }
            })
            // Import ALL batches — replaces everything (old batches deleted on server)
            .addCase(importBatchAsync.fulfilled, (state, action) => {
                const allImported = action.payload?.all_imported || []
                if (allImported.length > 0) {
                    // REPLACE entire list since old batches were deleted server-side
                    state.items = allImported
                } else if (action.payload?.batch) {
                    state.items = [action.payload.batch]
                }
                state.loading = false
            })
            .addCase(importBatchAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(importBatchAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    },
})

export const { addBatch, updateBatch, deleteBatch } = batchSlice.actions
export default batchSlice.reducer

export const selectAllBatches = (state) => state.batches.items
export const selectBatchesLoading = (state) => state.batches.loading
