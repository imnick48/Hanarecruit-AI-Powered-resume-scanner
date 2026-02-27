const express = require('express');
const { getResume } = require('../controllers/resume.controller');
const authenticateToken = require('../middleware/auth');

// Middleware that accepts token from Authorization header OR ?token= query param
const authenticateFlexible = (req, res, next) => {
    // If token is in query param, put it in the Authorization header format
    if (!req.headers['authorization'] && req.query.token) {
        req.headers['authorization'] = `Bearer ${req.query.token}`;
    }
    return authenticateToken(req, res, next);
};

const router = express.Router();

router.get('/:appId', authenticateFlexible, getResume);

module.exports = router;