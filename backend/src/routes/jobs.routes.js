const express = require('express');
const { createJob, getJobs, getJobByLinkId } = require('../controllers/jobs.controller');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, createJob);
router.get('/', authenticateToken, getJobs);
router.get('/:linkId', getJobByLinkId); // public — no auth

module.exports = router;