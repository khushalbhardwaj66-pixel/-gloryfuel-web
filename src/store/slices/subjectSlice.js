import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'

// Fetch all subjects
export const fetchSubjects = createAsyncThunk('subjects/fetchSubjects', async () => {
    const response = await api.get('/api/subjects/index.php')
    return response.data
})

const subjectSlice = createSlice({
    name: 'subjects',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubjects.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchSubjects.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    },
})

export const selectAllSubjects = (state) => state.subjects.items
export const selectSubjectsLoading = (state) => state.subjects.loading
export default subjectSlice.reducer
