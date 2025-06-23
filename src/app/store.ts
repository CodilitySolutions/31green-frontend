import { configureStore } from "@reduxjs/toolkit"
import careNotesReducer from "../features/careNotes/careNotesSlice"

/**
 * Redux store configuration using Redux Toolkit
 * Includes the careNotes slice for managing care notes state
 */
export const store = configureStore({
  reducer: {
    careNotes: careNotesReducer,
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== "production",
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
