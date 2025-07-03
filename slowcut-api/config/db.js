import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB_NAME || 'letterboxd_db',
        });

        console.log(`✅ MongoDB connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
