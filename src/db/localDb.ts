import PouchDB from "pouchdb";
import type { CareNote } from "../features/careNotes/careNotesSlice";

class LocalDatabase {
  private db: PouchDB.Database<CareNote>;

  constructor() {
    this.db = new PouchDB<CareNote>("care-notes");
  }

  async getAllNotes(): Promise<CareNote[]> {
    try {
      const result = await this.db.allDocs({ include_docs: true, descending: true });
      return result.rows.map((row) => row.doc!) as CareNote[];
    } catch (error) {
      console.error("Error reading from PouchDB:", error);
      return [];
    }
  }

  async addNote(note: CareNote): Promise<void> {
    try {
      const existingNotes = await this.getAllNotes();
      const noteExists = existingNotes.some((existingNote) => existingNote.id === note.id);
      if (!noteExists) {
        await this.db.put({ _id: String(new Date().toISOString()), ...note });
      }
    } catch (error) {
      console.error("Error adding note to PouchDB:", error);
      throw error;
    }
  }

  async updateNotes(notes: CareNote[]): Promise<void> {
    try {
      const existingNotes = await this.getAllNotes();
      const serverNoteIds = new Set(notes.map((note) => note.id));
      const localOnlyNotes = existingNotes.filter((note) => !serverNoteIds.has(note.id));

      const combinedNotes = [...notes, ...localOnlyNotes];
      for (const note of combinedNotes) {
        const docId = String(new Date(note.dateTime).toISOString());
        await this.db.put({ _id: docId, ...note });
      }
    } catch (error) {
      console.error("Error updating PouchDB:", error);
      throw error;
    }
  }

  async getRecentNotes(limit = 5): Promise<CareNote[]> {
    try {
      const allNotes = await this.getAllNotes();
      return allNotes
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error("Error getting recent notes:", error);
      return [];
    }
  }

  async updateNoteId(oldId: number, newId: number): Promise<void> {
    try {
      const allNotes = await this.getAllNotes();
      for (const note of allNotes) {
        if (note.id === oldId) {
          const updated = { ...note, id: newId };
          await this.db.put({ ...updated, _id: (note as any)._id, _rev: (note as any)._rev }); // maintain version
        }
      }
    } catch (error) {
      console.error("Error updating note ID:", error);
      throw error;
    }
  }

  async getMetadata(): Promise<{
    lastUpdated: number;
    noteCount: number;
    version: string;
  }> {
    const notes = await this.getAllNotes();
    return {
      lastUpdated: Date.now(),
      noteCount: notes.length,
      version: "1.0.0",
    };
  }

  async clearAll(): Promise<void> {
    try {
      const allDocs = await this.db.allDocs();
      const deletePromises = allDocs.rows.map((doc) =>
        this.db.remove(doc.id, doc.value.rev!)
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error clearing PouchDB:", error);
      throw error;
    }
  }

  async getStats(): Promise<{
    totalNotes: number;
    uniqueResidents: number;
    uniqueAuthors: number;
    oldestNote: string | null;
    newestNote: string | null;
  }> {
    try {
      const notes = await this.getAllNotes();

      if (notes.length === 0) {
        return {
          totalNotes: 0,
          uniqueResidents: 0,
          uniqueAuthors: 0,
          oldestNote: null,
          newestNote: null,
        };
      }

      const sortedByDate = notes.sort(
        (a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );
      return {
        totalNotes: notes.length,
        uniqueResidents: new Set(notes.map((note) => note.residentName)).size,
        uniqueAuthors: new Set(notes.map((note) => note.authorName)).size,
        oldestNote: sortedByDate[0]?.dateTime || null,
        newestNote: sortedByDate[sortedByDate.length - 1]?.dateTime || null,
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      return {
        totalNotes: 0,
        uniqueResidents: 0,
        uniqueAuthors: 0,
        oldestNote: null,
        newestNote: null,
      };
    }
  }
}

// Export a singleton
export const localDb = new LocalDatabase();
