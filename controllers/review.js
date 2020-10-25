const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const Review = require('../models/Review');
const Course=require('./../models/Course');

/*
** Get reviews
** GET /api/v1/reviews
** GET /api/v1/courses/:courseId/reviews
** Public
*/
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.courseId) {
    const reviews = await Review.find({ course: req.params.courseId});

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advancedResult);
  }
});

/*
** Get single review
** GET /api/v1/reviews/:id
** Public
*/
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'course',
    select: 'title description tuition weeks minimumSkill'
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

/*
** Add review
** POST /api/v1/courses/:courseId/reviews
** Private
*/
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.course = req.params.courseId;
    req.body.user = req.user.id;

    const course= await Course.findById(req.params.courseId);

    if (!course) {
        return next(
        new ErrorResponse(
            `No course with the id of ${req.params.courseId}`,
            404
        )
        );
    }
    const review = await Review.create(req.body);
    res.status(201).json({
        success: true,
        data: review
    });
});

/*
** Update review
** PUT /api/v1/reviews/:id
** Private
*/
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);
    if (!review) 
    {
        return next(
        new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
        );
    }

    if(req.user.role !== 'publisher' || (review.user.toString() == req.user.id))
	{
        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
    
        res.status(200).json({
            success: true,
            data: review
        });
    }
    else
    {
        return next(new ErrorResponse(`Not authorized to update review`, 401));
    }

});


/*
** Delete review
** DELETE /api/v1/reviews/:id
** Private
*/
exports.deleteReview = asyncHandler(async (req, res, next) => {
    
    const review = await Review.findById(req.params.id);
    if (!review) 
    {
        return next(
        new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
        );
    }

    if(req.user.role !== 'publisher' || (review.user.toString() == req.user.id))
	{
        
        await review.remove();

        res.status(204).json({
            success: true
        });
    }
    else
    {
        return next(new ErrorResponse(`Not authorized to delete review`, 401));
    }

});
