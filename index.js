const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const router = require ('./Routes/routes')

const app = express();
const port = 3000;

// Database Connection
mongoose.connect('mongodb://127.0.0.1 :27017/fyp', { useNewUrlParser: true, useUnifiedTopology: true });

//Check Database Connection
mongoose.connection.once('open',function(){
  console.log("Connection Established!");
}).on('error',function(error){
console.log("Connection error:",error);
});

//middleware
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);



app.use(express.static("./views"));


app.use(session({
  secret:'thesecret',
  saveUninitialized:false,
  resave:false
}))

app.use(router);

app.listen(port, () => console.log(`Server Started on port ${port}!`));
