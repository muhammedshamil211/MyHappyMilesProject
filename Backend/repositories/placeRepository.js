import PlaceModel from "../models/Place.js";

/**
 * Get places with flexible filtering and sorting.
 */
export const getPlaces = async (filter = {}, page = 1, limit = 10, sortQuery = { createdAt: -1 }) => {
    const skip = (page - 1) * limit;
    return await PlaceModel.find(filter).sort(sortQuery).skip(skip).limit(limit);
};

/**
 * Count total documents with filter.
 */
export const countPlaces = async (filter = {}) => {
    return await PlaceModel.countDocuments(filter);
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
