const express = require('express');
const router = express.Router();
const {
    getGames,
    getMyGames,
    getGameById,
    createGame,
    deleteGame,
} = require('../controllers/gameController');
const { voteGame } = require('../controllers/voteController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getGames).post(protect, createGame);
router.route('/mygames').get(protect, getMyGames);
router.route('/:id').get(protect, getGameById).delete(protect, deleteGame);
router.route('/:id/vote').post(protect, voteGame);

module.exports = router;
