const express = require('express');
const {protect} = require('../middleware/authMiddleware');
const {getPosts,createPost} = require('../controllers/postControllers');

const router = express.Router();

router.route('/').post(protect,createPost)
router.route('/').get(protect,getPosts)

module.exports = router;