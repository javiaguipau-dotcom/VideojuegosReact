const Comment = require('../models/Comment');

// @desc    Add comment to a game
// @route   POST /api/games/:gameId/comments
// @access  Private
const addComment = async (req, res) => {
    try {
        const { text, parentComment } = req.body;
        const gameId = req.params.gameId;
        const userId = req.user.id;

        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        // If parentComment is provided, validate it exists and belongs to the same game
        if (parentComment) {
            const parent = await Comment.findById(parentComment);
            if (!parent) {
                return res.status(404).json({ message: 'Parent comment not found' });
            }
            if (parent.game.toString() !== gameId) {
                return res.status(400).json({ message: 'Parent comment does not belong to this game' });
            }
        }

        const comment = await Comment.create({
            game: gameId,
            user: userId,
            text,
            parentComment: parentComment || null
        });

        // Populate user info before returning
        await comment.populate('user', 'username');

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all comments for a game
// @route   GET /api/games/:gameId/comments
// @access  Public (or Private if you prefer)
const getComments = async (req, res) => {
    try {
        const gameId = req.params.gameId;

        const comments = await Comment.find({ game: gameId })
            .populate('user', 'username')
            .sort({ createdAt: 1 }); // Oldest first for comment threads

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is admin
        const isAdmin = userRole === 'admin';

        // Check if user owns the comment
        const isOwner = comment.user.toString() === userId;

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        // If user is not admin, check if comment has replies
        if (!isAdmin) {
            const hasReplies = await Comment.exists({ parentComment: commentId });
            if (hasReplies) {
                return res.status(400).json({ message: 'Cannot delete comment with replies' });
            }
        }

        await comment.deleteOne();

        res.status(200).json({ message: 'Comment deleted successfully', id: commentId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addComment,
    getComments,
    deleteComment
};
