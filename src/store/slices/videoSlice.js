import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'

// Fetch all videos
export const fetchVideos = createAsyncThunk('videos/fetchVideos', async () => {
    const response = await api.get('/api/videos/index.php')
    return response.data
})

// Create video
export const createVideoAsync = createAsyncThunk('videos/createVideo', async (videoData) => {
    const response = await api.post('/api/videos/index.php', videoData)
    return { ...videoData, id: response.data.id }
})

// Update video
export const updateVideoAsync = createAsyncThunk('videos/updateVideo', async (videoData) => {
    await api.put('/api/videos/index.php', videoData)
    return videoData
})

// Delete video
export const deleteVideoAsync = createAsyncThunk('videos/deleteVideo', async (id) => {
    await api.delete(`/api/videos/index.php?id=${id}`)
    return id
})

const videoSlice = createSlice({
    name: 'videos',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVideos.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchVideos.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchVideos.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(createVideoAsync.fulfilled, (state, action) => {
                state.items.unshift(action.payload)
            })
            .addCase(updateVideoAsync.fulfilled, (state, action) => {
                const index = state.items.findIndex(v => v.id === action.payload.id)
                if (index !== -1) {
                    state.items[index] = action.payload
                }
            })
            .addCase(deleteVideoAsync.fulfilled, (state, action) => {
                state.items = state.items.filter(v => v.id !== action.payload)
            })
    },
})

export const selectAllVideos = (state) => state.videos.items
export const selectVideosLoading = (state) => state.videos.loading
export default videoSlice.reducer
