var express = require('express');
var router = express.Router();
const controller = require('../querys/controllers');
const ucontroller = require('../querys/user');


const passport = require('passport');
const passportLogin = passport.authenticate('local', { session: false });  //session false debido a que solo necesitamos el token no la s
const passportJWT = passport.authenticate('jwt', { session: false });


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', controller.listar);



 router.get('/video', controller.mostrarVideo );

 router.get('/instalacion', controller.mostrarInstal );

 router.get('/primitivos', controller.mostrarPrimitivos );

 router.get('/funciones', controller.mostrarFunciones );


// USUARIOS

router.post('/register', ucontroller.register);

router.post('/login',passportLogin, ucontroller.login);





module.exports = router;
