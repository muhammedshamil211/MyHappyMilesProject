import PlaceModel from "../models/Place.js";

/**
 * Get all places with pagination.
 * @param {number} page  - 1-indexed page number
 * @param {number} limit - items per page
 */
export const findAllPlaces = async (page, limit) => {
    const skip = (page - 1) * limit;
    return await PlaceModel.find({}).skip(skip).limit(limit);
};

/**
 * Get places filtered by category with pagination.
 */
export const findPlacesByCategory = async (category, page, limit) => {
    const skip = (page - 1) * limit;
    return await PlaceModel.find({ category }).skip(skip).limit(limit);
};

/**
 * Count total documents, optionally filtered by category.
 */
export const countPlaces = async (category) => {
    const filter = category ? { category } : {};
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
