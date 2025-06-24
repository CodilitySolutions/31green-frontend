from sqlalchemy import Column, Integer, String, DateTime
from .database import Base

class CareNote(Base):
    __tablename__ = "care_notes"

    id = Column(Integer, primary_key=True, index=True)
    residentName = Column(String, nullable=False)
    dateTime = Column(DateTime, nullable=False)
    content = Column(String, nullable=False)
    authorName = Column(String, nullable=False)
