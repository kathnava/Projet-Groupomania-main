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
  CreateComment: (req, res) => {
  // Getting auth header
  var headerAuth  = req.cookies.auth;
  console.log(req.cookies.auth)
  var userId      = jwtUtils.getUserId(headerAuth);
  //get token from cookies
/*  token.get("/login", (req, res) => {
    const token = jwtUtils.generateTokenForUser(userFound);
    return res
      .cookie("token", token)*/
  //decrypt token and get user id 
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
        models.Commentaire.create({
          texte: texte,
          userId : userId.id,

        })
        .then((newCommentaire) => {
          done(newCommentaire);
        });
      } 
  ], (newCommentaire) => {
    if (newCommentaire) {
      return res.status(201).json(newCommentaire);
    } else {
      return res.status(500).json({ 'error': 'cannot post comment ' });
    }
  });
  }
}
