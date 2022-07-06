const authenticateToken=(req,res,next)=>{
    const authHeader=req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token==null)return res.sendStatus(401)
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.send(err)
        else{
            req.user=user
            next()
        }
      

     
        //si il n'ya pas next, on pourra pas continuer vers l'autre callback dans la requeste ????
        
    })
}

require("dotenv").config()
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express')
const bcrypt = require ('bcrypt');
const { JsonWebTokenError } = require("jsonwebtoken");
const users = []
const validRefreshTokens=[]
const posts = [
    {
      username: 'amine',
      title: 'Post 1'
    },
    {
      username: 'Jim',
      title: 'Post 2'
    }
  ]
  
const jwt=require("jsonwebtoken")
const app=express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors())
const port = process.env.TOKEN_SERVER_PORT

app.delete("/logout", (req,res)=>{
    refreshTokens = refreshTokens.filter( (c) => c != req.body.token)
    //remove the old refreshToken from the refreshTokens list
    res.status(204).send("Logged out!")
    })
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

app.post("/accesstoken",(req,res)=>{
  const refreshToken= req.body.refreshToken
  if(refreshToken==null) return res.sendStatus(401)
  if(!refreshToken.includes(validRefreshTokens)) return res.sendStatus(401)
  jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
    if(err) return res.sendStatus(403)
    const accessToken = generateAccessToken({name:user.name})
    res.json({accessToken:accessToken})
  })
})
//authenticateToken==>middlewear permettant la verif du token si ça passe, le callback (arg3) va etre executé, sinon rien
app.get("/ressource",authenticateToken,(req,res)=>{
   // res.json(posts.filter(post => post.username === req.user.name))
   res.send("a")
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