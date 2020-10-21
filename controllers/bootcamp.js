const Bootcamp=require('../models/Bootcamp');
const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler=require('./../middlewares/asyncHandler');
const geocoder = require('../utils/geocoder');
/*
** Get bootcamps
** GET /api/v1/bootcamps
** Public
*/
exports.getBootcamps=asyncHandler(async(req, res,next)=>{
    let query,queryStr;
    const reqQuery={...req.query};

    console.log(queryStr)    
    /***
     * Advanced filters
     * select & exclude fields
     */
    const removeFields=['select','sort','page','limit'];

    removeFields.forEach(param =>delete reqQuery[param]);

    queryStr=JSON.stringify(reqQuery);

    /***
     * in operator like find in array JS
     * inventory.find( { qty: { $ne: 20 } } )
     */
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in|eq)\b/g, match=>`$${match}`);

    query=Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    if(req.query.select)
    {
        const fields=req.query.select.split(',').join(' ');
        query= query.select(fields);
    }
    if(req.query.sort)
    { 
        const sortBy= req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    }
    else
    {
        query=query.sort('-createdAt');
    }

    /***
     * Pagination
     */
    const page=parseInt(req.query.page,10) || 1;
    const limit=parseInt(req.query.limit,10) || 5;
    const startIndex= (page -1) * limit;
    const endIndex= page * limit;
    const total= await Bootcamp.countDocuments();
    
    query= query.skip(startIndex).limit(limit);

    const bootcamps =await query;

    const pagination={};

    if(endIndex < total)
    {
        pagination.next={
            page:page+1,
            limit:limit
        }
    }
    if(startIndex > 0)
    {
        pagination.prev={
            page:page-1,
            limit:limit
        }
    }

    res.status(200).json(
    {
        success:true, 
        pagination:pagination,
        count:bootcamps.length,
        data:bootcamps
    })
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
** Privé
*/
exports.createBootcamp=asyncHandler(async(req, res,next) =>
{
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
    const bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id, req.body,
    {
        new:true,
        runValidators:true
    })
    if(!bootcamp)
    {
        next(new ErrorResponse(`Don't find bootcamp n° ${req.params.id}`, 404))
    }
     res.status(200).json({success:true,data:bootcamp})
})

/*
** @desc Delete a bootcamp
** @route DELETE /api/v1/bootcamps/:id
** @access Private
*/
exports.deleteBootcamp= asyncHandler(async(req, res,next)=>
{
    const bootcamp=await Bootcamp.findById(req.params.id)
    if(!bootcamp)
    {
        next(new ErrorResponse(`Bootcamp ${req.params.id} not found `, 400))
    }
    bootcamp.remove();

    res.status(204).json({
        success: true,
        data: {}
      });
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