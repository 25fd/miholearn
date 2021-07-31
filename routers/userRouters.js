const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const auth = require('../utils/authController')

router.post('/signup', userController.userSignup)
router.post('/login', userController.userLogin)
router.get('/greet', auth.protect,userController.userGreet);
router.get('/get-new-token',userController.getNewAuthToken);


  module.exports = router;