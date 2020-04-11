const express = require("express");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const user = require("../model");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require('connect-flash');
const Device = require("../device_model");

/////////////////////
router = express.Router();

////////////////////
router.use(cookieParser('secret'));
router.use(session({
  secret : 'secret',
  //Maxage value is set for two weeks user will be loggd in for two weeks
  maxAge : 3600000,
  resave : true,
  saveUninitialized : true,
}));

////////////////////
router.use(
  bodyparser.urlencoded({
    extended: true
  })
);

///////////////////
router.use(passport.initialize());
router.use(passport.session());

router.use(flash());

router.use(function (req, res, next) {
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  next();
});


const checkAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
      res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
      return next();
  } else {
      res.redirect('/login');
  }
}

// Authentication
const localStrategy = require("passport-local").Strategy;
passport.use(new localStrategy({usernameField : 'email'}, (email, password, done)=>{
  user.findOne({email : email} , (err,data) => {
    if(err) throw err;
    if(!data){
      return done(null,false, {message : "Email or Password doesn't match"});
    }
    bcrypt.compare(password, data.password, (err, match)=>{
      if(err){
        return done(null,false); 
      }
      if(!match){
        return done(null,false, {message : "Email or Password doesn't match"}); 
      }
      if(match){
        return done(null,data); 
      }
    });
  });
}));

passport.serializeUser(function(user, cb){
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb){
  user.findById(id, function(err, user){
    cb(err,user)
  })
});
// End Authentication

//////////////////// Routes////////////////////

//Home Route
const homeGet = (req, res, next) => {
  res.render("index");
};

const SignupGet = (req, res) => {
  res.render("signup");
};

const SignupPost = (req, res) => {
  var { full_name, mobile_number, email, password } = req.body;
  var err;
  if (!full_name || !mobile_number || !email || !password) {
    err = "Please Fill All The Fields...";
    res.render('signup', { 'err' : err, full_name: full_name , mobile_number: mobile_number, email: email  });
  }
  if (typeof err == "undefined") {
    user.findOne({ email: email }, function(err, data) {
      if (err) throw err;
      if (data) {
        err = "Email Already Exists ....";
        res.render('signup', { 'err': err, full_name: full_name , mobile_number: mobile_number, email: email });
      } 
      else {
        bcrypt.genSalt(10, (err, salt) => 
        {
          if (err) throw err;
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;
            user({
              full_name,
              mobile_number,
              email,
              password
            }).save((err, data) => {
              if (err) throw err;
              else {req.flash('success_message',"Registered Successfully.. Please Login To Continue..");
              console.log("Data added");
              res.render("login");}
            });
          });
        });
      }
    });
  }
};

const LoginGet = (req, res, next) => {
  res.render("login");
};


const LoginPost = (req, res, next) => {
  passport.authenticate('local',{
  failureRedirect : 'login',
  
  successRedirect : '/user',

  failureFlash : true,
  })(req, res, next);
};
 

const LogoutGet =(req, res) => {
  req.logout();
  res.redirect('/login');
};
const UserGet =(req, res) => {
  res.render("user", {'user': req.user});
};

const SensorsGet =(req, res) => {
  res.render("sensors");
};
const Bedroom1Get =(req, res) => {
  res.render("bedroom1");
};
const Bedroom2Get =(req, res) => {
  res.render("bedroom2");
};
const KitchenGet =(req, res) => {
  res.render("kitchen");
};
const SensorsPost = (req, res) => {
  //console.log(req.body.name)  showing undefined
  var device = new Device({
    //name: [smoke_sensor, gas_sensor, motion_sensor],
    status:[req.body.smoke_sensor ? true : false, req.body.gas_sensor ? true : false, req.body.motion_sensor ? true : false] ,
});
device.save()
{
  console.log("data added")
}


  //console.log("Smoke Sensor ....", req.body.smoke_sensor ? true : false);
  //console.log("Gas Sensor ....", req.body.gas_sensor ? true : false);
  //console.log("Motion Sensor ....", req.body.motion_sensor ? true : false);
  // res.finished();
  // res.status(200).end()
  // res.end();
  // res.redirect("/");
  // if (req.body.lightSwitch) {
  //   console.log("post data is: ", true);
  // } else {
  //   console.log("post data is: ", false);
  // }

  




};

const Bedroom1Post = (req, res) => {
  if (req.body.r1fanswitch ? true : false) {
    console.log("BedRoom 1 Fan is ON");

  } else {
    console.log("BedRoom 1 Fan is OFF");
  }
  if (req.body.r1mlightswitch ? true : false) {
    console.log("BedRoom 1 Main Light is ON");
  } else {
    console.log("BedRoom 1 Main Light is OFF");
  }
  if (req.body.r1zlightswitch ? true : false) {
    console.log("BedRoom 1 Zero Light is ON");
  } else {
    console.log("BedRoom 1 Zero Light is OFF");
  }
  //console.log("BedRoom 1 Celing Fan ...." , req.body.r1fanswitch ? true : false);
  //console.log("BedRoom 1 Main Light ....", req.body.r1mlightswitch ? true : false );
  //console.log("BedRoom 1 Zero Light ....", req.body.r1zlightswitch ? true : false );
};

const Bedroom2Post = (req, res) => {
  console.log("BedRoom 2 Celing Fan ....", req.body.r2fanswitch ? true : false);
  console.log(
    "BedRoom 2 Main Light ....",
    req.body.r2mlightswitch ? true : false
  );
  console.log(
    "BedRoom 2 Zero Light ....",
    req.body.r2zlightswitch ? true : false
  );
};

const KitchenPost = (req, res) => {
  console.log("Kitchen Light ....", req.body.klightswitch ? true : false);
  console.log(
    "Kitchen Exhaust fan ....",
    req.body.kexhaustswitch ? true : false
  );
};

router.get("/", homeGet);
router.get("/login", LoginGet);
router.get("/signup", SignupGet);
router.post("/signup", SignupPost);
router.post("/login", LoginPost);
router.get("/user", checkAuthenticated, UserGet);
router.get("/sensors", SensorsGet);
router.get("/bedroom1", checkAuthenticated, Bedroom1Get);
router.get("/bedroom2", checkAuthenticated, Bedroom2Get);
router.get("/kitchen", checkAuthenticated, KitchenGet);
router.get("/logout", LogoutGet);
router.post("/sensors", SensorsPost);
router.post("/bedroom1", Bedroom1Post);
router.post("/bedroom2", Bedroom2Post);
router.post("/kitchen", KitchenPost);

module.exports = router;
