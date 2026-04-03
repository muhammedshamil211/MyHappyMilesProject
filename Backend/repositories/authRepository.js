import userModel from '../models/User.js';

export const findUserByEmail = async (email, selectPassword = false) => {
    let query = userModel.findOne({ email });
    if (selectPassword) {
        query = query.select("+password");
    }
    return await query;
};

export const findUserById = async (id) => {
    return await userModel.findById(id);
};

export const createUser = async (userData) => {
    return await userModel.create(userData);
};

export const updateUserProfile = async (id, name, updateCount) => {
    return await userModel.findByIdAndUpdate(
        id,
        { name, updateCount },
        { new: true, runValidators: true }
    ).select("-isDeleted -password -deletedAt -__v");
};

export const softDeleteUser = async (id) => {
    return await userModel.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
    );
};
