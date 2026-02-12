const User = require('../models/User');
const Game = require('../models/Game');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        const userCount = await User.countDocuments();

        if (userCount > 0) {
            console.log('Data already exists, skipping seed.');
            return;
        }

        console.log('Seeding database...');

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const adminUser = await User.create({
            username: 'admin',
            password: 'password123', // Model pre-save hook might hash this again if not careful, but let's rely on model
            role: 'admin'
        });

        const normalUser = await User.create({
            username: 'gamer',
            password: 'password123',
            role: 'user'
        });

        // Create Games
        const games = [
            {
                title: 'The Legend of Zelda: Breath of the Wild',
                description: 'Un juego de mundo abierto...',
                urlimagen: 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a77969113f080',
                precio: 59.99,
                categorias: ['Aventura', 'Acción', 'RPG'],
                plataformas: ['Nintendo Switch'],
                owner: adminUser._id
            },
            {
                title: 'Elden Ring',
                description: 'Un RPG de acción desafiante...',
                urlimagen: 'https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/phzKk2rVvA7tKk7k9e3k5a2b.png',
                precio: 69.99,
                categorias: ['RPG', 'Acción'],
                plataformas: ['PC', 'PS5', 'Xbox'],
                owner: adminUser._id
            },
            {
                title: 'Super Mario Odyssey',
                description: 'Aventura de plataformas en 3D...',
                urlimagen: 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000000127/b320306323398935395632732997233816503943343353322238493223399991',
                precio: 49.99,
                categorias: ['Plataformas', 'Aventura'],
                plataformas: ['Nintendo Switch'],
                owner: normalUser._id
            },
            {
                title: 'God of War Ragnarök',
                description: 'Kratos y Atreus deben viajar a cada uno de los nueve reinos...',
                urlimagen: 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png',
                precio: 69.99,
                categorias: ['Acción', 'Aventura'],
                plataformas: ['PS5', 'PS4'],
                owner: adminUser._id
            }
        ];

        await Game.insertMany(games);
        console.log('Database seeded successfully!');

    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedDatabase;
