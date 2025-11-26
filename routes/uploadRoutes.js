/*
here we r going to build dedeicated upload route y seprate? bcz it keeps things clean instead of embedding complex upload logic inside the create post route so we 
so we make a rout that just says give me a file i gice you a url like that then the frontend can use that url to create the post
*/

const express=require("express");
const multer=require("multer");
const cloudinary=require("cloudinary").v2;
const router=express.Router();

//1 configure cloudinary
//we tell the library abbout like "here are my keys so i can talk to the cloud 

cloudinary.config({
    cloudinary_url:process.env.CLOUDINARY_URL
});

//2 configure multer the middleware
//multer acts as a bridge  it takes the raw file data from the request
//and then stores it temporarily on the memory RAM so we can upload it

const storage=multer.memoryStorage();
const upload=multer({storage:storage});

/*
Upload route
url: /api/upload
//method:POST
middleare: upload.single("file")->this takes one files from the field name file

*/

router.post("/",upload.single("file"),async(req,res)=>{
    try{
        //safety check -did they actually send a file?
        if(!req.file){
            return res.status(400).json({error:"No file uploaded"});
        }

        //3 upload to cloudinary
        //this part is tricly because cloudinary express a file path but we have a buffer data in RAM
        //we use a "Stream" to pipe the data directly to cloudinary

        //we wrap this in a Promise so we can await the result cleanly
        const result=await new Promise((resolve,reject)=>{

          const uploadStream=cloudinary.uploader.upload_stream(
            {resource_type:"auto"},  //it auto-detect image or video like that
            (error,result)=>{
                if(error) reject(error);
                else resolve(result);
            }
          );

          //now push the file data into the stream
          uploadStream.end(req.file.buffer);
        });

        //4 Success
        //we send back the secure url https://...
        //the frontend will grap this url and send it to the creat post endpoiny
        res.status(200).json({url:result.secure_url});
    }
    catch(err){
        console.error("Upload Error:",err);
        res.status(500).json({error:"upload failed"});

    }
});


module.exports=router;