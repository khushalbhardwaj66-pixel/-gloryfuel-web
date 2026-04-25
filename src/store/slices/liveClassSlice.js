import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'

// Fetch all live classes
export const fetchLiveClasses = createAsyncThunk('liveClasses/fetchLiveClasses', async () => {
    const response = await api.get('/api/live-classes/index.php')
    return response.data
})

// Create live class
export const createLiveClassAsync = createAsyncThunk('liveClasses/createLiveClass', async (classData) => {
    const response = await api.post('/api/live-classes/index.php', classData)
    return { ...classData, id: response.data.id }
})

// Update live class
export const updateLiveClassAsync = createAsyncThunk('liveClasses/updateLiveClass', async (classData) => {
    await api.put('/api/live-classes/index.php', classData)
    return classData
})

// Delete live class
export const deleteLiveClassAsync = createAsyncThunk('liveClasses/deleteLiveClass', async (id) => {
    await api.delete(`/api/live-classes/index.php?id=${id}`)
    return id
})

const liveClassSlice = createSlice({
    name: 'liveClasses',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLiveClasses.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchLiveClasses.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchLiveClasses.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(createLiveClassAsync.fulfilled, (state, action) => {
                state.items.unshift(action.payload)
            })
            .addCase(updateLiveClassAsync.fulfilled, (state, action) => {
                const index = state.items.findIndex(c => c.id === action.payload.id)
                if (index !== -1) {
                    state.items[index] = action.payload
                }
            })
            .addCase(deleteLiveClassAsync.fulfilled, (state, action) => {
                state.items = state.items.filter(c => c.id !== action.payload)
            })
    },
})

export const selectAllLiveClasses = (state) => state.liveClasses.items
export const selectLiveClassesLoading = (state) => state.liveClasses.loading
export default liveClassSlice.reducer
