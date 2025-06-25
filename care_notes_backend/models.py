# Import SQLAlchemy components for defining table columns and data types
from sqlalchemy import Column, Integer, String, DateTime
# Import the Base class from the database module to use for model declaration
from .database import Base

# Define the CareNote model representing the 'care_notes' table in the database
class CareNote(Base):
    __tablename__ = "care_notes"  # Name of the table in the database

    # Unique identifier for each note (Primary Key)
    id = Column(Integer, primary_key=True, index=True)

    # Name of the resident the note is about
    residentName = Column(String, nullable=False)

    # Date and time when the note was written
    dateTime = Column(DateTime, nullable=False)

    # Main content of the note
    content = Column(String, nullable=False)

    # Name of the staff member who wrote the note
    authorName = Column(String, nullable=False)
