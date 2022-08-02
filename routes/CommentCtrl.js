// Imports
var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../jwtUtils');


// Constants
//const TITLE_LIMIT   = 2;
const CONTENT_LIMIT = 4;
const ITEMS_LIMIT   = 50;

// Routes
module.exports = {
  CreateComment: function(req, res) {
  // Getting auth header
  var headerAuth  = req.headers['authorization'];
  var userId      = jwtUtils.getUserId(headerAuth);

  // Params
  //var idComment   = req.body.idCommentaire;
  var texte = req.body.texte;
 
  /*if (texte !== null) {
    return res.status(400).json({ 'error': 'missing parameters' });
  }

  //if (texte.length <= CONTENT_LIMIT) {
    return res.status(400).json({ 'error': 'invalid parameters' });
  }*/

  asyncLib.waterfall([
    function(done) {
      models.User.findOne({
        where: { id: userId }
      })
      .then(function(userFound) {
        done(null, userFound);
      })
      .catch(function(err) {
  
        return res.status(500).json({ 'error': 'unable to verify user' });
      });
     
    },
    function(userFound, done) {
      if(userFound) {
        models.Commentaire.create({
          texte: texte,
          userId : userFound.id
        })
        .then(function(newCommentaire) {
          done(newCommentaire);
        });
      } else {
        console.log('error')
        res.status(404).json({ 'error': 'user not found' });
      }
    },
  ], function(newCommentaire) {
    if (newCommentaire) {
      return res.status(201).json(newCommentaire);
    } else {
      return res.status(500).json({ 'error': 'cannot post message' });
    }
  });
},/*
  ListeComment: function (req, res) {
    var fields  = req.query.fields;
    var limit   = parseInt(req.query.limit);
    var offset  = parseInt(req.query.offset);
    var order   = req.query.order;

    models.Commentaire.findAll({
      order: [(order != null) ? order.split(':') : ['title', 'ASC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      limit: (!isNaN(limit)) ? limit : null,
      offset: (!isNaN(offset)) ? offset : null,
      include: [{
        model: models.User,
        attributes: [ 'email' ]
      }]
    }).then(function(Commentaire) {
      if (Commentaire) {
        res.status(200).json(Commentaire);
      } else {
        res.status(404).json({ "error": "no messages found" });
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
  },
  deleteComment: (req, res) => {
        
    let headerAuth  = req.headers['authorization'];
    let userId      = jwtUtils.getUserId(headerAuth);

    asyncLib.waterfall([
        (done) => {
            models.Commentaire.destroy({
                where: { id: userId }
            })
            .then((userFound) => {
                done(userFound)
            })
            .catch((err) => {
                return res.status(400).json({ 'error': 'An error occurred' });
            });
        }],
        (userFound) => {
            if (userFound) {
                console.log(userFound)
                return res.status(200).json({'success':`User successfuly deleted`})
            }
            else {

                return res.status(404).json({ 'error': 'User was not found' });
            }
        });
},
PutComment: ( req, res) => {
  let headerAuth  = req.headers['authorization'];
  let userId = jwtUtils.getUserId(headerAuth);
  
  let Content = req.body.texte;
  let idPublication = req.body.idPublication;
  //let  = req.body.;
  //let  = req.body.;

asyncLib.waterfall([
   (done) => {
       models.Commentaire.findOne({
           attributes: [ 'id','texte','userId','idPublication'],
           where :{ id: userId}
       })
       .then((commentaireFound)=> {
           done(null,userFound);
       })
       .catch((err) => {
           return res.status(400).json({ 'error': 'Unable to verify user' });
       });
   },
   (userFound, done) => {
       if(userFound) {
         userFound.update({
             nom: (nom ? nom : userFound.nom),
             prenom: (prenom ? prenom : userFound.prenom),
             isAdmin: (isAdmin ? isAdmin : userFound.isAdmin)
         })
         .then((userFound) => {
             done(userFound);
         })
         .catch((err) => {
             res.status(500).json({ 'error': 'cannot update user' });
         });
       }
       else {
         res.status(404).json({ 'error': 'An error occurred' });
       }
     },
   ], 
   (userFound) => {
     if (userFound) {
         res.status(200).json({'success': 'User successfuly modified'})
     } 
     else {
       return res.status(500).json({ 'error': 'cannot update user profile' });
     }
   });
},
*/
}

