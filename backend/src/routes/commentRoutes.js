const express = require('express');
const router = express.Router();
const {
    addComment,
    getComments,
    deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Routes for game comments
router.route('/:gameId/comments')
    .get(getComments)
    .post(protect, addComment);

// Route for deleting individual comments
router.route('/comments/:id')
    .delete(protect, deleteComment);

module.exports = router;
