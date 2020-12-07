const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const bodyParser = require("body-parser")

router.use(bodyParser.json())

var storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
        cb(null, "uploads") 
    }, 
    filename: function (req, file, cb) { 
      cb(null, "data.csv") 
    } 
  }) 
        
var upload = multer({  
    storage: storage, 
    fileFilter: function (req, file, cb){ 
    
        var mimetype = file.mimetype; 
        var extname = path.extname(file.originalname).toLowerCase(); 
        
        if (mimetype && extname==".csv") { 
            return cb(null, true); 
        }
        
        cb("Error: File upload only supports the "
                + "following filetypes - CSV"); 
      }  
  
// mypic is the name of file attribute 
}).single("inputFile"); 


router.get("/", (req,res)=>{
    const csv = require('csv-parser')
    const detailsFile = "options/details.csv"
    const details = []
    fs.createReadStream(detailsFile)
    .pipe(csv())
    .on("data", (data)=>details.push(data))
    .on('end', ()=>{
        res.render("home", {details: details[0]})   
    })
    
})

router.post("/confirmDetails", (req,res)=>{
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
        path: 'options/details.csv',
        header: [
            {id: 'name', title: 'name'},
            {id: 'prog', title:'prog'},
            {id: 'dept', title:'dept'},
            {id: 'ay', title: 'ay'},
            {id: 'sem', title: 'sem'},
            {id: 'code', title: 'code'},
            {id: 'title', title: 'title'},
        ]
    });
    const records = [
        {
            name: req.body.name, 
            prog: req.body.prog, 
            dept: req.body.dept, 
            ay: req.body.ay, 
            sem: req.body.sem,
            code: req.body.code, 
            title: req.body.title
        }
    ]
    csvWriter.writeRecords(records)       // returns a promise
        .then(() => {
            console.log('...Done');
    });
        
    })

router.post("/uploadFile", (req,res,next)=>{

    upload(req,res,function(err) { 
  
        if(err) { 
            res.send(err) 
        } 
        else { 
            res.redirect("/analyse") 
        } 
    }) 
})


module.exports = router