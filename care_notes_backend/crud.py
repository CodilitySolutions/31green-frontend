# Import the Session class for database interaction from SQLAlchemy ORM
from sqlalchemy.orm import Session
# Import local modules: models for database models, schemas for request/response data validation
from . import models, schemas

# Function to create a new care note in the database
def create_note(db: Session, note: schemas.CareNoteCreate):
    # Create a CareNote model instance from the input schema
    db_note = models.CareNote(**note.dict())
    # Add the new note to the session
    db.add(db_note)
    # Commit the transaction to save changes
    db.commit()
    # Refresh the instance with the new database state (e.g., auto-generated ID)
    db.refresh(db_note)
    # Return the newly created note
    return db_note

# Function to retrieve a single care note by its ID
def get_note(db: Session, note_id: int):
    # Query the CareNote table and return the first record that matches the given ID
    return db.query(models.CareNote).filter(models.CareNote.id == note_id).first()

# Function to retrieve multiple care notes with pagination support
def get_notes(db: Session, skip: int = 0, limit: int = 10):
    # Query the CareNote table, skipping 'skip' records and limiting to 'limit' records
    return db.query(models.CareNote).offset(skip).limit(limit).all()
