const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    urlimagen: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    precio: {
        type: Number,
        default: 0
    },
    categorias: [String],
    plataformas: [String],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
