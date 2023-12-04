const mongoose = require('mongoose');

/*schéma de données avec les champs souhaités leur type et caractère, 
ID généré par mongoose*/
const sauceShema = mongoose.Schema({
    userId: {type:String, required:true},
    name: {type:String, required:true},
    manufacturer: {type:String, required:true},
    description: {type:String, required:true},
    mainPepper : {type:String, required:true},
    imageUrl: {type:String, required:true},
    heat : {type:Number, required:true},
    likes : {type:Number},
    dislikes : {type:Number},
    usersLiked : [{type:String}],
    usersDisliked : [{type:String}]
    });

//Permet l'utilisation de la fonction sauce à partir d'un autre module.
module.exports = mongoose.model('Sauce', sauceShema);


/*Exporte ce schéma en tant que modèle Mongoose le rendant disponible 
pour notre application Express.*/