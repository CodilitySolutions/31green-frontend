from pydantic import BaseModel
from datetime import datetime
from typing import List

class CareNoteBase(BaseModel):
    residentName: str
    dateTime: datetime
    content: str
    authorName: str

class CareNoteCreate(CareNoteBase):
    pass

class CareNote(CareNoteBase):
    id: int

    class Config:
        orm_mode = True

class CareNoteBulkCreate(BaseModel):
    notes: List[CareNoteCreate]
