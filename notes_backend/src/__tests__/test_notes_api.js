const request = require('supertest');
const app = require('../app');

describe('Notes API', () => {
  let createdNoteId;

  // Helper to create a note
  async function createNote(title = 'Test Note', content = 'This is a test note.') {
    const res = await request(app)
      .post('/notes')
      .send({ title, content })
      .expect('Content-Type', /json/);
    return res;
  }

  beforeEach(() => {
    // No-op; the notes service uses in-memory data which resets on re-import/test process restart.
    // If persistence is added, reset/mocking/cleanup logic would be placed here.
  });

  describe('POST /notes', () => {
    it('should create a note and return 201', async () => {
      const res = await createNote('Alpha', 'Bravo');
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Alpha');
      expect(res.body.content).toBe('Bravo');
      expect(res.body).toHaveProperty('created_at');
      expect(res.body).toHaveProperty('updated_at');
      createdNoteId = res.body.id;
    });

    it('should reject missing fields', async () => {
      const res = await request(app)
        .post('/notes')
        .send({})
        .expect('Content-Type', /json/);
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Title and content must be non-empty strings/);
    });

    it('should reject missing content', async () => {
      const res = await request(app)
        .post('/notes')
        .send({ title: 'Incomplete Note' })
        .expect('Content-Type', /json/);
      expect(res.status).toBe(400);
    });

    it('should reject empty title', async () => {
      const res = await request(app)
        .post('/notes')
        .send({ title: '', content: 'Has content' })
        .expect('Content-Type', /json/);
      expect(res.status).toBe(400);
    });

    it('should reject non-string title', async () => {
      const res = await request(app)
        .post('/notes')
        .send({ title: 1234, content: 'Test' })
        .expect('Content-Type', /json/);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /notes', () => {
    it('should return an array of notes', async () => {
      // Ensure at least one note exists
      await createNote('Another', 'Note');
      const res = await request(app)
        .get('/notes')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      res.body.forEach(note => {
        expect(note).toHaveProperty('id');
        expect(note).toHaveProperty('title');
        expect(note).toHaveProperty('content');
      });
    });
  });

  describe('GET /notes/:id', () => {
    let myNote;

    beforeEach(async () => {
      myNote = (await createNote('FindMe', 'Searching')).body;
    });

    it('should fetch a note by valid id', async () => {
      const res = await request(app)
        .get(`/notes/${myNote.id}`)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(res.body.id).toEqual(myNote.id);
      expect(res.body.title).toEqual('FindMe');
    });

    it('should return 400 for invalid id', async () => {
      const res = await request(app)
        .get('/notes/invalid-id')
        .expect('Content-Type', /json/)
        .expect(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/Invalid note ID/);
    });

    it('should return 404 for non-existent id', async () => {
      const uuid = '538d63c1-9b70-4c77-a803-a0cea03b85f3'; // random UUID unlikely to exist
      const res = await request(app)
        .get(`/notes/${uuid}`)
        .expect('Content-Type', /json/)
        .expect(404);
      expect(res.body.error).toMatch(/Note not found/);
    });
  });

  describe('PUT /notes/:id', () => {
    let updatableNote;

    beforeEach(async () => {
      updatableNote = (await createNote('UpdateMe', 'Original')).body;
    });

    it('should update an existing note', async () => {
      const res = await request(app)
        .put(`/notes/${updatableNote.id}`)
        .send({ title: 'Updated', content: 'Changed content' })
        .expect('Content-Type', /json/)
        .expect(200);
      expect(res.body.id).toBe(updatableNote.id);
      expect(res.body.title).toBe('Updated');
      expect(res.body.content).toBe('Changed content');
    });

    it('should partially update note title', async () => {
      const res = await request(app)
        .put(`/notes/${updatableNote.id}`)
        .send({ title: 'Partially Updated' })
        .expect('Content-Type', /json/)
        .expect(200);
      expect(res.body.title).toBe('Partially Updated');
      expect(res.body.content).toBe('Original');
    });

    it('should reject invalid note id', async () => {
      const res = await request(app)
        .put('/notes/INVALID_ID')
        .send({ title: 'X' })
        .expect('Content-Type', /json/)
        .expect(400);
    });

    it('should return 404 for updating non-existent note', async () => {
      const uuid = '30345b27-ef29-4a38-b865-d8e5db357a03';
      const res = await request(app)
        .put(`/notes/${uuid}`)
        .send({ title: 'Ghost' })
        .expect('Content-Type', /json/)
        .expect(404);
      expect(res.body.error).toMatch(/Note not found/);
    });

    it('should reject invalid input (empty title)', async () => {
      const res = await request(app)
        .put(`/notes/${updatableNote.id}`)
        .send({ title: '' })
        .expect('Content-Type', /json/)
        .expect(400);
      expect(res.body.error).toMatch(/non-empty strings/);
    });

    it('should reject input with non-string content', async () => {
      const res = await request(app)
        .put(`/notes/${updatableNote.id}`)
        .send({ content: 1234 })
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });

  describe('DELETE /notes/:id', () => {
    let deletableNote;

    beforeEach(async () => {
      deletableNote = (await createNote('DeleteMe', 'Bye')).body;
    });

    it('should delete an existing note', async () => {
      const res = await request(app)
        .delete(`/notes/${deletableNote.id}`)
        .expect(204);
      // Should not return content
      expect(res.body).toEqual({});
      // Confirm note is gone
      await request(app)
        .get(`/notes/${deletableNote.id}`)
        .expect(404);
    });

    it('should return 400 for invalid id', async () => {
      const res = await request(app)
        .delete('/notes/not-a-uuid')
        .expect('Content-Type', /json/)
        .expect(400);
      expect(res.body.error).toMatch(/Invalid note ID/);
    });

    it('should return 404 for non-existent note', async () => {
      // Already deleted
      const uuid = '5a2efc01-cdd8-4bdb-89bb-66d5de0ab7f4';
      const res = await request(app)
        .delete(`/notes/${uuid}`)
        .expect('Content-Type', /json/)
        .expect(404);
      expect(res.body.error).toMatch(/Note not found/);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle internal error gracefully (simulate crash)', async () => {
      // Simulate a crash in controller.
      jest.spyOn(require('../services/notes'), 'getAll').mockImplementationOnce(() => {
        throw new Error('Forced failure');
      });
      const res = await request(app).get('/notes');
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('status', 'error');
    });

    it('should return 404 for non-existent endpoint', async () => {
      const res = await request(app).get('/doesnotexist').expect(404);
      expect(res.body).toEqual({});
    });

    it('should return 405 or 404 for method not allowed', async () => {
      // Express default router will return 404
      const res = await request(app).patch('/notes').expect(404);
    });
  });
});
