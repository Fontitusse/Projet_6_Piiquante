const jwt = require('jsonwebtoken');
//require permet de charger le plugin jsonwebtoken
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       //extraxion du token du header Authorization qui contient Bearer
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       //fonction verify pour décoder notre token
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
       /*extraction userID du token et le rajoutons à l’objet Request 
afin que nos différentes routes puissent l’exploiter*/
	next();
   } catch(error) {
       res.status(401).json({error});
   }
};