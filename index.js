const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(express.static("./views"));

const homeGet = (req, res) => {
  res.sendFile(__dirname + "/index.html");
};

const LoginGet = (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
};
const data = [
  
  {Name:"Hamza Jamil",Mobile:"0347-9570248", email: "hamzajamil2887@gmail.com", pass: "12345678" },
  {Name:"Hamza Jamil",Mobile:"0347-9570248", email: "h@g.c", pass: "abcd1234" },
  {Name:"Hamza Jamil",Mobile:"0347-9570248", email: "b@g.c", pass: "qwertyuiop" }
];

const SignupPost = (req, res )=> {
  res.sendFile(__dirname + "/views/login.html");
  console.log("Name ....",req.body.full_name);
  console.log("Mobile ....", req.body.mobile_number);
  console.log("Email ....", req.body.email );
  console.log("Password ....", req.body.password);
  const Data ={Name: req.body.full_name, Mobile: req.body.mobile_number, email: req.body.email, pass: req.body.password }
  data.push(Data)
  console.log(Data);

}; 



const LoginPost = (req, res) => {
  console.log("", req.body);

  for (let i = 0; i < data.length; i++) {
    if (
      req.body.email === data[i].email &&
      req.body.password === data[i].pass
    ) {
      res.sendFile(__dirname + "/views/user.html");
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

app.get("/", homeGet);
app.get("/login", LoginGet);
app.post("/signup", SignupPost);
app.post("/login", LoginPost);
app.post("/sensors", SensorsPost);
app.post("/bedroom1", Bedroom1Post);
app.post("/bedroom2", Bedroom2Post);
app.post("/kitchen", KitchenPost);


app.listen(port, () => console.log(`Server Started on port ${port}!`));
