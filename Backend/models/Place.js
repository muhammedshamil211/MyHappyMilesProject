import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    category: {
        type: String,
        enum:["domestic","international"],
        required: true
    },
    image:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        required:true
    }
});

const PlaceModel = mongoose.model("Place",placeSchema);

export default PlaceModel;