const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Champs : leur type et caractère
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

/*Unique , avec l'élément mongoose-unique-validator passé comme plug-in, 
s'assurera que deux utilisateurs ne puissent partager la même adresse e-mail.*/
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
//Nous exportons le userSchema le rendant disponible dans notre application Express