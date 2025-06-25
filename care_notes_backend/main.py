# Import FastAPI components and SQLAlchemy session handling
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

# Import application modules: models, schemas, CRUD operations, and database setup
from care_notes_backend import models, schemas, crud
from care_notes_backend.database import SessionLocal, engine

# CORS middleware for handling cross-origin requests
from fastapi.middleware.cors import CORSMiddleware

# (Unused import - can be removed unless planning to use async DB sessions)
from sqlalchemy.ext.asyncio import AsyncSession

# Create all database tables based on the models' metadata
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# Configure CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for production, specify allowed domains)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Dependency to provide a database session to route functions
def get_db():
    db = SessionLocal()  # Create a new database session
    try:
        yield db          # Yield the session to the request
    finally:
        db.close()        # Close the session after the request is handled

# Endpoint to create a new care note
@app.post("/care-notes/", response_model=schemas.CareNote)
def create_care_note(note: schemas.CareNoteCreate, db: Session = Depends(get_db)):
    return crud.create_note(db=db, note=note)

# Endpoint to retrieve a list of care notes with pagination
@app.get("/care-notes/", response_model=List[schemas.CareNote])
def read_notes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_notes(db, skip=skip, limit=limit)

# Endpoint to retrieve a single care note by its ID
@app.get("/care-notes/{note_id}", response_model=schemas.CareNote)
def read_note(note_id: int, db: Session = Depends(get_db)):
    db_note = crud.get_note(db, note_id=note_id)
    if db_note is None:
        # Raise a 404 error if the note is not found
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note
