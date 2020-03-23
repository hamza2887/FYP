const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(
  bodyParser.urlencoded({
    extended: false
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
  { email: "hamzajamil2887@gmail.com", pass: "12345678" },
  { email: "h@g.c", pass: "abcd1234" },
  { email: "b@g.c", pass: "qwertyuiop" }
];

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
  console.log("Data in request....", req.body ? true : false);
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
app.get("/", homeGet);
app.post("/", SensorsPost);
app.get("/login", LoginGet);
app.post("/login", LoginPost);


app.listen(port, () => console.log(`Server Started on port ${port}!`));
