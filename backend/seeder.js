const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Game = require('./src/models/Game');
const connectDB = require('./src/config/db');

dotenv.config();

const importData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Game.deleteMany();

        // Create Users
        const user = await User.create({
            username: 'admin',
            password: 'password123',
            role: 'admin'
        });

        const user2 = await User.create({
            username: 'gamer',
            password: 'password123',
            role: 'user'
        });

        console.log('Users Created');

        // Create Games
        const games = [
            {
                title: 'The Legend of Zelda: Breath of the Wild',
                description: 'Un juego de mundo abierto...',
                urlimagen: 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a77969113f080',
                precio: 59.99,
                categorias: ['Aventura', 'Acción', 'RPG'],
                plataformas: ['Nintendo Switch'],
                owner: user._id
            },
            {
                title: 'Elden Ring',
                description: 'Un RPG de acción desafiante...',
                urlimagen: 'https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/phzKk2rVvA7tKk7k9e3k5a2b.png',
                precio: 69.99,
                categorias: ['RPG', 'Acción'],
                plataformas: ['PC', 'PS5', 'Xbox'],
                owner: user._id
            },
            {
                title: 'Super Mario Odyssey',
                description: 'Aventura de plataformas en 3D...',
                urlimagen: 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000000127/b320306323398935395632732997233816503943343353322238493223399991',
                precio: 49.99,
                categorias: ['Plataformas', 'Aventura'],
                plataformas: ['Nintendo Switch'],
                owner: user2._id
            },
            {
                title: 'God of War Ragnarök',
                description: 'Kratos y Atreus deben viajar a cada uno de los nueve reinos...',
                urlimagen: 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png',
                precio: 69.99,
                categorias: ['Acción', 'Aventura'],
                plataformas: ['PS5', 'PS4'],
                owner: user._id
            }
        ];

        await Game.insertMany(games);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
