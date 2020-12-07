var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var router = express.Router()

//------------------------------------------------
app.use(express.static(__dirname+ "/public"))
app.set('view engine', 'ejs')
app.set("views", __dirname+"/views")
app.use(bodyParser.urlencoded({ extended: true }))
//-------------------------------------------------

const fs = require('fs');
const path = require('path');




//==============================================================
//---------------------RESTful Routes---------------------------
//==============================================================


//---------------Define Routes--------------
const homeRoute = require("./routes/home")
const analyseRoute = require("./routes/analyse")

//------------------------------------------


//---------------Use Routes-----------------
app.use("/", homeRoute)
app.use("/analyse", analyseRoute)

//------------------------------------------

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("Server running on port 8000")
})

