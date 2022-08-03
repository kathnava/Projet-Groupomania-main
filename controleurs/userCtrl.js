const bcrypt    = require('bcrypt');
const jwtUtils  = require('../jwtUtils');
const models = require('../models');
const asyncLib  = require('async');

// constants
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PASSWORD_REGEX = /^.{4,8}$/;
//mot de passe de 4 à 8 caracteres 

//Routes
module.exports = {
    addUser: (req, res) => {
        let nom = req.body.nom;
        let prenom = req.body.prenom;
        let email = req.body.email;
        let password = req.body.password;
        let isAdmin = req.body.isAdmin;

        if (email == "" || nom == "" || prenom == "" || password == "") {
            return res.status(400).json({'error': 'Parametres manquantes'})
        }
        if(!EMAIL_REGEX.test(email)) {
            return res.status(400).json({'error': 'Email not valid'})
        }

        if(!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({'error': 'Password not valid'})
        }

    //Verifier si le user exist sinon créer un user
        asyncLib.waterfall([
            (done) => {
                models.User.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                .then((userFound) => {
                    done(null, userFound)
                })
                .catch((err) => {
                  console.log(err)
                    return res.status(409).json({'error': 'An error occurred'})
                })
            },
            (userFound, done) => {
                if(!userFound) {
                    bcrypt.hash(password, 5, (err, bcryptedPassword) => {
                        done(null, userFound, bcryptedPassword)
                    })
                }
                else {
                    return res.status(409).json({'error': 'User Already exists'})
                }
            },
            (userFound, bcryptedPassword, done) => {
                
                let newUser = models.User.create({
                    nom: nom,
                    prenom: prenom,
                    email: email,
                    password: bcryptedPassword,
                    isAdmin: 0
                })
                .then((newUser) => {
                    done(newUser)
                })
                .catch((err) => {
                  console.log(err)
                    return res.status(400).json({'error': 'An error occurred'})
                })
            }
        ], (newUser) => {
            if(newUser){
                return res.status(201).json({'success': 'user successfuly created'})
            }
            else {
                return res.status(400).json({ 'error': 'An error occurred'})
            }
        })
    },
    getUser: (req, res) => {
      var userId = req.params.id;

      models.User.findOne({
          attributes: ['id', 'nom', 'prenom', 'email', 'isAdmin'],
          where: {id: userId}
      })
      .then((user) => {
          if(user){
              res.status(201).json(user)   
          }
          else {
              res.status(404).json({'error': 'User not found'})
          }
      })
      .catch((err) =>  {
        console.log(err)
          res.status(500).json({'error': 'Cannot fetch user'});
      })
  },
  
  getAllUsers: (req, res) => {
      models.User.findAll({
          attributes: [ 'id', 'nom', 'prenom', 'email', 'isAdmin' ]
      })
      .then((users) => {
          res.status(200).json(users)
      })
      .catch((err) => {
          res.status(400).json({ 'error': 'An error occurred' });
      });
  },

    login: (req, res) => {
    
        // Params
        var email    = req.body.email;
        var password = req.body.password;
    
        if (email == null ||  password == null) {
          return res.status(400).json({ 'error': 'missing parameters' });
        }
        asyncLib.waterfall([
            (done) => {
              models.User.findOne({
                  where: { email: email }
              })
              .then((userFound) => {
                  done(null, userFound);
              })
              .catch((err) => {
                  console.log(err)
                  return res.status(500).json({ 'error': 'unable to verify user' });
              });
            },
            (userFound, done) => {
              if (userFound) {
                console.log(userFound)
                bcrypt.compare(password, userFound.password, (errBycrypt, resBycrypt) => {
                  done(null, userFound, resBycrypt);
                });
              } 
              else {
                return res.status(404).json({ 'error': 'user not exist in DB' });
              }
            },
            (userFound, resBycrypt, done) => {
              if(resBycrypt) {
                done(userFound);
              } 
              else {
                return res.status(403).json({ 'error': 'invalid password' });
              }
            }
          ], 
          (userFound) => {
            if (userFound) {
              let token = jwtUtils.generateTokenForUser(userFound);
              res.cookie('auth',token);   
              res.status(201).json({
                'id': userFound.id,
                'token': token
              });
            } 
            else {
              return res.status(500).json({ 'error': 'cannot log on user' });
            }
          })
        },
        getUserMe: (req, res) => {
        
          let headerAuth = req.headers['authorization']
          let userId = jwtUtils.getUserId(headerAuth)
  
  
          if(userId < 0) {
            return res.status(400).json({'error':'An error occured mauvais token'})
          }
      
          models.User.findOne({
              attributes: [ 'id', 'nom', 'prenom', 'email'],
              where: { id: userId }
            })
            .then((user) => {
              if (user) {
                res.status(201).json(user);
              }
              else {
                res.status(404).json({ 'error': 'user not found' });
              }
            })
            .catch((err) => {
              res.status(500).json({ 'error': 'cannot fetch user' });
            });
        },
        PutUser: ( req, res) => {
          let headerAuth  = req.headers['authorization'];
          let userId = jwtUtils.getUserId(headerAuth);
          
          let nom = req.body.nom;
          let prenom = req.body.prenom;
          let email = req.body.email;
          let isAdmin = req.body.isAdmin;
   
       asyncLib.waterfall([
           (done) => {
               models.User.findOne({
                   attributes: [ 'id','nom','prenom','email','isAdmin'],
                   where :{ id: userId}
               })
               .then((userFound)=> {
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
        deleteUser: (req, res) => {
        
          let headerAuth  = req.headers['authorization'];
          let userId      = jwtUtils.getUserId(headerAuth);
  
          asyncLib.waterfall([
              (done) => {
                  models.User.destroy({
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
}
