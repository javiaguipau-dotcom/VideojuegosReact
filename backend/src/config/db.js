const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('Local MongoDB failed, starting in-memory database...');
        try {
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log(`MongoDB Memory Server Connected: ${uri}`);
        } catch (memError) {
            console.error(`Error: ${memError.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
