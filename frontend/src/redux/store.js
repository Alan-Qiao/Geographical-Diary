import { configureStore } from '@reduxjs/toolkit'
import entryReducer from './entrySlice'
import dayReducer from './daySlice'

const store = configureStore({
  reducer: {
    entries: entryReducer,
    days: dayReducer,
  },
})

export default store
