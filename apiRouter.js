const express = require('express');
const userCtrl = require('./routes/userCtrl');
const CommentCtrl = require('./routes/CommentCtrl');
const likesCtrl = require('./routes/likesCtrl');

// Router
exports.router = (function() {
    var apiRouter = express.Router();
    
//Routes
apiRouter.route('/addUser/').post(userCtrl.addUser);
apiRouter.route('/me').get(userCtrl.getUserMe);
apiRouter.route('/login').post(userCtrl.login);
apiRouter.route('/put').put(userCtrl.PutUser);
apiRouter.route('/delete').delete(userCtrl.deleteUser);
apiRouter.route('/getUser/:id').get(userCtrl.getUser)
apiRouter.route('/getAll').get(userCtrl.getAllUsers)

//Commentaire Routes
apiRouter.route('/new/').post(CommentCtrl.CreateComment);
//apiRouter.route('/Commentaire/').get(CommentCtrl.ListeComment);

//Likes Routes
//apiRouter.route('/Likes/new/').post(likesCtrl.likePost);
//apiRouter.route('/Likes/').get(likesCtrl.dislikePost);
return apiRouter;

})();
