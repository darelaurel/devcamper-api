const Bootcamp=require('../models/Bootcamp');
const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler=require('./../middlewares/asyncHandler');
const geocoder = require('../utils/geocoder');
/*
** Liste des bootcamps
** GET /api/v1/bootcamps
** Public
*/
exports.getBootcamps=asyncHandler(async(req, res,next)=>{
    let query;
    let queryStr=JSON.stringify(req.query);
    const reqQuery={...req.query};
    console.log(queryStr)
    /***
     * in operator like find in array JS
     * inventory.find( { qty: { $ne: 20 } } )
     */
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in|eq)\b/g, match=>`$${match}`);

    query=Bootcamp.find(JSON.parse(queryStr));
    const bootcamps =await query;
    res.status(200).json(
    {
        success:true, 
        count:bootcamps.length,
        data:bootcamps
    })
})

/*
** Obtenir un bootcamp
** GET /api/v1/bootcamps/:id
** Public
*/
exports.getBootcamp=asyncHandler(async(req, res,next)=>
{
    const bootcamp =await Bootcamp.findById(req.params.id)
    if(!bootcamp)
    {
        next(new ErrorResponse(`Bootcamp ${req.params.id} not putted`, 404))
    }
    res.status(200).json(
    {
        success:true, 
        data:bootcamp
    })
})

/*
** Ajouter un bootcamp
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
** Modifier un bootcamp
** PUT /api/v1/bootcamps/:id
** Privé
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
        next(new ErrorResponse(`Can't update ${req.params.id}`, 404))
    }
     res.status(200).json({success:true,data:bootcamp})
})

/*
** @desc Supprimer un bootcamp
** @route DELETE /api/v1/bootcamps/:id
** @access Private
*/
exports.deleteBootcamp= asyncHandler(async(req, res,next)=>
{
    const bootcamp=await Bootcamp.findByIdAndDelete(req.params.id)
    if(!bootcamp)
    {
        next(new ErrorResponse(`Bootcamp not found ${req.params.id}`, 400))
    }
    res.status(204).json({success:true,data:{"message":"Deleted with success"}})
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