import PackageModel from "../models/Package.js";

export const addPackage = async (req, res) => {
    try {
        const {
            placeId,
            title,
            description,
            price,
            duration,
            image
        } = req.body;

        if (!placeId || !title || !price) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const pack = await PackageModel.create({
            placeId,
            title,
            description,
            price,
            duration,
            image
        });

        res.status(201).json({
            success: true,
            message: "Package added successfully",
            package: pack
        });
    } catch (error) {
        success: false,
            res.status(500).json({
                success: false,
                message: "Failed to add package"
            });
    }
}

export const updatePackage = async (req, res) => {
    try {
        const updatedPackage = await PackageModel.findByIdAndUpdate(
            req.params.packageId,
            req.body,
            { new: true, runValidators: true }

        )

        if (!updatePackage) {
            return res.status(404).json({
                success: false,
                message: "No package Found"
            });
        }

        res.json({
            success: true,
            message: "Package updated successfully",
            updatePackage
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

export const deletePackage = async (req, res) => {
    try {

        const deletedPackage = await PackageModel.findByIdAndDelete(req.params.packageId);

        if (!deletedPackage) {
            return res.status(404).json({
                success: false,
                message: "Package not found"
            });
        }

        res.json({
            success: true,
            message: "Package deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

export const recentPack = async (req, res) => {
    const packages = await PackageModel.find().sort({ createdAt: -1 }).limit(3);
    res.json({ success: true, packages });
}

export const popularPack = async (req, res) => {
    const packages = await PackageModel.find().sort({ views: -1 }).limit(3);
    res.json({ success: true, packages });
}

export const incView = async (req, res) => {
    try {
        const { id } = req.params;
        
        // $inc is a MongoDB operator that increments a field by a specified value
        const updatedPackage = await PackageModel.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } }, 
            { new: true } // Returns the updated document
        );

        if (!updatedPackage) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        res.status(200).json({ success: true, views: updatedPackage.views });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export const getPackageList = async (req, res) => {
    try {
        const packages = await PackageModel.find({
            placeId: req.params.placeId
        });

        res.json({
            success: true,
            packages
        });
    } catch (errror) {
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }

}

export const getPackageDetails = async (req, res) => {
    try {
        const { packageId } = req.params;

        const pack = await PackageModel.findById(packageId).populate("placeId");

        if (!pack) {
            return res.status(404).json({ message: "Package not found" });
        }

        res.json(pack);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch package details" });
    }
}