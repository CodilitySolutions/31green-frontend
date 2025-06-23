import type React from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import type { CareNote } from "../features/careNotes/careNotesSlice"
import "./CareNoteList.css"

interface CareNoteListProps {
  onAddNote: () => void
}

/**
 * CareNoteList component displays a list of care notes with filtering capabilities
 * Shows the 5 most recent care notes from the Redux store
 * Includes filtering by resident name and an add note button
 */
const CareNoteList: React.FC<CareNoteListProps> = ({ onAddNote }) => {
  const { notes, loading, error, lastSyncTime } = useSelector((state: RootState) => state.careNotes)
  console.log("notes -----> ", notes)
  const [filterResident, setFilterResident] = useState<string>("all")

  // Get unique resident names for filter dropdown
  const uniqueResidents = Array.from(new Set(notes.map((note: CareNote) => note.residentName)))

  // Filter notes based on selected resident
  const filteredNotes = filterResident === "all" ? notes : notes.filter((note: CareNote) => note.residentName === filterResident)

  /**
   * Formats a date string into a readable format
   */
  const formatDateTime = (dateTime: string): string => {
    const date = new Date(dateTime)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`
  }

  /**
   * Formats the last sync time for display
   */
  const formatLastSync = (timestamp: number | null): string => {
    if (!timestamp) return "Never"
    const date = new Date(timestamp)
    return `${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }

  if (loading) {
    return (
      <div className="care-note-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading care notes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="care-note-list">
      {/* Header Section */}
      <div className="header">
        <h1>Care Notes</h1>
        <div className="header-controls">
          <div className="filter-container">
            <label htmlFor="resident-filter">Filter by Resident:</label>
            <select
              id="resident-filter"
              value={filterResident}
              onChange={(e) => setFilterResident(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Residents</option>
              {uniqueResidents.map((resident) => (
                <option key={resident} value={resident}>
                  {resident}
                </option>
              ))}
            </select>
          </div>
          <button className="add-note-btn" onClick={onAddNote} aria-label="Add new care note">
            + Add Note
          </button>
        </div>
      </div>

      {/* Sync Status */}
      <div className="sync-status">
        <span className={`sync-indicator ${error ? "error" : "success"}`}>{error ? "⚠️" : "✅"}</span>
        <span className="sync-text">
          Last sync: {formatLastSync(lastSyncTime)}
          {error && ` (${error})`}
        </span>
      </div>

      {/* Notes List */}
      <div className="notes-container">
        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <h3>No care notes found</h3>
            <p>
              {filterResident === "all"
                ? "No care notes have been added yet."
                : `No care notes found for ${filterResident}.`}
            </p>
            <button className="add-first-note-btn" onClick={onAddNote}>
              Add First Note
            </button>
          </div>
        ) : (
          <div className="notes-list">
            {filteredNotes.map((note: CareNote) => (
              <div key={note.id} className="note-card">
                <div className="note-header">
                  <h3 className="resident-name">{note.residentName}</h3>
                  <div className="note-meta">
                    <span className="note-date">{formatDateTime(note.dateTime)}</span>
                    <span className="note-author">by {note.authorName}</span>
                  </div>
                </div>
                <div className="note-content">
                  <p>{note.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="footer-info">
        <p>
          Showing {filteredNotes.length} of {notes.length} recent notes
        </p>
        <p className="sync-info">Data syncs automatically every 60 seconds</p>
      </div>
    </div>
  )
}

export default CareNoteList
