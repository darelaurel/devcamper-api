const Bootcamp=require('../models/Bootcamp');
const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler=require('./../middlewares/asyncHandler')
/*
** Liste des bootcamps
** GET /api/v1/bootcamps
** Public
*/

exports.getBootcamps=asyncHandler(async(req, res,next)=>{
    const bootcamps =await Bootcamp.find(req.body)
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
exports.updateBootcamp=async(req, res,next)=>
{
    const bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id, req.body,
    {
        new:true,
        runValidators:true
    })
    if(!bootcamp)
    {
        next(new ErrorResponse(`Impossible de modifier ${req.params.id}`, 404))
    }
     res.status(200).json({success:true,data:bootcamp})
}

/*
** Supprimer un bootcamp
** DELETE /api/v1/bootcamps/:id
** Privé
*/
exports.deleteBootcamp= asyncHandler(async(req, res,next)=>
{
    const bootcamp=await Bootcamp.findByIdAndDelete(req.params.id)
    if(!bootcamp)
    {
        next(new ErrorResponse(`Impossible de supprimer ${req.params.id}`, 400))
    }
    res.status(204).json({success:false})
})
