import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'

// Fetch all notes
export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
    const response = await api.get('/api/notes/index.php')
    return response.data
})

// Create note
export const createNoteAsync = createAsyncThunk('notes/createNote', async (noteData) => {
    const response = await api.post('/api/notes/index.php', noteData)
    return { ...noteData, id: response.data.id }
})

// Delete note
export const deleteNoteAsync = createAsyncThunk('notes/deleteNote', async (id) => {
    await api.delete(`/api/notes/index.php?id=${id}`)
    return id
})

const noteSlice = createSlice({
    name: 'notes',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(createNoteAsync.fulfilled, (state, action) => {
                state.items.unshift(action.payload)
            })
            .addCase(deleteNoteAsync.fulfilled, (state, action) => {
                state.items = state.items.filter(n => n.id !== action.payload)
            })
    },
})

export const selectAllNotes = (state) => state.notes.items
export const selectNotesLoading = (state) => state.notes.loading
export default noteSlice.reducer
