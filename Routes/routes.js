const express = require("express");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const user =  require('../model'); 


/////////////////////
router = express.Router()

////////////////////
router.use(
    bodyparser.urlencoded({
      extended: true
    })
  );

////////////////////
  const homeGet = (req, res, next) => {
        res.redirect("/index.html");
  };
  
  const LoginGet = (req, res, next) => {
    res.redirect("/login.html");
  };
  const SignupGet = (req, res, next) => {
    res.redirect("/signup.html");
  };
  //const data = [
    
    //{Name:"Hamza Jamil",Mobile:"0347-9570248", email: "hamzajamil2887@gmail.com", pass: "12345678" },
    //{Name:"Hamza Jamil",Mobile:"0347-9570248", email: "h@g.c", pass: "abcd1234" },
    //{Name:"Hamza Jamil",Mobile:"0347-9570248", email: "b@g.c", pass: "qwertyuiop" }
  //];
  
  const SignupPost = (req, res )=> {
    var{full_name, mobile_number, email, password} = req.body;
    bcrypt.genSalt(10,(err, salt)=>{
      if(err) throw err;
      bcrypt.hash(password, salt, (err, hash)=>{
        if(err) throw err;
        password=hash;
        user({
          full_name, 
          mobile_number, 
          email, 
          password,
        }).save((err,data)=>{
          if(err) throw err;
          res.redirect('/login');
        });
      });
    });
    
    res.redirect("/login.html");
    //console.log("Name ....",req.body.full_name);
    //console.log("Mobile ....", req.body.mobile_number);
    //console.log("Email ....", req.body.email );
    //console.log("Password ....", req.body.password);
    //const Data ={Name: req.body.full_name, Mobile: req.body.mobile_number, email: req.body.email, pass: req.body.password }
    //data.push(Data)
    //console.log(Data);
  
  }; 
  
  
  
  const LoginPost = (req, res) => {
    console.log("", req.body);
  
    for (let i = 0; i < data.length; i++) {
      if (
        req.body.email === data[i].email &&
        req.body.password === data[i].pass
      ) {
        res.redirect("/user.html");
      }
    }
  };
  const SensorsPost = (req, res) => {
    console.log("Smoke Sensor ...." , req.body.smoke_sensor ? true : false);
    console.log("Gas Sensor ....", req.body.gas_sensor ? true : false );
    console.log("Motion Sensor ....", req.body.motion_sensor ? true : false );
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
  
  
  const Bedroom1Post = (req, res )=> {
    if (req.body.r1fanswitch ? true : false) {
      console.log("BedRoom 1 Fan is ON")
    } else {
      console.log("BedRoom 1 Fan is OFF")
      
    }
    if (req.body.r1mlightswitch ? true : false ) {
      console.log("BedRoom 1 Main Light is ON")
    } else {
      console.log("BedRoom 1 Main Light is OFF")
      
    }
    if (req.body.r1zlightswitch ? true : false) {
      console.log("BedRoom 1 Zero Light is ON")
    } else {
      console.log("BedRoom 1 Zero Light is OFF")
      
    }
    //console.log("BedRoom 1 Celing Fan ...." , req.body.r1fanswitch ? true : false);
    //console.log("BedRoom 1 Main Light ....", req.body.r1mlightswitch ? true : false );
    //console.log("BedRoom 1 Zero Light ....", req.body.r1zlightswitch ? true : false );
  
  };
  
  
  const Bedroom2Post = (req, res )=> {
    console.log("BedRoom 2 Celing Fan ...." , req.body.r2fanswitch ? true : false);
    console.log("BedRoom 2 Main Light ....", req.body.r2mlightswitch ? true : false );
    console.log("BedRoom 2 Zero Light ....", req.body.r2zlightswitch ? true : false );
  }; 
  
  
  const KitchenPost = (req, res) => {
    console.log("Kitchen Light ...." , req.body.klightswitch ? true : false);
    console.log("Kitchen Exhaust fan ....", req.body.kexhaustswitch ? true : false );
  
  };
  
  router.get("/", homeGet);
  router.get("/login", LoginGet);
  router.get("/signup", SignupGet);
  router.post("/auth/signup", SignupPost);
  router.post("/auth/login", LoginPost);
  router.post("/sensors", SensorsPost);
  router.post("/bedroom1", Bedroom1Post);
  router.post("/bedroom2", Bedroom2Post);
  router.post("/kitchen", KitchenPost);





module.exports = router;

