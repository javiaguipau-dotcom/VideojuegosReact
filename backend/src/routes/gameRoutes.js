const express = require('express');
const router = express.Router();
const {
    getGames,
    getMyGames,
    getGameById,
    createGame,
    deleteGame,
    reportGame,
    getReportedGames
} = require('../controllers/gameController');
const { voteGame } = require('../controllers/voteController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getGames).post(protect, createGame);
router.route('/reported').get(protect, admin, getReportedGames);
router.route('/mygames').get(protect, getMyGames);
router.route('/:id').get(protect, getGameById).delete(protect, deleteGame);
router.route('/:id/vote').post(protect, voteGame);
router.route('/:id/report').post(protect, reportGame);

module.exports = router;
