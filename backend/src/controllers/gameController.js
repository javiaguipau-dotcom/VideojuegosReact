const Game = require('../models/Game');

// @desc    Get all games
// @route   GET /api/games
// @access  Private
const getGames = async (req, res) => {
    try {
        const games = await Game.find().populate('owner', 'username');
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user games
// @route   GET /api/games/mygames
// @access  Private
const getMyGames = async (req, res) => {
    try {
        const games = await Game.find({ owner: req.user.id });
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get game by ID
// @route   GET /api/games/:id
// @access  Private
const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id).populate('owner', 'username');
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new game
// @route   POST /api/games
// @access  Private
const createGame = async (req, res) => {
    const { title, description, urlimagen, precio, categorias, plataformas } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const game = await Game.create({
            title,
            description,
            urlimagen,
            precio,
            categorias,
            plataformas,
            owner: req.user.id,
        });
        res.status(201).json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete game
// @route   DELETE /api/games/:id
// @access  Private
const deleteGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check permissions: Owner or Admin
        if (game.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await game.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getGames,
    getMyGames,
    getGameById,
    createGame,
    deleteGame,
};
