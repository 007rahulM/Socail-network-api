//its is the mainfile all the routes are imported here
const express=require("express");
const mongoose=require("mongoose");
require('dotenv').config();  //for the environment variable to get congigure 
const app=express();
app.use(express.json());

//routes will be defines here and used here

const authRoutes=require("./routes/authRoutes");
app.use("/api/auth",authRoutes);


//import user routes
const userRoutes=require("./routes/userRoutes");
app.use("/api/users",userRoutes);

//import the post routes 
const postRoutes=require("./routes/postRoutes");
app.use("/api/posts",postRoutes);

//import the uploadroutes
const uploadRoutes=require("./routes/uploadRoutes");
app.use("/api/upload",uploadRoutes);


//DB connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err =>console.log(err));


//ports
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));