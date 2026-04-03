import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PlaceModel from './models/Place.js';

dotenv.config();

const listPlaces = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const places = await PlaceModel.find({});
        console.log("---PLACES_START---");
        console.log(JSON.stringify(places, null, 2));
        console.log("---PLACES_END---");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listPlaces();
