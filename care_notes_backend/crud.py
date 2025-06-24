from sqlalchemy.orm import Session
from . import models, schemas

def create_note(db: Session, note: schemas.CareNoteCreate):
    db_note = models.CareNote(**note.dict())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def get_note(db: Session, note_id: int):
    return db.query(models.CareNote).filter(models.CareNote.id == note_id).first()

def get_notes(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.CareNote).offset(skip).limit(limit).all()
