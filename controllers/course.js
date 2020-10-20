const Course=require('../models/Course');
const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler=require('./../middlewares/asyncHandler');

/*
** Get courses
** GET /api/v1/courses
** GET /api/courses
** Public
*/
exports.getCourses=asyncHandler(async(req, res,next)=>{
   let query;
   if(req.params.bootcampId)
   {
       query=Course.find({bootcamp:req.params.bootcampId});
   }
   else
   {
       query=Course.find();
   }
   const courses=await query;

    res.status(200).json(
    {
        success:true,   
        count:courses.length,
        data:courses
    })
})