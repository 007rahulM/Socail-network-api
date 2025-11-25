/*
this file contins the heart of the project that is the user follower and following routes and loginc
following:who i want to see
followers:who wants to see me like that

*/

const express=require("express");
const User=require("../models/userModel");
const {protect}=require("../middleware/authMiddleware");

const router=express.Router();

/*
here we will get the user profile 
url: /api/users/:usename 
method:GET
access:public anyone can see the user profile

*/

//its like searching the user by username to see their profile like that  //geting user info by passing username in the url params
router.get("/:username",async(req,res)=>{
    try{
        //1 find user by usename
        //we excluede the password(-password) from it bcz its secret
        const user=await User.findOne({username:req.params.username}) //this is how we get the usename from the url params like that
        .select("-password") ///select the user without the password part
        .populate("followers","username profilePicture") //populate the followers with username and profile picture only not the whole user details//it show me names,not just Ids
        .populate("following","username profilePicture"); //populate the following with username andp rofile picture only not the whole user details //it show me names,not just Ids

        if(!user) {
            return res.status(404).json({error:"User not found"});

        }
        res.json(user); //send the user details as json response
        
    }catch(err){
        res.status(500).json({error:"Server error"});
    }
});

/*
follow a user and unfollow a user
url: /api/users/follow/:id
method: PUT
access: its private only logged in user can follow or unfollow

*/

router.put("/follow/:id",protect,async(req,res)=>{
    try{
        //the id of the person i want ot follow is the taget
        const targetUserId=req.params.id;

        //my id -current user id
        const currentUserId=req.user._id;
        //1 check if u r trying to follow yourself
        if(targetUserId===currentUserId.toString()){
            return res.status(400).json({error:"You cannot follow yourself"});
        }

        //if not the 
        //2 find both users
        const targetUser=await User.findById(targetUserId);
        const currentUser=await User.findById(currentUserId);

        if(!targetUser){
            return res.status(404).json({error:"User not found"});

        }
//its like if the user already follow the target user then unfollow him if not then follow him so insde the if its unfollow logic
        //if target user found out then
        //3 ceheck if i am already following them the other user?
        //we look inside the target's follwers array to see if my or our id is ther are not to check 

        if(targetUser.followers.includes(currentUserId)){

            //unfollow logic
            //$pull removes the id from the arrary its all monogdb operations
            await targetUser.updateOne({$pull:{followers:currentUserId}});//this is the target user is updater by $pull means removinf the followers of my curred user id then its like i am unfolloing the user or target user
            await currentUser.updateOne({$pull:{following:targetUserId}});//this is current user is updated by $pull means removing the following of the target user id in the list of mine following like that 
        
            res.status(200).json({message:`Unfollowed ${targetUser.username}`});

        }else{
            //follow logic
            //$push adds the ids to the array
            await targetUser.updateOne({$push:{followers:currentUserId}}); //this is the target user is updated by $push means adding the followers of my current user id then its like i am following the user or target user 
            await currentUser.updateOne({$push:{following:targetUserId }}); //this is current user is updated by $push means adding the following of the target user id in the list of mine following like that

            res.status(200).json({message:`Followed ${targetUser.username}`});
        }
    }catch(err){
        res.status(500).json({error:err.message ||"Server error"});
    }
});

module.exports=router;


