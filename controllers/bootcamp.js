const Bootcamp=require('../models/Bootcamp');
const path=require('path');
const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler=require('./../middlewares/asyncHandler');
const geocoder = require('../utils/geocoder');
/*
** Get bootcamps
** GET /api/v1/bootcamps
** Public
*/
exports.getBootcamps=asyncHandler(async(req, res,next)=>{
    res.status(200).json(res.advancedResult)
})

/*
** Get abootcamp
** GET /api/v1/bootcamps/:id
** Public
*/
exports.getBootcamp=asyncHandler(async(req, res,next)=>
{
    const bootcamp =await Bootcamp.findById(req.params.id)
    if(!bootcamp)
    {
        next(new ErrorResponse(`Bootcamp ${req.params.id} doesn't exists `, 404))
    }
    res.status(200).json(
    {
        success:true, 
        data:bootcamp
    })
})

/*
** Add a bootcamp
** POST /api/v1/bootcamps
** Private
*/
exports.createBootcamp=asyncHandler(async(req, res,next) =>
{
	req.body.user=req.user.id;
	
	// Check for published bootcamp
	const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

	/***
	 * If the user is not an admin
	 * he can add more than one bootcamp
	 */

	if (publishedBootcamp && req.user.role !== 'admin') {
	  return next(
		new ErrorResponse(
		  `The user with ID ${req.user.id} has already published a bootcamp`,
		  400
		)
	  );
	}

    const bootcamp=await Bootcamp.create(req.body)
    res.status(201).json(
    {
        success:true, 
        data:bootcamp
    })
})

/*
** Update a bootcamp
** PUT /api/v1/bootcamps/:id
** Private
*/
exports.updateBootcamp=asyncHandler(async(req, res,next)=>
{
	let bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
		new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	// Make sure user is bootcamp owner
	if (bootcamp.user.toString() !== req.user.id || req.user.role == 'user') {
		return next(
		new ErrorResponse(
			`User ${req.params.id} is not authorized to update this bootcamp`,
			401
		)
		);
	}

	bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

     res.status(200).json({success:true,data:bootcamp})
})

/*
** @desc Delete a bootcamp
** @route DELETE /api/v1/bootcamps/:id
** @access Private
*/
exports.deleteBootcamp= asyncHandler(async(req, res,next)=>
{
    const bootcamp = await Bootcamp.findById(req.params.id);
	
	if (!bootcamp) 
	{
		return next(
		new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	// Make sure user is bootcamp owner
	if (bootcamp.user.toString() !== req.user.id || req.user.role == 'user') {
		return next(
		new ErrorResponse(
			`User ${req.params.id} is not authorized to delete this bootcamp`,
			401
		)
		);
	}

  	bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
})

/*
** @desc Get bootcamps with a radius
** @route GET /api/v1/bootcamps/radius/zipcode/distance
** @params zipcode and distance
** @access Private
** L'exemple suivant interroge les coordonnées de la grille et renvoie tous les documents dans un rayon 
** de 10 miles de longitude 88 et de latitude 30. La requête convertit la distance en radians en divisant
** par le rayon équatorial approximatif de la terre, 3963,2 miles:88 W30 N
** { $geoWithin: { $centerSphere: [ [ -88, 30 ], 10/3963.2 ] } }
*/
exports.getBootcampsInRadius= asyncHandler(async(req, res,next)=>
{
    const {zipcode,distance}=req.params
    const loc=await geocoder.geocode(zipcode);
    const lat=loc[0].latitude;
    const long=loc[0].longitude;
    const radius=distance/3963;
    const bootcamps= await Bootcamp.find({
        location:{
            $geoWithin:{$centerSphere:[[long,lat],radius]}
        }
    });
    res.status(200).json({
        success:true,
        count:bootcamps.length,
        data:bootcamps
    })
})

/*
** @desc Upload a bootcamp picture
** @route PUT /api/v1/bootcamps/:id/photo
** @access Private
*/

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
  
    if (!bootcamp) 
    {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
	}
	
	// Make sure user is bootcamp owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
		  new ErrorResponse(
			`User ${req.params.id} is not authorized to upload image`,
			401
		  )
		);
	  }

    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }
  
    const file = req.files.file;
  
    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }
  
    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
  
    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
  
      await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
  
      res.status(200).json({
        success: true,
        data: file.name
      });
    });
  });