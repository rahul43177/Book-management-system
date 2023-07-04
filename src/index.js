const express = require('express')
const app = express()
const mongoose = require('mongoose')
const route = require('../src/route/route')
const multer = require('multer')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb+srv://rahul4317:L0Jf8dKS6E1sKl1C@cluster0.dwi1fgs.mongodb.net/Rahul4317' , {useNewUrlParser : true} )
.then((console.log('MongoDB is connected')))
.catch((err)=>console.log(err))

app.use(multer().any())


app.use('/',route)

app.listen(3000 , function(){
    console.log(`The server is running on the port 3000`)
})