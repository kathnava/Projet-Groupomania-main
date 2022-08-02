const express = require('express');
const userCtrl = require('./routes/userCtrl');
const CommentCtrl = require('./routes/CommentCtrl');

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
apiRouter.route('/Commentaire/new/').post(CommentCtrl.CreateComment);
apiRouter.route('/Commentaire/').get(CommentCtrl.ListeComment);

return apiRouter;
})();
