const ErrorResponse = require("../utils/errorResponse")

const errorHandler=(err,req,res,next)=>{

let erreur={...err}

erreur.message=err.message

console.log(err);
/*
** Modifier un bootcamp
** gerer le cas de next(err)
** Privé
*/
    if(err.name=='CastError')
    {
        const message=`Ressource not found`
        erreur=new ErrorResponse(message,400)
    }
    if(err.name=='ValidationError')
    {
        const message=Object.values(err.errors).map(val=>val.message)
        erreur=new ErrorResponse(message,400)
    }
    if(err.code==11000)
    {
        const message=`Duplicate field`
        erreur=new ErrorResponse(message,400)
    }

    res.status(erreur.statusCode || 500).json({
        success:false,
        error:erreur.message || "Server unavailable"
    });


}
module.exports=errorHandler