import type { CareNote, CreateCareNoteRequest } from "../features/careNotes/careNotesSlice"

/**
 * API client for care notes operations
 * Handles HTTP requests to the mock server endpoints
 */
class CareNotesAPI {
  private baseUrl: string

  constructor() {
    // In a real application, this would come from environment variables
    this.baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3001/api"
  }

  /**
   * Fetches all care notes from the server
   * @returns Promise<CareNote[]> Array of care notes
   */
  async getCareNotes(): Promise<CareNote[]> {
    try {
      const response = await fetch(`${this.baseUrl}/care-notes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching care notes:", error)
      throw error
    }
  }

  /**
   * Creates a new care note on the server
   * @param noteData The care note data to create
   * @returns Promise<CareNote> The created care note with server-generated ID
   */
  async createCareNote(noteData: CreateCareNoteRequest): Promise<CareNote> {
    try {
      const response = await fetch(`${this.baseUrl}/care-notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error creating care note:", error)
      throw error
    }
  }
}

// Export a singleton instance
export const careNotesApi = new CareNotesAPI()
