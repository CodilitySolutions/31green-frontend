from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from care_notes_backend import models, schemas, crud
from care_notes_backend.database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify ["http://localhost:3000"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/care-notes/", response_model=schemas.CareNote)
def create_care_note(note: schemas.CareNoteCreate, db: Session = Depends(get_db)):
    return crud.create_note(db=db, note=note)

@app.get("/care-notes/", response_model=List[schemas.CareNote])
def read_notes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_notes(db, skip=skip, limit=limit)

@app.get("/care-notes/{note_id}", response_model=schemas.CareNote)
def read_note(note_id: int, db: Session = Depends(get_db)):
    db_note = crud.get_note(db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note





