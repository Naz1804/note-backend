const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController')
const { protect } = require('../middleware/auth');
const { noteLimiter } = require('../middleware/rateLimiter')


// Get all notes/archived
router.get('/', protect, noteController.getAllNotes)
router.get('/archived', protect, noteController.getAllNotes)

// search/filter
router.get('/search', protect, noteController.searchNotes)
router.get('/tags', protect, noteController.getAllTags)
router.get('/tag', protect, noteController.findTag)

// CRUD & Archive
router.post('/create', protect, noteLimiter, noteController.createNote)
router.get('/:id', protect, noteController.findNote)
router.patch('/:id', protect, noteController.updateNote)
router.delete('/:id', protect, noteController.deleteNote)
router.patch('/:id/archive', protect, noteController.archiveNote)

module.exports = router;