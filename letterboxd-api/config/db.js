import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { dbName: 'letterboxd_db' })
        
    } catch (error) {
        console.error(`Error ${error.message}`)
        process.exit(1)
    }
}

export default connectDB