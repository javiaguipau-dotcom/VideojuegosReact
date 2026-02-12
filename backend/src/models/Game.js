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
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reports: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reason: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isReported: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for popularity calculation
gameSchema.virtual('popularity').get(function () {
    return this.likes.length - this.dislikes.length;
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
