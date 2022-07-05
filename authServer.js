require("dotenv").config()
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express')
const bcrypt = require ('bcrypt');
const { JsonWebTokenError } = require("jsonwebtoken");
const users = []
const jwt=require("jsonwebtoken")
const app=express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors())
const port = process.env.TOKEN_SERVER_PORT
//authentifiaction : 
app.post("/createUser",async (req,res)=>{
    try{
        const user =  req.body.name
        const hashedpass= await bcrypt.hash(req.body.password,10)
        users.push({user:user,password:hashedpass})
        res.status(201).send(users)
        console.log("user crée")
    }catch(error){
        //throw an error or what ?
        res.status(500).send({errorType:"error : "+error})
    }
   
})

app.post("/login",async (req,res)=>{
    const user = users.find( (c) => c.user == req.body.name)
    //check to see if the user exists in the list of registered users
    if (user == null) res.status(404).send ("User does not exist!")
    //if user does not exist, send a 400 response
    if(await bcrypt.compare(req.body.password,user.password)){
        //generation des tokens 
        const accessToken = generateAccessToken ({user: req.body.name})
        const refreshToken = generateRefreshToken ({user: req.body.name}) 
    res.json({accessToken:accessToken,refreshToken:refreshToken})
    }else {
        res.status(401).send("error: password incorrect !")
    }

})

app.listen(port,()=>{console.log(" Authorization server is running ... ")})

//accessToken :
const generateAccessToken=(user)=>{
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"})
}
//refreshToken : 
const refreshTokens=[]
const generateRefreshToken=(user)=>{
    const refreshToken = 
    jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
    refreshTokens.push(refreshToken)
    return refreshToken
}
const run = async ()=>{

}