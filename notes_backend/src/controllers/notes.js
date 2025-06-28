const notesService = require('../services/notes');

/**
 * Controller for note CRUD operations
 */
class NotesController {
  // PUBLIC_INTERFACE
  /**
   * List all notes
   */
  async list(req, res) {
    try {
      const notes = notesService.getAll();
      res.status(200).json(notes);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch notes.' });
    }
  }
  // PUBLIC_INTERFACE
  /**
   * Get a single note by ID
   */
  async get(req, res) {
    const id = req.params.id;
    if (!notesService.isValidId(id)) {
      return res.status(400).json({ error: 'Invalid note ID.' });
    }
    const note = notesService.getById(id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found.' });
    }
    return res.json(note);
  }
  // PUBLIC_INTERFACE
  /**
   * Create a new note
   */
  async create(req, res) {
    const { title, content } = req.body;
    // Input validation
    if (
      typeof title !== 'string' ||
      title.trim().length < 1 ||
      typeof content !== 'string'
    ) {
      return res.status(400).json({
        error: 'Title and content must be non-empty strings.',
      });
    }
    try {
      const note = notesService.create({ title: title.trim(), content });
      return res.status(201).json(note);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to create note.' });
    }
  }
  // PUBLIC_INTERFACE
  /**
   * Update an existing note by ID
   */
  async update(req, res) {
    const id = req.params.id;
    if (!notesService.isValidId(id)) {
      return res.status(400).json({ error: 'Invalid note ID.' });
    }
    const { title, content } = req.body;
    if (
      (title !== undefined && (typeof title !== 'string' || title.trim().length < 1)) ||
      (content !== undefined && typeof content !== 'string')
    ) {
      return res.status(400).json({
        error: 'Title and content, if provided, must be non-empty strings.',
      });
    }
    const updatedNote = notesService.update(id, {
      ...(title !== undefined ? { title: title.trim() } : {}),
      ...(content !== undefined ? { content } : {}),
    });
    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found.' });
    }
    return res.json(updatedNote);
  }
  // PUBLIC_INTERFACE
  /**
   * Delete a note by ID
   */
  async delete(req, res) {
    const id = req.params.id;
    if (!notesService.isValidId(id)) {
      return res.status(400).json({ error: 'Invalid note ID.' });
    }
    const deleted = notesService.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Note not found.' });
    }
    return res.status(204).send();
  }
}

module.exports = new NotesController();
