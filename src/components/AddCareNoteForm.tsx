import type React from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../app/store"
import { addCareNoteAsync } from "../features/careNotes/careNotesSlice"
import "./AddCareNoteForm.css"

interface AddCareNoteFormProps {
  onClose: () => void
}

interface FormData {
  residentName: string
  authorName: string
  content: string
}

interface FormErrors {
  residentName?: string
  authorName?: string
  content?: string
  submit?: string
}

/**
 * AddCareNoteForm component provides a form interface for adding new care notes
 * Includes form validation, error handling, and integration with Redux store
 * Follows offline-first approach by saving locally first, then syncing to server
 */
const AddCareNoteForm: React.FC<AddCareNoteFormProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>()

  const [formData, setFormData] = useState<FormData>({
    residentName: "",
    authorName: "",
    content: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  /**
   * Validates form data and returns validation errors
   */
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}

    if (!formData.residentName.trim()) {
      newErrors.residentName = "Resident name is required"
    } else if (formData.residentName.trim().length < 2) {
      newErrors.residentName = "Resident name must be at least 2 characters"
    }

    if (!formData.authorName.trim()) {
      newErrors.authorName = "Author name is required"
    } else if (formData.authorName.trim().length < 2) {
      newErrors.authorName = "Author name must be at least 2 characters"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Note content is required"
    } else if (formData.content.trim().length < 10) {
      newErrors.content = "Note content must be at least 10 characters"
    }

    return newErrors
  }

  /**
   * Handles input changes and clears related errors
   */
  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    // Validate form
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Create new care note object
      const newNote = {
        residentName: formData.residentName.trim(),
        authorName: formData.authorName.trim(),
        content: formData.content.trim(),
        dateTime: new Date().toISOString(),
      }

      // Dispatch async action to add note (handles local storage and server sync)
      await dispatch(addCareNoteAsync(newNote)).unwrap()

      // Success - close form
      onClose()
    } catch (error) {
      console.error("Failed to save care note:", error)
      setErrors({
        submit: "Failed to save care note. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handles form cancellation
   */
  const handleCancel = (): void => {
    if (isSubmitting) return
    onClose()
  }

  return (
    <div className="add-care-note-form">
      <div className="form-container">
        <div className="form-header">
          <h2>Add Care Note</h2>
        </div>

        <form onSubmit={handleSubmit} className="care-note-form">
          {/* Resident Name Field */}
          <div className="form-group">
            <label htmlFor="residentName" className="form-label">
              Resident Name:
            </label>
            <input
              type="text"
              id="residentName"
              value={formData.residentName}
              onChange={(e) => handleInputChange("residentName", e.target.value)}
              className={`form-input ${errors.residentName ? "error" : ""}`}
              disabled={isSubmitting}
              placeholder="Enter resident's full name"
              maxLength={100}
            />
            {errors.residentName && <span className="error-message">{errors.residentName}</span>}
          </div>

          {/* Author Name Field */}
          <div className="form-group">
            <label htmlFor="authorName" className="form-label">
              Author Name:
            </label>
            <input
              type="text"
              id="authorName"
              value={formData.authorName}
              onChange={(e) => handleInputChange("authorName", e.target.value)}
              className={`form-input ${errors.authorName ? "error" : ""}`}
              disabled={isSubmitting}
              placeholder="Enter your name"
              maxLength={100}
            />
            {errors.authorName && <span className="error-message">{errors.authorName}</span>}
          </div>

          {/* Note Content Field */}
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Note Content:
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className={`form-textarea ${errors.content ? "error" : ""}`}
              disabled={isSubmitting}
              placeholder="Enter detailed care note..."
              rows={6}
              maxLength={1000}
            />
            <div className="character-count">{formData.content.length}/1000 characters</div>
            {errors.content && <span className="error-message">{errors.content}</span>}
          </div>

          {/* Submit Error */}
          {errors.submit && <div className="form-error">{errors.submit}</div>}

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCareNoteForm
