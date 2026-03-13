import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './features/Users/usersSlice'
export const store = configureStore({
  reducer: {
    users:usersReducer
  },
})