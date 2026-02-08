const express = require('express');
const router = express.Router();
const schemas = require('../schemas');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate')

const bookmarksController = require('../controllers/bookmarks');



module.exports = router;