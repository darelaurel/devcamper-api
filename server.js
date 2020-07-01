const express=require('express')
const dotenv=require('dotenv')

//Chargement des var d'environnements
dotenv.config({path:'./config/config.env'})

const app=express()

const PORT=process.env.PORT || 5500;

app.listen(PORT, console.log(`Connexion établie ${process.env.NODE_ENV} sur le port ${process.env.PORT}`))



