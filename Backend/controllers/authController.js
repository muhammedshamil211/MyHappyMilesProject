import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/User.js';




export const userLogin = async (req, res) => {
    try {
        // get user input from body
        const { email, password } = req.body;

        // user check
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.isDeleted) {
            return res.json({
                message: "Account deleted. Contact support"
            });
        }
        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(404).json({
                success:false,
                message: "Incorrect password"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(400).json({
            success:false,
            message: "Login failed"
        });
    }
}

export const userRegister = async (req, res) => {
    try {
        // Get user iputs from body
        const { name, email, password } = req.body;


        // Check the user is already exist or not

        const existingUser = await userModel.findOne({ email });

        // If user exist return and say user already exist
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'User registration Successfull',
            user
        });

    } catch (error) {

        console.log(error)
        if (error.name === 'ValidationError') {
            error._message = "Please enter valid email";
            return res.status(500).json({
                message: error._message
            });
        }
        res.status(500).json({
            message: 'User registration failed'
        });
    }
}

export const userUpdate = async (req, res) => {
    try {
        const { name } = req.body;

        const user = await userModel.findOne({ _id: req.user.id });

        if (!user) {
            return res.json({
                message: "User not found"
            });
        }

        const updateCount = user.updateCount;


        if (user.updateCount >= 3) {
            return res.json({
                message: "Your updation limit is exceeded"
            });
        }



        const updateUser = await userModel.findByIdAndUpdate(
            req.user.id,
            { name, updateCount: updateCount + 1 },
            { new: true, runValidators: true }
        ).select("-isDeleted -password -deletedAt -__v");

        res.status(200).json({
            message: "User updated successfully",
            user: updateUser
        });

    } catch (error) {
        res.status(404).json({
            message: "User updation is failed"
        });
    }
}

export const userDelete = async (req, res) => {
    try {
        const { email } = req.body;

        if (email !== req.user.email) {
            return res.json({
                message: "invalid email,please enter your email"
            });
        }

        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );

        res.status(200).json({
            message: "profile deleted successfully",
            delete: true
        });
    } catch (error) {
        res.status(404).json({
            message: "Profile deletion failed"
        });
    }
}