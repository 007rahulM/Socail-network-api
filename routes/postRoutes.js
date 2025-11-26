

/*
its basic curd oprations but with a twist
1 create a post  here we attach the logged in users ID to the post
2 delete we check is this your post? before letting you delete it like that

*/

const express=require("express");
const Post=require("../models/postModel");
const User=require("../models/userModel");
const{protect}=require("../middleware/authMiddleware");

const router=express.Router();

/*
create a post
url:  /api/posts
method: POST
access: private only logged in user can create a post
*/

router.post("/",protect,async(req,res)=>{
    try{
        const{desc,img}=req.body;
        const newPost=new Post({
            user:req.user._id, //the link post to the logges in user
            desc,
            img
        });

        const savedPost=await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json({error:"Server error"});
    }
});


/*
delete a post
url : /api/post/:id
metod: DELETE
access :private only logged in user can delete the post

*/

router.delete("/:id",protect,async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error:"Post not found"});

        }

        //check id the person deleting it the same person who wrote it? 
        //post.user is an objectId, so we must convert to string to copmare

        if(post.user.toString()!==req.user._id.toString()){ // this line checks that is the post/user.tostring meanse the post user of that post it covert the post use id to string and the req.use_id which we are passing in the params to string and matching it shout match if not its not is post so he can delete it but if its is post then he can delete it
            return res.status(403).json({error:"You can only delete your own posts"});
        }

        await post.deleteOne();
        res.status(200).json({message:"Post deleted"});
        
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

//feed logic 
/*
get timeline post (its the feed)
url: /api/posts/timeline/all
Method: GET
*/
/*the feed logic is edited because its now just soring all the post the friedna post who i am following and the 
user post so if i follow 10 people and each one post something  then i will see all the post of the 10 people and my own post too in the feed so its 
not good u cannot see too much at once so the server crashes so we will limit by adding pagination in the feed ok lets see its down
*/


// router.get("/newposts/all",protect,async(req,res)=>{
//     try{
//         //1 get current user logic
//         //we need the list of people I follow
//         const currentUser=await User.findById(req.user._id);

//         //2 get user's own posts its optional but usally you see your own tweets too in some social apps so let add it here
//         const userPosts=await Post.find({user:currentUser._id});

//         //3 get friends post too
//         //Promise.all is used because we might be searching for many friends at once so we use "Promise.all"
//         //but a better way is mongodb is using the$in opereator

//         const friendPosts=await Post.find({
//             user:{$in:currentUser.following} //this will get all the posts of the users whose ids are in the following array of the current user and $in is used to match any of the values specified in an array

//         });

//         //4 combine the posts and sort them
//         //we merge my posts+friends posts, and sort them by date the newest first to see recent first 
//         const allPosts=userPosts.concat(friendPosts); //so here we r just concating the user posts and friends ppost in one place in all posts

//         allPosts.sort((a,b)=>{  //sorting the all post from a to b is in asseninf or new to old kind of i think

//         return new Date(b.createdAt)-new Date(a.createdAt);   //its just taking two post from the allpost and check the timsestaps of the post by post b-post a created at post date to find the new date post and then return it
//         });
//         res.json(allPosts);
//     }
//     catch(err){
//         res.status(500).json({error:err.message});
//     }
// });




/*Get allposts (paginated)
url: /api/posts/newposts/all?page=1&limit=10
method: GET

In MongoDB, we use two commands:

limit(10): "Only give me 10 items."

skip(20): "Ignore the first 20 items (because I already saw Page 1 and Page 2)."

The Formula: skip = (pageNumber - 1) * limit

Page 1: Skip 0 ((1-1)*10), Take 10.

Page 2: Skip 10 ((2-1)*10), Take 10.

Page 3: Skip 20 ((3-1)*10), Take 10.

*/

router.get("/newposts/all",protect,async(req,res)=>{
    try{
        //1 get page and limit from query params eg ?page=2
        //default to page 1 and limit 10 if not provided

        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit)||10;
        const skip=(page-1)*limit;

        //2 get current user
        const currentUser=await User.findById(req.user._id);

        //3 create a master list of Ids
        //we want post from  [me,...my friends]
        const allUserIds=[currentUser._id,...currentUser.following,currentUser.followers];

        //4 the optimized query
        //find post where user is IN the list of IDs
        //then .sort({creatAt: -1}): newest firs(-1)
        //.skip(skip): jump over previouse page
        //.limit(limit) :only take 10 post at a time
        //.poplulate() :show the author's username/pic (essential for a feed)


        const posts=await Post.find({user:{$in:allUserIds}})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate("user","username profilePicture")
        .populate("likes","username")
        .populate("comments","username"); 

        res.json(posts);
        
    }catch(err){
        res.status(500).json({error:err.message});
    }

});

    //like and unlike a post
    /*
    url: /api/posts/like/:id
    method:PUT
    access: private only logged in user can like or unlike
    
    */
 router.put("/like/:id",protect,async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error:"Post not found"});
        }
        //check id user already like the post
     if(post.likes.includes(req.user._id)){
        //unlike then remove use from like array
        await post.updateOne({$pull:{likes:req.user._id}});
        res.status(200).json({message:"Post unliked"});

     }else{
        //like add user to like array
        await post.updateOne({$push:{likes:req.user._id}});
        res.status(200).json({message:"Post liked"});
     }
    }catch(err){
        res.status(500).json({error:"Server error",err});

    }
 });
 
 //add comments to the post
 //url: /api/posts.comments/:id
 //method: PUT

 router.put("/comments/:id",protect,async(req,res)=>{
    try{

        const{text}=req.body;
        if(!text){
            return res.status(400).json({error:"Empty comments cannot be post"});

        }

        const post=await Post.findById(req.params.id);
     if(!post){
        return res.status(404).json({error:"Post not found"});

     }

     const comment={
        user:req.user._id, //the person commenting
        text:text,  //the comment text
        //createAt is auto added by the mdel defaully
     };


     //add to the array
     post.comments.push(comment);

     //save the post
     await post.save();

     res.status(200).json(post);
    }
    catch(err){
        res.status(500).json({error:"error.message"});
    }
 });
 




module.exports=router;
