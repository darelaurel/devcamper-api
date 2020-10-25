const express=require('express')
const { getCourses, getCourse,addCourse,updateCourse,deleteCourse}= require('../controllers/course')

const Course=require('../models/Course');

const advancedResult=require('./../middlewares/advancedResult');

/**
 * au cas la route enfant et parent ont le meme param seule le 
 * param du parent est pris en compte
 */
const reviewRouter=require('./review');

const router=express.Router({mergeParams:true});

const {protect,authorize}=require('../middlewares/auth');

router.use('/:courseId/reviews',reviewRouter);

router
.route('/')
.get(advancedResult(Course, {
      path: 'bootcamp',
      select: 'name description'
    }),getCourses)
.post(protect,authorize('publisher','admin'),addCourse)

router
.route('/:id')
.get(getCourse)
.put(protect,authorize('publisher','admin'),updateCourse)
.delete(protect,authorize('publisher','admin'),deleteCourse)
 
module.exports=router