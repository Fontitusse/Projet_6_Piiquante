const express = require('express');
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

//Envoi le contenu du fichier .env dans l'object process.env
require('dotenv').config()

//Connection à MongoDB
mongoose.connect(process.env.DB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

//accès à notre API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    //depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    //envoyer des requêtes avec les méthodes CRUD
    next();
    //La fonction next() fonction prédéfinie Espress redonne contrôle aux routes appelantes 
  });

app.use('/images', express.static(path.join(__dirname, 'images')));
/*Cela indique à Express qu'il faut gérer la ressource images de manière statique
à chaque fois qu'elle reçoit une requête vers la route /images */

app.use(bodyParser.json());
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;