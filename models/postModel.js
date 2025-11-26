//this is the model for the user post like images and all  its likes  and all like that will be sotred so that we will be add this things in the post model schema 

//here we need like  user -the user who is posinf we ref it from the user and get the user
// thent he desc-description on the post  the context text
//then the image they want to post like that  it willl be in string because wt ever they post will first upload in the cloud and the cloud link willl be stored in the db 
//like- who like it will also ref the user  
//then at last timestamps when post is done all details will be stored in here

const mongoose=require("mongoose");

const postSchema=new mongoose.Schema({

    //who created this post?
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    //the content in text
    desc:{
        type:String,
        maxlength:500
    },

    //the content in the iamge  its optional 
    //because the user can post normal message also the showing of this things will be of frontedn only for now its a backend we are doing so no need ig 
    //so image is optional
    img:{
        type:String //the image will be in the link or in the sting format url or cloud libk not anything cannot store in db directly it will take more storage if we just added the image idrectly into  the db so to avoid that i used here the string

    },

    //who like this post? (array of users ids)
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],

    //comments array of comments ids
    comments:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },

            text:{
                type:String,
                required:true
            },
            createdAt:{
                type:Date,
                default:Date.now
            }
        }
    ]

},{timestamps:true});

module.exports=mongoose.model("Post",postSchema);
