const express = require('express');
const healthController = require('../controllers/health');
const notesController = require('../controllers/notes');

const router = express.Router();

// Health endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "38a2b041-c0b6-4c1e-a2d7-b46b228a3aa0"
 *         title:
 *           type: string
 *           example: "Shopping List"
 *         content:
 *           type: string
 *           example: "Eggs, Milk, Bread"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     CreateNoteInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Meeting notes"
 *         content:
 *           type: string
 *           example: "Discuss roadmap"
 *       required: [title, content]
 *     UpdateNoteInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Updated title"
 *         content:
 *           type: string
 *           example: "Updated content"
 * /notes:
 *   get:
 *     summary: List all notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       description: The note to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNoteInput'
 *     responses:
 *       201:
 *         description: Note created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 * /notes/{id}:
 *   get:
 *     summary: Get note details
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the note
 *     responses:
 *       200:
 *         description: Note found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Note not found
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNoteInput'
 *     responses:
 *       200:
 *         description: Note updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Note not found
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the note
 *     responses:
 *       204:
 *         description: Note deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Note not found
 */

// RESTful routes for Notes
router.get('/notes', notesController.list.bind(notesController));
router.get('/notes/:id', notesController.get.bind(notesController));
router.post('/notes', notesController.create.bind(notesController));
router.put('/notes/:id', notesController.update.bind(notesController));
router.delete('/notes/:id', notesController.delete.bind(notesController));

module.exports = router;
