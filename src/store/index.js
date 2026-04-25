import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import notificationReducer from './slices/notificationSlice'
import batchReducer from './slices/batchSlice'
import videoReducer from './slices/videoSlice'
import noteReducer from './slices/noteSlice'
import liveClassReducer from './slices/liveClassSlice'
import subjectReducer from './slices/subjectSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        notifications: notificationReducer,
        batches: batchReducer,
        videos: videoReducer,
        notes: noteReducer,
        liveClasses: liveClassReducer,
        subjects: subjectReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store
