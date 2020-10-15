const express=require('express');
const dotenv=require('dotenv');
const bootcamps=require('./routes/bootcamp');
const morgan=require('morgan');
const colors=require('colors');
const errorHandler=require('./middlewares/error');
const logger=require('./middlewares/logger');
const connectDB=require('./config/db');

/*
** Loading of environment variables
*/
dotenv.config({path:'./config/config.env'})

//connect to DB
connectDB()

const app=express()

//app.use(logger)

//Body parser to json for request
app.use(express.json())

if(process.env.NODE_ENV=="development")
{
    //app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))   
    app.use(morgan('dev'))   
}

/***
 * mount the routes
 */
app.use('/api/v1/bootcamps', bootcamps)

app.use(errorHandler)

const PORT=process.env.PORT || 5500;

const server=app.listen(
    PORT, 
    console.log(`Connexion established ${process.env.NODE_ENV} on port ${process.env.PORT}`.yellow.bold)
    )

    //error on connection to database
process.on('unhandledRejection', (err,promise)=>{
    console.log(`Erreur ${err}`.red.bold);
    server.close(()=>process.exit(1))
})



