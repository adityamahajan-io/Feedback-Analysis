const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")

const csv = require('csv-parser')
const fs = require('fs')
const { count } = require("console")


router.get("/", (req,res)=>{
    const questionsFile = path.join(__dirname, "../options/questions.csv")
    const questionsWeights = []
    var questions = []
    var weights = []
    const detailsFile = path.join(__dirname, "../options/details.csv")
    const details = []

    fs.createReadStream(detailsFile)
    .pipe(csv())
    .on("data", (data)=>details.push(data))
    .on('end', ()=>{
        console.log("Details loaded")
        readQuestions()   
    })


    function readQuestions(){
        fs.createReadStream(questionsFile)
        .pipe(csv())
        .on('data',(data)=> questionsWeights.push(data))
        .on("end", ()=>{

            for(var i=0; i<questionsWeights.length; i++){
                questions.push(questionsWeights[i]["Question"])
                weights.push(questionsWeights[i]["Weight"])
            }
            analyseReport()
        })
    }

    function analyseReport(){
        const feedback = []
        const file = path.join(__dirname, "../uploads/data.csv")
        console.log(file)
        fs.createReadStream(file)
        .pipe(csv())
        .on('data', (data) => feedback.push(data))
        .on('end', () => {
            
            function counts(colHeader){
                var column = []
                for(var i = 0; i < feedback.length; i++){
                    column.push(feedback[i][colHeader])
                }
    
                var count1=0, count2=0, count3=0, count4=0, count5 = 0
                for(var i = 0;i<column.length;i++){
                    if(column[i]=="Never:"){
                        count1++
                    }else if(column[i]=="Hardly:"){
                        count2++
                    }else if(column[i]=="At times:"){
                        count3++
                    }else if(column[i]=="Mostly:"){
                        count4++
                    }else if(column[i]=="Always:"){
                        count5++
                    }
                }
                return [count1, count2, count3, count4, count5]
            }
    
            function colAvg(col){
                var denominator = (col[0]+col[1]+col[2]+col[3]+col[4])
                var numerator = (col[0]*1) + (col[1]*2) + (col[2]*3) + (col[3]*4) + (col[4]*5) 
                return (numerator/denominator)
            }
    
            var countsList = []
            for(var i =0; i< questions.length;i++){
                countsList.push(counts(questions[i]))
            }
    
            var avgList = []
            for(var i =0; i< questions.length;i++){
                avgList.push(colAvg(counts(questions[i])))
            }
    
            var wiAi = 0
            for(var i = 0; i < questions.length; i++){
                wiAi = wiAi + (weights[i]*colAvg(counts(questions[i])))
            }
    
            var weightSum = 0
            for(var i=0;i<weights.length;i++){
                weightSum = weightSum+parseInt(weights[i])
            }
    
            var totalSum = 2*(wiAi/weightSum)
            // console.log(totalSum)
            // console.log(details[0])
            res.render("analysis", {totalSum: totalSum, details: details[0], questions: questions, counts:countsList, avg: avgList, weights: weights})
        })
    }
    
})
module.exports = router