const Game = require('../models/Game');

// @desc    Get all games
// @route   GET /api/games
// @access  Private
const getGames = async (req, res) => {
    try {
        // Get pagination parameters from query string
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Validate limit to allowed values
        const allowedLimits = [5, 10, 20, 50];
        const validLimit = allowedLimits.includes(limit) ? limit : 10;

        // Calculate skip value
        const skip = (page - 1) * validLimit;

        // Get total count for pagination metadata
        const totalGames = await Game.countDocuments();

        // Get sort parameter
        const sort = req.query.sort || 'newest';
        let sortQuery = {};

        switch (sort) {
            case 'popularity':
                // For popularity sorting, we need to add a computed field
                sortQuery = { $expr: { $subtract: [{ $size: "$likes" }, { $size: "$dislikes" }] } };
                break;
            case 'price-high':
                sortQuery = { precio: -1 };
                break;
            case 'price-low':
                sortQuery = { precio: 1 };
                break;
            case 'oldest':
                sortQuery = { createdAt: 1 };
                break;
            case 'newest':
            default:
                sortQuery = { createdAt: -1 };
                break;
        }


        // Fetch paginated games
        let games;
        if (sort === 'popularity') {
            // For popularity, we need to use aggregation
            games = await Game.aggregate([
                {
                    $addFields: {
                        popularity: { $subtract: [{ $size: "$likes" }, { $size: "$dislikes" }] }
                    }
                },
                { $sort: { popularity: -1 } },
                { $skip: skip },
                { $limit: validLimit },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'owner',
                        foreignField: '_id',
                        as: 'owner'
                    }
                },
                { $unwind: '$owner' },
                {
                    $project: {
                        'owner.password': 0
                    }
                }
            ]);
        } else {
            games = await Game.find()
                .populate('owner', 'username')
                .limit(validLimit)
                .skip(skip)
                .sort(sortQuery);
        }

        // Calculate total pages
        const totalPages = Math.ceil(totalGames / validLimit);

        // Return paginated response
        res.status(200).json({
            games,
            pagination: {
                totalGames,
                currentPage: page,
                totalPages,
                limit: validLimit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
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

// @desc    Report a game
// @route   POST /api/games/:id/report
// @access  Private
const reportGame = async (req, res) => {
    try {
        const { reason } = req.body;
        const gameId = req.params.id;
        const userId = req.user.id;

        if (!reason || reason.trim() === '') {
            return res.status(400).json({ message: 'Report reason is required' });
        }

        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Check if user already reported this game
        const alreadyReported = game.reports.some(report => report.user.toString() === userId);
        if (alreadyReported) {
            return res.status(400).json({ message: 'You have already reported this game' });
        }

        // Add report to game
        game.reports.push({
            user: userId,
            reason,
            createdAt: new Date()
        });

        // Mark game as reported if it has at least one report
        game.isReported = true;

        await game.save();

        res.status(200).json({ message: 'Game reported successfully', reportCount: game.reports.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reported games
// @route   GET /api/games/reported
// @access  Admin only
const getReportedGames = async (req, res) => {
    try {
        const reportedGames = await Game.find({ isReported: true })
            .populate('owner', 'username')
            .populate('reports.user', 'username')
            .sort({ 'reports.createdAt': -1 }); // Most recently reported first

        res.status(200).json(reportedGames);
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
    reportGame,
    getReportedGames
};
