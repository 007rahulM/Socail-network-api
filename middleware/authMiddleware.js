

const jwt=require("jsonwebtoken"); //to verify the token
const User=require("../models/userModel"); //import the  user model to get the user details from the db

const protect=async(req,res,next)=>{
    //for about y we used next here is because this is a middleware so after the work is done it will go to the next middleware or next controller like that so next is imp here
let token;
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){

    try{
        token=req.headers.authorization.split(" ")[1];//get the token from the header its in the form of Bearer token so we split it by space and get the token part only its arrya [1]like that that 1 means
        const decode=jwt.verify(token,process.env.JWT_SECRET); //verify the token with the secret key 
        req.user=await User.findById(decode.id).select("-password"); //get the user from the db without the password part and store it in the req.user so that we can access it in the controller part like that and here we use  await and wait for the user .finbyid to find by the decoded id from the token
        next(); //go to the next middleware or controller part

    }catch(err){
        res.status(401).json({error:"Not authorized"});

    }
}
 if(!token){
    res.status(401).json({
        error:"No token provided"
    });
 }
};

module.exports={protect};

