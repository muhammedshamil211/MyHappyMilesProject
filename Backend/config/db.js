import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('❌ MONGO_URI is not defined in environment variables');
            return;
        }
        
        console.log('⏳ Connecting to MongoDB...');
        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
        console.log(`📂 Database Name: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        // Do not exit process, so server can still respond (e.g. for health checks)
    }
};

export default connectDB;