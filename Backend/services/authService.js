import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as authRepository from '../repositories/authRepository.js';

export const loginUser = async (email, password) => {
    try {
        const user = await authRepository.findUserByEmail(email, true);
        if (!user) {
            return { status: 404, payload: { success: false, data: {}, message: "User not found" } };
        }

        if (user.isDeleted) {
            return { status: 200, payload: { success: false, data: {}, message: "Account deleted. Contact support" } };
        }

        if (user.status === 'blocked') {
            return { status: 403, payload: { success: false, data: {}, message: "Account is blocked. Contact administrator." } };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { status: 404, payload: { success: false, data: {}, message: "Incorrect password" } };
        }

        // Update lastLogin timestamp natively
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return {
            status: 200,
            payload: {
                success: true,
                data: {
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                },
                message: "Login successful"
            }
        };
    } catch (error) {
        return { status: 400, payload: { success: false, data: {}, message: "Login failed" } };
    }
};

export const registerUser = async (name, email, password) => {
    try {
        const existingUser = await authRepository.findUserByEmail(email);
        if (existingUser) {
            return { status: 400, payload: { success: false, data: {}, message: "User already exists" } };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await authRepository.createUser({
            name,
            email,
            password: hashedPassword
        });

        return {
            status: 201,
            payload: { success: true, data: { user }, message: 'User registration Successfull' }
        };
    } catch (error) {
        if (error.name === 'ValidationError') {
            return { status: 500, payload: { success: false, data: {}, message: "Please enter valid email" } };
        }
        return { status: 500, payload: { success: false, data: {}, message: 'User registration failed' } };
    }
};

export const updateUserProfile = async (userId, name) => {
    try {
        const user = await authRepository.findUserById(userId);
        if (!user) {
            return { status: 200, payload: { success: false, data: {}, message: "User not found" } };
        }

        const updateCount = user.updateCount;
        if (updateCount >= 3) {
            return { status: 200, payload: { success: false, data: {}, message: "Your updation limit is exceeded" } };
        }

        const updatedUser = await authRepository.updateUserProfile(userId, name, updateCount + 1);

        return {
            status: 200,
            payload: { success: true, data: { user: updatedUser }, message: "User updated successfully" }
        };
    } catch (error) {
        return { status: 404, payload: { success: false, data: {}, message: "User updation is failed" } };
    }
};

export const deleteUser = async (userId, userEmail, requestEmail) => {
    try {
        if (requestEmail !== userEmail) {
            return { status: 200, payload: { success: false, data: {}, message: "invalid email,please enter your email" } };
        }

        await authRepository.softDeleteUser(userId);

        return {
            status: 200,
            payload: { success: true, data: { delete: true }, message: "profile deleted successfully" }
        };
    } catch (error) {
        return { status: 404, payload: { success: false, data: {}, message: "Profile deletion failed" } };
    }
};
