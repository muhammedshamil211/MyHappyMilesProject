import * as placeService from '../services/placeService.js';

export const getPlace = async (req, res) => {
    const { category, page = 1, limit = 10 } = req.query;
    const { status, payload } = await placeService.getPlaces(category, page, limit);
    res.status(status).json(payload);
};

export const addPlace = async (req, res) => {
    const { name, category, image, coverImage } = req.body;
    const { status, payload } = await placeService.addPlace(name, category, image, coverImage);
    res.status(status).json(payload);
};

export const editPlace = async (req, res) => {
    const { status, payload } = await placeService.editPlace(req.params.id, req.body);
    res.status(status).json(payload);
};

export const deletPlace = async (req, res) => {
    const { status, payload } = await placeService.deletePlace(req.params.id);
    res.status(status).json(payload);
};
