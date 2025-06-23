import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import CareNoteList from "../components/CareNoteList"
import AddCareNoteForm from "../components/AddCareNoteForm"
import type { AppDispatch } from "../app/store"
import { syncDataFromServer } from "../features/careNotes/careNotesSlice"
import "./HomePage.css"

/**
 * HomePage component that manages the main application state and layout
 * Handles the switching between list view and add form view
 * Manages data synchronization with the server
 */
const HomePage: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Initial data sync when component mounts
    dispatch(syncDataFromServer())

    // Set up polling to sync data every 60 seconds
    const syncInterval = setInterval(() => {
      dispatch(syncDataFromServer())
    }, 60000) // 60 seconds

    // Cleanup interval on component unmount
    return () => {
      clearInterval(syncInterval)
    }
  }, [dispatch])

  /**
   * Handles showing the add care note form
   */
  const handleShowAddForm = (): void => {
    setShowAddForm(true)
  }

  /**
   * Handles hiding the add care note form and returning to list view
   */
  const handleHideAddForm = (): void => {
    setShowAddForm(false)
  }

  return (
    <div className="home-page">
      <div className="container">
        {showAddForm ? <AddCareNoteForm onClose={handleHideAddForm} /> : <CareNoteList onAddNote={handleShowAddForm} />}
      </div>
    </div>
  )
}

export default HomePage
