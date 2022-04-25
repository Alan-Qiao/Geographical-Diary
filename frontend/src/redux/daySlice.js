/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import { createSlice } from '@reduxjs/toolkit'

export const daySlice = createSlice({
  name: 'days',
  initialState: {
    list: [],
  },
  reducers: {
    addDay: (state, action) => {
      state.list.push(action.payload)
    },
    removeDay: (state, action) => (state.list.filter(e => e._id === action.payload._id)),
    setDays: (state, action) => {
      state.list = action.payload
    },
  },
})

export const {
  addDay,
  removeDay,
  setDays,
} = daySlice.actions
export const selectDayList = state => state.days.list
export default daySlice.reducer
