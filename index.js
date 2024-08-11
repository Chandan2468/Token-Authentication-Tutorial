const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const app = express()

app.get('/',(req,res)=>{
    res.send('Sample API')
})

const secretKey = "SECRET_KEY"

app.post('/login',(req,res)=>{
    const user = {              // sample user as no DB is available
        id:1,
        email:"abcd@test.com"
    }
    jwt.sign({user},secretKey,{expiresIn:'400s'},(err,token)=>{
        res.json({
            token
        })
    })
})

app.post('/profile',verifyToken,(req,res)=>{
    jwt.verify(req.token,secretKey,(err,authData)=>{
    if(err){
        res.send({result:'Token is not matched'})
    }else{
        res.send({
            result:"Verified Token",
            authData
        })
    }
    })
})

function verifyToken(req,res,next){     // this fn act as a middleware to verify the tokens sent from user side
const bearerHeader = req.headers['authorization']           // we are sending the token of user from here
if(typeof bearerHeader !== 'undefined'){
const bearer = bearerHeader.split(" ")
const token = bearer[1]
req.token = token                             // here the token is sent only and not verified
next()
}else{
    res.send({result:'Token is not valid'})
}
}

app.listen(4000,()=>{
    console.log("App is running on 4000 port");
    
})