# Import Pydantic's BaseModel for data validation and serialization
from pydantic import BaseModel
from datetime import datetime
from typing import List

# Base schema shared by create and response models
class CareNoteBase(BaseModel):
    residentName: str       # Name of the resident
    dateTime: datetime      # Date and time of the note
    content: str            # Content of the care note
    authorName: str         # Author of the note

# Schema for creating a new care note (inherits fields from CareNoteBase)
class CareNoteCreate(CareNoteBase):
    pass  # No additional fields required for creation

# Schema for returning a care note, includes an ID
class CareNote(CareNoteBase):
    id: int  # Unique identifier for the care note

    class Config:
        orm_mode = True  # Enables compatibility with ORM objects like SQLAlchemy models

# Schema for bulk creation of multiple care notes
class CareNoteBulkCreate(BaseModel):
    notes: List[CareNoteCreate]  # List of notes to be created
