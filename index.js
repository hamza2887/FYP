const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/routes");
const path = require('path');




const app = express();
const port = 3000;




// Database Connection
mongoose.connect(
    "mongodb+srv://Hamza:fyp@cluster0-02iye.mongodb.net/fyp?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connection Established");
  })
  .catch(err => {
    console.log(err);
  });


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static("./views"));



app.use(router);

app.listen(port, () => console.log(`Server Started on port ${port}!`));
