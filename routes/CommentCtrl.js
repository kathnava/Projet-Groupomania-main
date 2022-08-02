// Imports
var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../jwtUtils');


// Constants
const TITLE_LIMIT   = 2;
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
  var content = req.body.text;

  if (/*title == null*/ content == null) {
    return res.status(400).json({ 'error': 'missing parameters' });
  }
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
          //title  : title,
          content: content,
          UserId : userFound.id
        })
        .then(function(newCommentaire) {
          done(newCommentaire);
        });
      } else {
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
},

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
  }
}

