const express=require('express')
const { getBootcamps, 
        getBootcamp, 
        createBootcamp, 
        updateBootcamp,
        deleteBootcamp,
        getBootcampsInRadius
     }= require('../controllers/bootcamp')
 
/***
 * Find courses of a bootcamp
 */
const courseRouter=require('./course');

const router=express.Router();

/***
 * courses is child route for bootcamp
 */
router.use('/:bootcampId/courses',courseRouter);

router
.route('/')
.get(getBootcamps)
.post(createBootcamp)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

router
.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp)


module.exports=router