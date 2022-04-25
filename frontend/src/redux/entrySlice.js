/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import { createSlice } from '@reduxjs/toolkit'

export const entrySlice = createSlice({
  name: 'entries',
  initialState: {
    list: [],
    day: {},
  },
  reducers: {
    addEntry: (state, action) => {
      state.list.push(action.payload)
    },
    removeEntry: (state, action) => (state.list.filter(e => e._id === action.payload._id)),
    setEntries: (state, action) => {
      state.list = action.payload
    },
    setDay: (state, action) => {
      state.day = action.payload
    },
    clearEntries: state => {
      state.list = []
      state.day = {}
    },
  },
})

export const {
  addEntry,
  removeEntry,
  setEntries,
  setDay,
  clearEntries,
} = entrySlice.actions
export const selectEntryList = state => state.entries.list
export const selectEntryListDay = state => state.entries.day
export default entrySlice.reducer
