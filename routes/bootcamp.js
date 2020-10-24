const express=require('express')
const { getBootcamps, 
        getBootcamp, 
        createBootcamp, 
        updateBootcamp,
        deleteBootcamp,
        getBootcampsInRadius,
        bootcampPhotoUpload
     }= require('../controllers/bootcamp')
     
const Bootcamp=require('../models/Bootcamp');

const advancedResult=require('./../middlewares/advancedResult');

/***
 * Find courses of a bootcamp
 */
const courseRouter=require('./course');

const router=express.Router();

const {protect,authorize}=require('../middlewares/auth');

/***
 * courses is child route for bootcamp
 */
router.use('/:bootcampId/courses',courseRouter);

router
.route('/')
.get(advancedResult(Bootcamp,'courses'),getBootcamps)
.post(protect,authorize('publisher','admin'),createBootcamp)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

router.route('/:id/photo').put(protect,authorize('publisher','admin'),bootcampPhotoUpload)

router
.route('/:id')
.get(getBootcamp)
.put(protect,authorize('publisher','admin'),updateBootcamp)
.delete(protect,authorize('publisher','admin'),deleteBootcamp)

module.exports=router