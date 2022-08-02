// Imports
var models   = require('../models');
var jwtUtils = require('../jwtUtils');
var asyncLib = require('async');

// Constants
const DISLIKED = 0;
const LIKED    = 1;

// Routes
module.exports = {
  likePost: function(req, res) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    var idPublication = parseInt(req.params.idPublication);

    if (idPublication <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
      function(done) {
        models.Publication.findOne({
          where: { id: idPublication }
        })
        .then(function(PublicationFound) {
          done(null, PublicationFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify message' });
        });
      },
      function(PublicationFound, done) {
        if(PublicationFound) {
          models.User.findOne({
            where: { id: userId }
          })
          .then(function(userFound) {
            done(null, PublicationFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        } else {
          res.status(404).json({ 'error': 'post already liked' });
        }
      },
      function(PublicationFound, userFound, done) {
        if(userFound) {
          models.likes.findOne({
            where: {
              userId: userId,
              idPublication: idPublication
            }
          })
          .then(function(userAlreadyLikedFound) {
            done(null, PublicationFound, userFound, userAlreadyLikedFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify is user already liked' });
          });
        } else {
          res.status(404).json({ 'error': 'user not exist' });
        }
      },
      function(PublicationFound, userFound, userAlreadyLikedFound, done) {
        if(!userAlreadyLikedFound) {
          PublicationFound.addUser(userFound, { isLike: LIKED })
          .then(function (alreadyLikeFound) {
            done(null, PublicationFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to set user reaction' });
          });
        } else {
          if (userAlreadyLikedFound.isLike === DISLIKED) {
            userAlreadyLikedFound.update({
              isLike: LIKED,
            }).then(function() {
              done(null, PublicationFound, userFound);
            }).catch(function(err) {
              res.status(500).json({ 'error': 'cannot update user reaction' });
            });
          } else {
            res.status(409).json({ 'error': 'message already liked' });
          }
        }
      },
      function(PublicationFound, userFound, done) {
        messageFound.update({
          likes: PublicationFound.likes + 1,
        }).then(function() {
          done(PublicationFound);
        }).catch(function(err) {
          res.status(500).json({ 'error': 'cannot update message like counter' });
        });
      },
    ], function(PublicationFound) {
      if (PublicationFound) {
        return res.status(201).json(PublicationFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update message' });
      }
    });
  },
  dislikePost: function(req, res) {
   // Getting auth header
   var headerAuth  = req.headers['authorization'];
   var userId      = jwtUtils.getUserId(headerAuth);

   // Params
   var idPublication = parseInt(req.params.idPublication);

   if (idPublication <= 0) {
     return res.status(400).json({ 'error': 'invalid parameters' });
   }

   asyncLib.waterfall([
    function(done) {
       models.Publication.findOne({
         where: { id: idPublication }
       })
       .then(function(PublicationFound) {
         done(null, PublicationFound);
       })
       .catch(function(err) {
         return res.status(500).json({ 'error': 'unable to verify message' });
       });
     },
     function(PublicationFound, done) {
       if(PublicationFound) {
         models.User.findOne({
           where: { id: userId }
         })
         .then(function(userFound) {
           done(null, PublicationFound, userFound);
         })
         .catch(function(err) {
           return res.status(500).json({ 'error': 'unable to verify user' });
         });
       } else {
         res.status(404).json({ 'error': 'post already liked' });
       }
     },
     function(PublicationFound, userFound, done) {
       if(userFound) {
         models.likes.findOne({
           where: {
             userId: userId,
             idPublication: idPublication
           }
         })
         .then(function(userAlreadyLikedFound) {
            done(null, PublicationFound, userFound, userAlreadyLikedFound);
         })
         .catch(function(err) {
           return res.status(500).json({ 'error': 'unable to verify is user already liked' });
         });
       } else {
         res.status(404).json({ 'error': 'user not exist' });
       }
     },
     function(PublicationFound, userFound, userAlreadyLikedFound, done) {
      if(!userAlreadyLikedFound) {
        PublicationFound.addUser(userFound, { isLike: DISLIKED })
        .then(function (alreadyLikeFound) {
          done(null, PublicationFound, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to set user reaction' });
        });
      } else {
        if (userAlreadyLikedFound.isLike === LIKED) {
          userAlreadyLikedFound.update({
            isLike: DISLIKED,
          }).then(function() {
            done(null, PublicationFound, userFound);
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot update user reaction' });
          });
        } else {
          res.status(409).json({ 'error': 'message already disliked' });
        }
      }
     },
     function(PublicationFound, userFound, done) {
        PublicationFound.update({
         likes: PublicationFound.likes - 1,
       }).then(function() {
         done(PublicationFound);
       }).catch(function(err) {
         res.status(500).json({ 'error': 'cannot update message like counter' });
       });
     },
   ], function(PublicationFound) {
     if (PublicationFound) {
       return res.status(201).json(PublicationFound);
     } else {
       return res.status(500).json({ 'error': 'cannot update message' });
     }
   });
  }
}