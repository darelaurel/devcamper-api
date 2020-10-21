const express=require('express')
const { getCourses, getCourse,addCourse,updateCourse,deleteCourse}= require('../controllers/course')

/**
 * au cas la route enfant et parent ont le meme param seule le 
 * param du parent est pris en compte
 */
const router=express.Router({mergeParams:true});

router
.route('/')
.get(getCourses)
.post(addCourse)

router
.route('/:id')
.get(getCourse)
.put(updateCourse)
.delete(deleteCourse)
 
module.exports=router