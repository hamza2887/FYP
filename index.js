const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const router = require ('./Routes/routes')

const app = express();
const port = 3000;

// Database Connection
mongoose.connect('mongodb+srv://Hamza:fyp@cluster0-02iye.mongodb.net/FYP?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true}).then(()=> {console.log("Connection Established");}).catch((err)=>{console.log(err);});

 
app.use(express.static("./views"));


app.use(session({
  secret:'thesecret',
  saveUninitialized:false,
  resave:false
}))

app.use(router);

app.listen(port, () => console.log(`Server Started on port ${port}!`));
