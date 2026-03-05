const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/admin.middleware');
const Place = require("../models/Place");
const Packages = require("../models/Package");



router.post("/packages",
    authMiddleware,
    adminMiddleware,
    
);


module.exports = router;