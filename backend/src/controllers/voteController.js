const Game = require('../models/Game');

// @desc    Vote on a game (like or dislike)
// @route   POST /api/games/:id/vote
// @access  Private
const voteGame = async (req, res) => {
    try {
        const { voteType } = req.body; // 'like' or 'dislike'
        const gameId = req.params.id;
        const userId = req.user.id;

        if (!['like', 'dislike'].includes(voteType)) {
            return res.status(400).json({ message: 'Invalid vote type. Must be "like" or "dislike"' });
        }

        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Remove user from both arrays (in case they're changing their vote)
        game.likes = game.likes.filter(id => id.toString() !== userId);
        game.dislikes = game.dislikes.filter(id => id.toString() !== userId);

        // Add user to the selected array
        if (voteType === 'like') {
            game.likes.push(userId);
        } else {
            game.dislikes.push(userId);
        }

        await game.save();

        // Return updated counts
        res.status(200).json({
            likes: game.likes.length,
            dislikes: game.dislikes.length,
            userVote: voteType
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { voteGame };
