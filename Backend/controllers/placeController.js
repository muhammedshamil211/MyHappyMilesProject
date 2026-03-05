import PlaceModel from "../models/Place.js";

export const getPlace = async (req, res) => {
    try {
        const { category } = req.query;
        let places;

        if (category) {
            places = await PlaceModel.find({ category: category });
        } else {
            places = await PlaceModel.find({});
        }

        res.json({
            success: true,
            places
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }

}

export const addPlace = async (req, res) => {
    try {
        const { name, category, image, coverImage } = req.body;

        if (!name || !category || !image || !coverImage) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const place = await PlaceModel.create({
            name,
            category,
            image,
            coverImage
        });

        res.status(201).json({
            success:true,
            message: "Place added successfully",
            place
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
             message: "Failed to add place" });
    }
}

export const editPlace = async (req, res) => {
    try {
        const updatedPlace = await PlaceModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedPlace) {
            return res.status(404).json({
                success: false,
                message: "Place not found"
            });
        }

        res.json({
            success: true,
            place: updatedPlace
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


export const deletPlace = async (req, res) => {
    try {

        const deletedPlace = await PlaceModel.findByIdAndDelete(req.params.id);
                
        if (!deletedPlace) {
            return res.status(404).json({
                success: false,
                message: "Place not found"
            });
        }

        res.json({
            success: true,
            message: "Place deleted successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}
