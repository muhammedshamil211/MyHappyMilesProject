import * as placeRepository from '../repositories/placeRepository.js';

export const getPlaces = async (category) => {
    try {
        let places;
        if (category) {
            places = await placeRepository.findPlacesByCategory(category);
        } else {
            places = await placeRepository.findAllPlaces();
        }

        return {
            status: 200,
            payload: { success: true, data: { places }, message: "Fetched successfully" }
        };
    } catch (error) {
        return { status: 500, payload: { success: false, data: {}, message: "Server error" } };
    }
};

export const addPlace = async (name, category, image, coverImage) => {
    try {
        if (!name || !category || !image || !coverImage) {
            return { status: 400, payload: { success: false, data: {}, message: "All fields are required" } };
        }

        const place = await placeRepository.createPlace({
            name,
            category,
            image,
            coverImage
        });

        return {
            status: 201,
            payload: { success: true, data: { place }, message: "Place added successfully" }
        };
    } catch (error) {
        console.log(error);
        return { status: 500, payload: { success: false, data: {}, message: "Failed to add place" } };
    }
};

export const editPlace = async (id, updateBody) => {
    try {
        const updatedPlace = await placeRepository.updatePlaceById(id, updateBody);

        if (!updatedPlace) {
            return { status: 404, payload: { success: false, data: {}, message: "Place not found" } };
        }

        return {
            status: 200,
            payload: { success: true, data: { place: updatedPlace }, message: "Place updated successfully" }
        };
    } catch (error) {
        return { status: 500, payload: { success: false, data: {}, message: "Server error" } };
    }
};

export const deletePlace = async (id) => {
    try {
        const deletedPlace = await placeRepository.deletePlaceById(id);

        if (!deletedPlace) {
            return { status: 404, payload: { success: false, data: {}, message: "Place not found" } };
        }

        return {
            status: 200,
            payload: { success: true, data: {}, message: "Place deleted successfully" }
        };
    } catch (error) {
        return { status: 500, payload: { success: false, data: {}, message: "Server error" } };
    }
};
