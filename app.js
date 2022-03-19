const express = require('express');
const morgan = require("morgan");
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const auth = require("./middlewares/auth");
const app = express();

//middlewares
app.use(express.json());
app.use(morgan("tiny"));
app.use(require('cors')());
//routes
app.get("/protected", auth, (req, res) =>{
    return res.status(200).json({...req.user._doc });
});
app.use("/api",require("./routes/auth"));
app.use("/api",require("./routes/admin"));
app.use("/api",require("./routes/user"));
app.use("/api",require("./routes/task"));
app.use("/api",require("./routes/projects"));
//server 
const PORT = process.env.PORT ||  8000;
app.listen(PORT, async () => {
    try{
        await connectDB();
        console.log(`Server listening on port : ${PORT}`);
    }
    catch(err){
        console.log(err);
    }   
});