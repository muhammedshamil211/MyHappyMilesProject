import * as authService from '../services/authService.js';

export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const { status, payload } = await authService.loginUser(email, password);
    res.status(status).json(payload);
}

export const userRegister = async (req, res) => {
    const { name, email, password } = req.body;
    const { status, payload } = await authService.registerUser(name, email, password);
    res.status(status).json(payload);
}

export const userUpdate = async (req, res) => {
    const { name } = req.body;
    const { status, payload } = await authService.updateUserProfile(req.user.id, name);
    res.status(status).json(payload);
}

export const userDelete = async (req, res) => {
    const { email } = req.body;
    const { status, payload } = await authService.deleteUser(req.user.id, req.user.email, email);
    res.status(status).json(payload);
}