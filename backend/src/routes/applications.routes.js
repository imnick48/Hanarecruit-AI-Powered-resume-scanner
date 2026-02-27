const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  submitApplication,
  getApplications,
  rankApplications,
} = require('../controllers/applications.controller');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

router.post('/apply/:linkId', upload.single('resume'), submitApplication); // public
router.get('/:jobId', authenticateToken, getApplications);
router.post('/rank/:jobId', authenticateToken, rankApplications);

module.exports = router;