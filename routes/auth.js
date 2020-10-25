const express = require('express');

const {register,login,getMe,forgotPassword,resetPassword,updateDatas,updatePassword} = require('../controllers/auth');

const router = express.Router();

const {protect}=require('../middlewares/auth');

router.post('/register', register);
router.post('/login',login);
router.get('/me',protect,getMe);
router.put('/update-data',protect,updateDatas);
router.put('/update-password', protect, updatePassword);
router.post('/forget-password',forgotPassword);
router.put('/reset-password/:resettoken',resetPassword);

module.exports = router;
