import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { careNotesApi } from "../../api/careNotesApi"
import { localDb } from "../../db/localDb"

/**
 * Interface for a care note object
 */
export interface CareNote {
  id: number
  residentName: string
  dateTime: string
  content: string
  authorName: string
}

/**
 * Interface for creating a new care note (without id)
 */
export interface CreateCareNoteRequest {
  residentName: string
  authorName: string
  content: string
  dateTime: string
}

/**
 * Interface for the care notes state
 */
interface CareNotesState {
  notes: CareNote[]
  loading: boolean
  error: string | null
  lastSyncTime: number | null
}

/**
 * Initial state for the care notes slice
 */
const initialState: CareNotesState = {
  notes: [],
  loading: false,
  error: null,
  lastSyncTime: null,
}

/**
 * Async thunk for syncing data from server
 * Implements the offline-first data flow:
 * 1. Fetch from server via API layer
 * 2. Store in local database
 * 3. Update Redux with 5 most recent notes
 */
export const syncDataFromServer = createAsyncThunk("careNotes/syncFromServer", async (_, { rejectWithValue }) => {
  try {
    // 1. Fetch notes from server via API layer
    const serverNotes = await careNotesApi.getCareNotes()

    // 2. Write fetched notes to local offline database
    await localDb.updateNotes(serverNotes)

    // 3. Get the 5 most recent notes from local DB
    const recentNotes = await localDb.getRecentNotes(5)

    return {
      notes: recentNotes,
      syncTime: Date.now(),
    }
  } catch (error) {
    console.warn("Server sync failed, loading from local database:", error)

    try {
      // Fallback to local database if server is unavailable
      const localNotes = await localDb.getRecentNotes(5)
      return {
        notes: localNotes,
        syncTime: Date.now(),
        isOffline: true,
      }
    } catch (localError) {
      console.error("Failed to load from local database:", localError)
      return rejectWithValue("Failed to load care notes")
    }
  }
})

/**
 * Async thunk for adding a new care note
 * Implements offline-first approach: save locally first, then sync to server
 */
export const addCareNoteAsync = createAsyncThunk(
  "careNotes/addNote",
  async (noteData: CreateCareNoteRequest, { rejectWithValue }) => {
    try {
      // Generate a temporary ID for the note
      const tempId = Date.now()
      const newNote: CareNote = {
        ...noteData,
        id: tempId,
      }

      // 1. Save to local database first (offline-first approach)
      await localDb.addNote(newNote)

      // 2. Try to save to server
      let serverNote: CareNote
      try {
        serverNote = await careNotesApi.createCareNote(noteData)

        // Update local database with server-generated ID if different
        if (serverNote.id !== tempId) {
          await localDb.updateNoteId(tempId, serverNote.id)
        }
      } catch (serverError) {
        console.warn("Failed to save to server, keeping local copy:", serverError)
        serverNote = newNote // Use local note if server fails
      }

      // 3. Get updated recent notes from local database
      const recentNotes = await localDb.getRecentNotes(5)

      return {
        notes: recentNotes,
        newNote: serverNote,
      }
    } catch (error) {
      console.error("Failed to add care note:", error)
      return rejectWithValue("Failed to save care note")
    }
  },
)

/**
 * Care notes slice using Redux Toolkit
 */
const careNotesSlice = createSlice({
  name: "careNotes",
  initialState,
  reducers: {
    /**
     * Clear any existing errors
     */
    clearError: (state) => {
      state.error = null
    },

    /**
     * Set loading state manually if needed
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    // Sync data from server
    builder
      .addCase(syncDataFromServer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(syncDataFromServer.fulfilled, (state, action) => {
        state.loading = false
        state.notes = action.payload.notes
        state.lastSyncTime = action.payload.syncTime

        if (action.payload.isOffline) {
          state.error = "Working offline - using local data"
        } else {
          state.error = null
        }
      })
      .addCase(syncDataFromServer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Add new care note
    builder
      .addCase(addCareNoteAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addCareNoteAsync.fulfilled, (state, action) => {
        state.loading = false
        state.notes = action.payload.notes
        state.error = null
      })
      .addCase(addCareNoteAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setLoading } = careNotesSlice.actions
export default careNotesSlice.reducer
