const express = require("express");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const user = require("../Models/user");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const Device = require("../Models/devices");

/////////////////////
router = express.Router();

////////////////////
router.use(cookieParser("secret"));
router.use(
  session({
    secret: "secret",
    //Maxage value is set for two weeks user will be loggd in for two weeks
    maxAge: 3600000,
    resave: true,
    saveUninitialized: true,
  })
);

////////////////////
router.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

///////////////////
router.use(passport.initialize());
router.use(passport.session());


//////////////////
router.use(flash());
router.use(function (req, res, next) {
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  next();
});

////////////////
const checkAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0"
    );
    return next();
  } else {
    res.redirect("/login");
  }
};

// Authentication
const localStrategy = require("passport-local").Strategy;
passport.use(
  new localStrategy({ usernameField: "email" }, (email, password, done) => {
    user.findOne({ email: email }, (err, data) => {
      if (err) throw err;
      if (!data) {
        return done(null, false, {
          message: "Email or Password doesn't match",
        });
      }
      bcrypt.compare(password, data.password, (err, match) => {
        if (err) {
          return done(null, false);
        }
        if (!match) {
          return done(null, false, {
            message: "Email or Password doesn't match",
          });
        }
        if (match) {
          return done(null, data);
        }
      });
    });
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  user.findById(id, function (err, user) {
    cb(err, user);
  });
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
    res.render("signup", {
      err: err,
      full_name: full_name,
      mobile_number: mobile_number,
      email: email,
    });
  }
  if (typeof err == "undefined") {
    user.findOne({ email: email }, function (err, data) {
      if (err) throw err;
      if (data) {
        err = "Email Already Exists ....";
        res.render("signup", {
          err: err,
          full_name: full_name,
          mobile_number: mobile_number,
          email: email,
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;
            user({
              full_name,
              mobile_number,
              email,
              password,
            }).save((err, data) => {
              if (err) throw err;
              else {
                req.flash('success_message',
                "Registered Successfully.. Please Login To Continue.."
                );
                console.log("User Registered Sucessfully");
                res.render("login");
              }
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
  passport.authenticate("local", {
    failureRedirect: "login",

    successRedirect: "/user",

    failureFlash: true,
  })(req, res, next);
};

const LogoutGet = (req, res) => {
  req.logout();
  res.redirect("/login");
};
const UserGet = (req, res) => {
  res.render("user", { user: req.user });
  //console.log(req.user);
};

const SensorsGet = (req, res) => {
  Device.find({name: ["Smoke Sensor", "Gas Sensor","Motion Sensor"]},function(err,data){
    if(err){

    }
    else {console.log(data);
      res.render("sensors", { Sensor : data });
    }
  })
};
const Bedroom1Get = (req, res) => {
  Device.find({name: ["Room 1 Fan", "Room 1 Main Light", "Room 1 Zero Light"]},function(err,data){
    if(err){

    }
    else {console.log(data);
      res.render("bedroom1", {Bedroom1 : data });
    }
  })
  
  
};
const Bedroom2Get = (req, res) => {
  Device.find({name: ["Room 2 Fan", "Room 2 Main Light", "Room 2 Zero Light"]},function(err,data){
    if(err){

    }
    else {console.log(data);
      res.render("bedroom2", {Bedroom2: data });
    }
  })

};
const KitchenGet = (req, res) => {
  Device.find({name: ["Kitchen Main Light" , "Kitchen Exhaust Fan"]},function(err,data){
    if(err){

    }
    else {console.log(data);
      res.render("kitchen", {Kitchen: data });
    }
  })

};
const SensorsPost = (req, res) =>{
 var name= ["Smoke Sensor", "Gas Sensor", "Motion Sensor"];
  var  status= [
      req.body.smoke_sensor ? true : false,
      req.body.gas_sensor ? true : false,
      req.body.motion_sensor ? true : false,
    ];
  
    Device.findOneAndUpdate({ name : name } , { $set: { status : status } } , { new : true }, function(err,data){
     
      if(data){
      console.log("Sensors Data Updated");
        }
      else{Device({name,status}).save();
        console.log("Sensors Data Added");
        }
    })
  res.redirect("/sensors")
};

const Bedroom1Post = (req, res) => {
  var name= ["Room 1 Fan", "Room 1 Main Light", "Room 1 Zero Light"];
  var  status= [
      req.body.r1fanswitch ? true : false,
      req.body.r1mlightswitch ? true : false,
      req.body.r1zlightswitch ? true : false,
    ];
    Device.findOneAndUpdate({ name : name } , { $set: { status : status } } , { new : true }, function(err,data){
     
      if(data){
      console.log("Room 1 Data Updated");
        }
      else{Device({name,status}).save();
        console.log("Room 1 Data Added");
        }
    })
    res.redirect("/bedroom1")
};

const Bedroom2Post = (req, res) => {
  var name= ["Room 2 Fan", "Room 2 Main Light", "Room 2 Zero Light"];
  var  status= [
      req.body.r2fanswitch ? true : false,
      req.body.r2mlightswitch ? true : false,
      req.body.r2zlightswitch ? true : false,
    ];
  
    Device.findOneAndUpdate({ name : name } , { $set: { status : status } } , { new : true }, function(err,data){
     
      if(data){
      console.log("Room 2 Data Updated");
        }
      else{Device({name,status}).save();
        console.log("Room 2 Data Added");
        }
    })
    res.redirect("/bedroom2")
};

const KitchenPost = (req, res) => {
  var name= ["Kitchen Main Light" , "Kitchen Exhaust Fan" ];
  var  status= [
      req.body.kmlightswitch ? true : false,
      req.body.kexhaustfanswitch ? true : false,
     
    ];
  
    Device.findOneAndUpdate({ name : name } , { $set: { status : status } } , { new : true }, function(err,data){
     
      if(data){
      console.log("Kitchen Data Updated");
        }
      else{Device({name,status}).save();
        console.log("Kitchen Data Added");
        }
    })
    res.redirect("/kitchen")
};

router.get("/", homeGet);
router.get("/login", LoginGet);
router.get("/signup", SignupGet);
router.post("/signup", SignupPost);
router.post("/login", LoginPost);
router.get("/user", checkAuthenticated, UserGet);
router.get("/sensors", checkAuthenticated , SensorsGet);     
router.get("/bedroom1", checkAuthenticated , Bedroom1Get);   
router.get("/bedroom2", checkAuthenticated , Bedroom2Get);   
router.get("/kitchen", checkAuthenticated ,  KitchenGet);
router.get("/logout", LogoutGet);
router.post("/sensors", SensorsPost);
router.post("/bedroom1", Bedroom1Post);
router.post("/bedroom2", Bedroom2Post);
router.post("/kitchen", KitchenPost);

module.exports = router;
