const express=require('express');
const dotenv=require('dotenv');
const bootcamps=require('./routes/bootcamp');
const morgan=require('morgan');
const colors=require('colors');
const errorHandler=require('./middlewares/error');
const connectDB=require('./config/db')

/*
**Chargement des var d'environnements
*/
dotenv.config({path:'./config/config.env'})

connectDB()

const app=express()

 app.use(express.json())

if(process.ENV=="development")
{
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcamps)

app.use(errorHandler)

const PORT=process.env.PORT || 5500;

const server=app.listen(
    PORT, 
    console.log(`Connexion établie ${process.env.NODE_ENV} sur le port ${process.env.PORT}`.yellow.bold)
    )

process.on('unhandledRejection', (err,promise)=>{
    console.log(`Erreur ${err}`.red.bold);
    server.close(()=>process.exit(1))
})



