const Sauce = require('../models/Sauce');
//require permet de charger le modèle Sauce
const fs = require('fs');
//Ce module permet de manipuler les fichiers et dossiers sur le serveur
//fs  signifie « file system »

//création
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes:0,
        dislikes:0,
        usersLiked:[],
        usersDisliked:[]
    });
    sauce.save()
    .then(() => {res.status(201).json({message: 'Sauce enregistrée !'})})
    .catch(error => {res.status(400).json({error})})
 };
 console.log(Sauce);

//modification
 exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message : 'Not authorized'});
            } else {
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
                .catch(error => res.status(401).json({error}));
            }
        })
        .catch((error) => {
            res.status(400).json({error});
        });
 };

//suppression
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => {res.status(200).json({message: 'Sauce supprimée !'})})
                        .catch(error => res.status(401).json({error}));
                });
            }
        })
        .catch(error => {
            res.status(500).json({error});
        });
 };


//lire une sauce
exports.getOneSauce = (req, res, next) => {
        Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
    };

//lire toutes les sauces
exports.getAllSauce = (req, res, next) => {
        Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json(error));
    };



/*=== 1 Like
=== 0 Enlève le Like ou Dislike
=== -1 disLike
Dans nos tableaux utilisateur :
$inc Incrémente userLikes ou userDisLike
$push Ajoute userLikes ou userDisLike
$pull Retire userLikes ou userDisLike*/

exports.likeSauce = (req, res, next) => {  
    const liker = req.body.userId;
    const likeStatus = req.body.like;
    switch(likeStatus){
        case 1:
        //cas 1 Like 
        Sauce.updateOne(
            {_id:req.params.id},
            {$push:{usersLiked:req.body.userId},
            $inc:{likes:+1}}
            )
        .then(() => res.status(201).json({message:'Like ajouté'}))
        .catch((error) => res.status(400).json({message:error}));
        break;
        case 0:
        //cas 0 suppression du Like et du disLike 
        Sauce.findOne({_id:req.params.id})
        .then((sauce) => {
            if(sauce.usersLiked.includes(liker)){
                Sauce.updateOne(
                    {_id:req.params.id},
                    {$pull:{usersLiked:liker}, $inc:{likes:-1}}
                    )
                    .then(() => res.status(201).json({message: 'Like supprimé'}))
                    .catch((error) => res.status(400).json({message:error}))
            }
            if(sauce.usersDisliked.includes(liker)){
                Sauce.updateOne(
                    {_id:req.params.id},
                    {$pull:{usersDisliked:liker}, $inc:{dislikes:-1}}
                    )
                    .then(() => res.status(201).json({message: 'Dislike supprimé'}))
                    .catch((error) => res.status(400).json({message:error}))
            }
        })
        .catch((error) => res.status(404).json({message:error}));
        break;
        case -1:
        //cas -1 disLike
            Sauce.updateOne(
                {_id:req.params.id},
                {$push:{usersDisliked:req.body.userId},
                $inc:{dislikes:+1}}
                )
            .then(() => res.status(201).json({message:'Dislike ajouté'}))
            .catch((error) => res.status(400).json({message:error}));
        break;  
    }};