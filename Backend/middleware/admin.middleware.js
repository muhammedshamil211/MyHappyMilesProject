const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        res.status(403).json({
            message: "Only admin can access this"
        });
    }

    next();
};

export default adminMiddleware;
