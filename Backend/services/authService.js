import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as authRepository from '../repositories/authRepository.js';

export const loginUser = async (email, password) => {
    try {
        const user = await authRepository.findUserByEmail(email, true);
        if (!user) {
            return { status: 404, payload: { message: "User not found" } };
        }

        if (user.isDeleted) {
            // Note: Originally returned 200 in the controller
            return { status: 200, payload: { message: "Account deleted. Contact support" } };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { status: 404, payload: { success: false, message: "Incorrect password" } };
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return {
            status: 200,
            payload: {
                message: "Login successful",
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        };
    } catch (error) {
        return { status: 400, payload: { success: false, message: "Login failed" } };
    }
};

export const registerUser = async (name, email, password) => {
    try {
        const existingUser = await authRepository.findUserByEmail(email);
        if (existingUser) {
            return { status: 400, payload: { message: "User already exists" } };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await authRepository.createUser({
            name,
            email,
            password: hashedPassword
        });

        // The original logic didn't return 'user' fully explicitly, it just passed it.
        // Returning 'user' object just like before.
        return {
            status: 201,
            payload: { message: 'User registration Successfull', user }
        };
    } catch (error) {
        console.log(error);
        if (error.name === 'ValidationError') {
            return { status: 500, payload: { message: "Please enter valid email" } };
        }
        return { status: 500, payload: { message: 'User registration failed' } };
    }
};

export const updateUserProfile = async (userId, name) => {
    try {
        const user = await authRepository.findUserById(userId);
        if (!user) {
            return { status: 200, payload: { message: "User not found" } };
        }

        const updateCount = user.updateCount;
        if (updateCount >= 3) {
            return { status: 200, payload: { message: "Your updation limit is exceeded" } };
        }

        const updatedUser = await authRepository.updateUserProfile(userId, name, updateCount + 1);

        return {
            status: 200,
            payload: { message: "User updated successfully", user: updatedUser }
        };
    } catch (error) {
        return { status: 404, payload: { message: "User updation is failed" } };
    }
};

export const deleteUser = async (userId, userEmail, requestEmail) => {
    try {
        if (requestEmail !== userEmail) {
            return { status: 200, payload: { message: "invalid email,please enter your email" } };
        }

        await authRepository.softDeleteUser(userId);

        return {
            status: 200,
            payload: { message: "profile deleted successfully", delete: true }
        };
    } catch (error) {
        return { status: 404, payload: { message: "Profile deletion failed" } };
    }
};
