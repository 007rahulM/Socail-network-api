/*
this is the use model file where the user blueprint will be defined

more info  will be added later


*/

const mongoose=require("mongoose"); //we need to add mongoose to make the dn on nased on the blueprint so 

const userSchema=new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true, // bcz in every socail platform the username cannot be same so username must be unique
        trim:true   //the extra spaces wiil be removed
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true, //to converst all the email to lowercase
    //this is the regec for email to chek if it looke like an email like that
    match:[
        //this will check if the use email match the patters or not if not then give the message below it
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email"
    ]
    
    },

    password:{
        type:String,
        required:true,
        minlength:6  //the password must be minum of 6charts 
    },

    profilePicture:{
        type:String,
        default:"" //we will store the url here later the profile picture wts the use upload goes to cloud and the cloud link will be stored in the db so default will be nothing if u want we can add the default link of user proifle like one default picture for now it will be nothing

    },

    bio:{
        type:String,
        maxlenght:160, //like twitter the bio max length will be 160 chars like that so that bio must be consize
        default:""//by defaut bio will be empty
    },

 /* here comes the relationship grap to thing 
  //here we store a list of User IDs.
  
  //if i follow 5 people ,this array has 5 ids in in
  //if i unfollow the id will be remove from this list of ids like that
 */   

  //its following array were it shows whom u following list of users
  following:[
    {
        type:mongoose.Schema.Types.ObjectId,   //its embeded schema its like schema inside a scehma it calls the current user details like that
        ref:"User"
    }
  ],

  //if the 100 people follow me, this array has 100 Ids likes  
  followers:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
  ]
  
},{timestamps:true});

module.exports=mongoose.model("User",userSchema);