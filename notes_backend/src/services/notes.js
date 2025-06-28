const { v4: uuidv4, validate: uuidValidate } = require('uuid');

/**
 * Service for in-memory storage and retrieval of notes.
 */
class NotesService {
  constructor() {
    // Array to hold notes: { id, title, content, created_at, updated_at }
    this.notes = [];
  }

  // PUBLIC_INTERFACE
  /**
   * List all notes.
   */
  getAll() {
    return this.notes;
  }

  // PUBLIC_INTERFACE
  /**
   * Get a note by ID.
   */
  getById(id) {
    return this.notes.find((n) => n.id === id) || null;
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new note.
   * @param {Object} data - { title, content }
   */
  create({ title, content }) {
    const now = new Date().toISOString();
    const note = {
      id: uuidv4(),
      title,
      content,
      created_at: now,
      updated_at: now,
    };
    this.notes.push(note);
    return note;
  }

  // PUBLIC_INTERFACE
  /**
   * Update an existing note by ID
   */
  update(id, { title, content }) {
    const note = this.getById(id);
    if (!note) return null;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    note.updated_at = new Date().toISOString();
    return note;
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a note by ID
   */
  delete(id) {
    const idx = this.notes.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    this.notes.splice(idx, 1);
    return true;
  }

  // PUBLIC_INTERFACE
  /**
   * Check if the provided ID is a valid UUID.
   */
  isValidId(id) {
    return typeof id === 'string' && uuidValidate(id);
  }
}

module.exports = new NotesService();
