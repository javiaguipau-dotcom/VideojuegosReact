const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/videojuegosdb';
console.log(`Testing connection to: ${uri}`);

mongoose.connect(uri)
    .then(() => {
        console.log('MongoDB Connected Successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('MongoDB Connection Failed:');
        console.error(err);
        process.exit(1);
    });
