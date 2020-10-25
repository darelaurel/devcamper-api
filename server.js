const express=require('express');
const dotenv=require('dotenv');
const fileUpload=require('express-fileupload');
const mongoSanitize=require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const morgan=require('morgan');
const colors=require('colors');
const errorHandler=require('./middlewares/error');
const logger=require('./middlewares/logger');
const connectDB=require('./config/db');
const cookieParser = require('cookie-parser')

const auth = require('./routes/auth');
const bootcamps=require('./routes/bootcamp');
const courses=require('./routes/course');
const users=require('./routes/user');
const reviews=require('./routes/review');

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

app.use(cookieParser())

if(process.env.NODE_ENV=="development")
{
    //app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))   
    app.use(morgan('dev'))   
}

/***
 * mount the routes
 */

app.use(fileUpload());

/***
 * Enable sanitize
 * remove illegal and specials not escaped characters
 */
app.use(mongoSanitize());

/***
 * Allow to add some headers on response headers such as dns prefetch
 */
app.use(helmet());

/***
 * Prevent XSS attacks
 * Mutate all javascript tags
 */
app.use(xss());

app.use('/api/v1/auth', auth)

app.use('/api/v1/bootcamps', bootcamps)

app.use('/api/v1/courses', courses)

app.use('/api/v1/users', users)

app.use('/api/v1/reviews', reviews)

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



