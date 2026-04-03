import PlaceModel from "../models/Place.js";

export const findPlacesByCategory = async (category) => {
    return await PlaceModel.find({ category: category });
};

export const findAllPlaces = async () => {
    return await PlaceModel.find({});
};

export const createPlace = async (placeData) => {
    return await PlaceModel.create(placeData);
};

export const updatePlaceById = async (id, updateData) => {
    return await PlaceModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );
};

export const deletePlaceById = async (id) => {
    return await PlaceModel.findByIdAndDelete(id);
};
