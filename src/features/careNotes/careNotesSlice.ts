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
  isSynced?: boolean
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
export const syncDataFromServer = createAsyncThunk(
  "careNotes/syncFromServer",
  async (_, { rejectWithValue }) => {
    try {
      // 🟢 STEP 1: Get pending notes from local database
      const pendingNotes = await localDb.getAllNotes({ unsynced: true });
      if (pendingNotes.length > 0) {
        console.log(`Found ${pendingNotes.length} pending notes, syncing...`);

        for (const note of pendingNotes) {
          if (!note || note.isSynced) {
            continue;
          }
          try {
            await careNotesApi.createCareNote(note);
          } catch (error) {
            console.error(`❌ Failed to sync note ${note.id}`, error);
            // Optional: continue or reject here
          }
        }
      }

      // 🟢 STEP 2: Get fresh notes from the server
      const serverNotes = await careNotesApi.getCareNotes();
      const sortedNotes = serverNotes.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
      // 🟢 STEP 3: Clear old local data
      await localDb.clearAll();

      // 🟢 STEP 4: Save fresh server data to local database
      await localDb.updateNotes(sortedNotes);

      // 🟢 STEP 5: Get recent notes for state
      const recentNotes = await localDb.getRecentNotes(5);

      return {
        notes: recentNotes,
        syncTime: Date.now(),
      };
    } catch (error) {
      console.warn("Server sync failed, loading from local database:", error);
      try {
        const localNotes = await localDb.getRecentNotes(5);
        return {
          notes: localNotes,
          syncTime: Date.now(),
          isOffline: true,
        };
      } catch (localError) {
        console.error("Failed to load from local database:", localError);
        return rejectWithValue("Failed to load care notes");
      }
    }
  }
);


/**
 * Async thunk for adding a new care note
 * Implements offline-first approach: save locally first, then sync to server
 */
export const addCareNoteAsync = createAsyncThunk(
  "careNotes/addNote",
  async (noteData: CreateCareNoteRequest, { rejectWithValue }) => {
    try {
      const tempId = Date.now();
      const newNote: CareNote = {
        ...noteData,
        id: tempId,
      };

      // 🟢 Try server first
      try {
        const serverNote = await careNotesApi.createCareNote(noteData);
        // Server succeeded ➔ isSynced: true
        const savedNote = { ...serverNote, isSynced: true };
        await localDb.addNote(savedNote);
        const recentNotes = await localDb.getRecentNotes(5);
        return { notes: recentNotes, newNote: savedNote };
      } catch (serverError) {
        console.warn("❌ Offline or server error, saving local copy:", serverError);
        // Offline ➔ isSynced: false
        const offlineNote = { ...newNote, isSynced: false };
        await localDb.addNote(offlineNote);
        const recentNotes = await localDb.getRecentNotes(5);
        return { notes: recentNotes, newNote: offlineNote };
      }
    } catch (error) {
      console.error("Failed to add care note:", error);
      return rejectWithValue("Failed to save care note");
    }
  }
);


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
