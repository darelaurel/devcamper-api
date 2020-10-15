
dotenv --- permettre acces au var d'env depuis process.ENV
express -- serveur web -- gestion des routes

les controllers -- logique métier sur chaque route

les routes

le logger --middleware

morgan --est le middleware pour customiser affichage en console

mongoose pour la connexion a la BD --- ajouter une ip de partout avant de copier le SRV dans Compass

Connexion de la BD dans server.js

Creation des modeles

utiliser les fonctions du model dans le controlleur pour gerer les donnes

creer un middleware pour la gestion des erreurs des controllers

creer une classe fille d'Erreur dont on passe une instance au middleware next du controlleur 

next --appelle un autre middleware

le middleware pour gerer en lieu et place des try catch asyncHandler