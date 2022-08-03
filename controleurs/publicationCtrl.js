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
  CreatePublication: (req, res) => {
  // Getting auth header

   //get token from cookies
  var headerAuth  = req.cookies.auth;
  console.log(req.cookies.auth)

  //decrypt token and get user id
  var userId      = jwtUtils.getUserId(headerAuth);
 
   
console.log('---------------', userId)
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
    
    (done) => {
        models.Publication.create({
          texte: texte,
          userId : userId,

        })
        .then((newPublication) => {
          done(newPublication);
        });
      } 
  ], (newPublication) => {
    if (newPublication) {
      return res.status(201).json(newPublication);
    } else {
      return res.status(500).json({ 'error': 'cannot post publication ' });
    }
  });
  }
}
