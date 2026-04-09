/**
 * One-time migration script to drop the stale unique email index
 * and recreate it as a sparse index to match the updated User schema.
 * 
 * Run once: node scripts/fixEmailIndex.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function fixEmailIndex() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('users');
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(i => i.name));

        // Drop the old unique email_1 index if it exists
        const emailIndexExists = indexes.find(i => i.name === 'email_1');
        if (emailIndexExists) {
            await collection.dropIndex('email_1');
            console.log('✅ Dropped old unique email_1 index');
        } else {
            console.log('ℹ️  email_1 index not found, nothing to drop');
        }

        // Recreate as sparse unique index
        await collection.createIndex(
            { email: 1 },
            { unique: true, sparse: true, name: 'email_sparse' }
        );
        console.log('✅ Created new sparse email index');

        await mongoose.disconnect();
        console.log('Done! You can now restart your server.');
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

fixEmailIndex();
