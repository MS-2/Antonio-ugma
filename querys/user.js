const JWT = require('jsonwebtoken');
const User = require('../tablas/user');
const bcrypt = require('bcryptjs');
//  PASSPORT
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;


passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: "secreto"
}, async (payload, done) => {
  try {
    // Find the user specified in token
    const user = await User.findById(payload.sub);
    // If user doesn't exists, handle it
    if (!user) {
      return done(null, false);
    }
    // Otherwise, return the user
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    // Find the user given the email
    const user = await User.findOne({ email });
    // If not, handle it
    if (!user) {
        console.log("no encontro user");
      return done(null, false);
    }
    // Check if the password is correct
    const isMatch = await user.isValidPassword(password);
  
    // If not, handle it
    if (!isMatch) {
        console.log("no hizo match");
      return done(null, false);
    }
    // Otherwise, return the user
    console.log("asd");
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}));

signToken = user => {
  return JWT.sign({
    iss: 'juan',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, "secreto");
}

module.exports = {

  register: async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password; 
    const nombre = req.body.nombre;
    const apellido = req.body.apellido; 
    const cargo = req.body.cargo;
    const cedula = req.body.cedula; 
    const celular = req.body.celular;

    
    // Check if there is a user with the same email
    const foundUser = await User.findOne({ email });
    if (foundUser) { 
      return res.status(403).json({ error: 'ese email ya esta en uso'});
    }

    // Create a new user
    const newUser = new User({ email,password,nombre,apellido,cargo,cedula,celular });
    const newU = await newUser.save();

    // Generate the token
    const token = signToken(newUser);

    // Respond with token
        res.redirect('/');
    // res.status(200).json({"success":true, "token": token, "user":newU });
    
  },


  login: async (req,res,next) =>  {	
    const id = req.user._id;
    const user = req.user;
    const token = signToken(req.user);
    // res.json({"success":true, "data":token, "id":id, "user":user});   
    res.render('principal');
  },

  secret: async (req, res, next) => {
    const users = await User.find();
    res.status(200).json(users);
  },

  getUser: async (req,res,next) => {

   
    const userId  = req.body.id;
    const user = await User.findById(userId);
    res.status(200).json(user);
},

  deleteUser: async (req,res,next) => {

    // console.log('req params', req.params.userId);
    const userId  = req.body.id;
    const users = await User.findByIdAndDelete(userId);
    res.status(200).json({"success":true, "data":users});
  },

  cambiarpass: async (req,res,next)=>{
    const userId  = req.body.id;
    const viejapass  = req.body.vieja;
    const user = await User.findById(userId);
    const nuevapass  = req.body.nueva;

    bcrypt.compare(viejapass, user.password, function(err, res) {     
      if (res == true) {
        // console.log("lapasssirve"+res);
        bcrypt.hash(nuevapass, 10).then(function(hash) {
          // console.log("nuevapass"+hash);
          var hass = hash;
          var result =  User.findByIdAndUpdate(userId, {password:hass});
          // console.log("result"+result);
        
          return result;
      });
      }
      else{
        console.log("lapss NO sirve"+res);
      }
    });

    res.status(200).json({"success":true,"user":user, "status":"clave cambiada con exito"});
    
  }
}