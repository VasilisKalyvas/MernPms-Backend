require("dotenv").config({path: "./config/config.env"});
const router = require('express').Router();
const bcrypt = require('bcrypt');

const auth = require('../middlewares/auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const admin = require("../middlewares/admin");


router.post("/register", async (req,res) => {
    const{name, email, password} = req.body;
    
    //Check all input fields
    if(!name || !email || !password){
        return res
        .status(400)
        .json({ error:`Please enter all the required fields!`});
    }

    //check Name
    if(name.length > 25){
        return res
            .status(400)
            .json({ error:`Name must be less than 25 characters!`});
    }

    //check email
    const emailReg = 
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!emailReg.test(email)){
        return res
            .status(400)
            .json({ error:`Please enter a valid email address!`});
    }
    //Validate password
    if(password.length<=6){
        return res
            .status(400)
            .json({ error:`Password must be at least 6 characters long!`});
    }

    //Model Creation

    try{
       //User Already Exists
        const doesUserAlreadyExist = await User.findOne({email});
        if(doesUserAlreadyExist){
            return res
            .status(400)
            .json({ error:`User with email: ${email} already exists!`});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({name, email, password: hashedPassword})


        //Save the user
        const result = await newUser.save();

        //result._doc.password = undefined;

        return res.status(201).json({ ...result._doc });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body

    //Check all input fields
    if(!email || !password){
        return res
        .status(400)
        .json({ error:`Please enter all the required fields!`});
    }

    //check email
    const emailReg = 
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!emailReg.test(email)){
        return res
            .status(400)
            .json({ error:`Please enter a valid email address!`});
    }

    //Validate password
    if(password.length<=6){
        return res
            .status(400)
            .json({ error:`Password must be at least 6 characters long!`});
    }
    try {
        //User Doesnt Exist
        const doesUserExist = await User.findOne({email});
        if(!doesUserExist){
            return res
            .status(400)
            .json({ error:`Invalid email or Password!`});
        }
        
        //if user Exists
        const doesPasswordMatch = await bcrypt.compare(password, doesUserExist.password)
        if(!doesPasswordMatch){
            return res
            .status(400)
            .json({ error:`Invalid email or Password!`});
        }

        const payload = { _id: doesUserExist._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "8h"});

        const user = {...doesUserExist._doc, password: undefined};
        return res.status(200).json({token, user});

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

router.get("/me", auth, async  (req, res) => {
    return res.status(200).json({...req.user._doc});
});

module.exports = router;