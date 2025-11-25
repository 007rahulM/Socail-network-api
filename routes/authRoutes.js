
const express=require("express");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel");
const router=express.Router();

//register route
 router.post("/register",async(req,res)=>{
    console.log("DEBUG BODY:", req.body)
    try{
  const {username, email, password}=req.body;
   //check the feilds are enter ?
   if(!username ||!email|| !password){
    return res.status(400).json({message:"Please fill all fields"});
   }

   //find if the user already exists
   const userExists=await User.findOne({
    $or: [{ email: email }, { username: username }]
   });
  if(userExists) {
    return res.status(400).json({message:"User name or email already exists"})

  }

  //if the user is new then we hash the password
  //hash the password
  const salt=await bcrypt.genSalt(10);   //here by genSalt we generate the salt for hashing the password //salt means random string added to the password to make it more secure
  const hashedPassword=await bcrypt.hash(password,salt);  //its measn using the salt and the password given and with the bcrypt.hsh we hash it and store it in the hashedpassword

  //creat the user
  const user=await User.create({
    username,
    email,
    password:hashedPassword,
  });

  res.status(201).json({
    message:"User registered successfully"
  });

    }catch(err){
   res.status(500).json({error:"Server error"});
   console.error(err);
    }
 });


 //Login route

 router.post("/login",async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email});

        //if the user found then check the password with bcrpty.compare the password and user.password
        if(user && (await bcrypt.compare(password,user.password))){
            res.json({
                _id:user.id,//we we make id like _id because in mongo db the id is stored like that only so to avoid confusion we use like that only
              username:user.username,
              email:user.email,
              token:generateToken(user._id), //generate tokenis a helper function 
                 
            });

        }else{
            res.status(401).json({error:"Invalid credentials"});
        }
    }catch(err){
        res.status(500).json({error:"Serve error"});
        console.error(err);
    }
 });

 //helper function to genearte jwt token

 const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"5d"});
 };

 module.exports=router;
