const Task = require('../models/Task');
const auth = require('../middlewares/auth');
const mongoose = require("mongoose");
const router = require('express').Router();

//create Task
router.post("/task", auth, async (req,res) => {
    const{name, description} = req.body;
    
    //Check all input fields
    if(!name || !description){
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
    
    //Model Creations
    try{
        //Task Already Exists
         const taskAlreadyExist = await Task.findOne({name});
         if(taskAlreadyExist){
             return res
             .status(400)
             .json({ error:`Task with name: ${name} already exists!`});
         }
         const newTask = new Task({name, description, status, belongTo: req.user._id});
 
 
         //Save the task
         const result = await newTask.save();
 
         return res.status(201).json({ ...result._doc });
     }
     catch(err){
         console.log(err);
         return res.status(500).json({ error: err.message });
     }
});
//Get Tasks by belong to
router.get("/mytask", auth, async (req, res) => {
try {
    const mytasks = await Task.find({belongToUser: req.user._id}).populate("belongToUser", "-password").populate("belongToProject");;
    return res.status(200).json({tasks: mytasks});
} catch (err) {
    console.log(err);
}
});
//Get a single contact.
router.get("/task/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified." });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const task = await Task.findOne({ _id: id });

    return res.status(200).json({ ...task._doc });
  } catch (err) {
    console.log(err);
  }
});
// Get all tasks
router.get("/task", auth, async (req, res) => {
try {
  const tasks = await Task.find().populate("belongTo", "-password");

  return res.status(200).json({tasks: tasks});
} catch (err) {
  console.log(err);
}
});

{/* Delete 
router.delete("/delete/:id", auth, async (req, res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({error: "No id specified."})
    if(!mongoose.isValidObjectId(id)) return res.status(400).json({error: "Please enter a valid id."})

try {

    const contact = await Contact.findOne({_id: id});
    if(!contact) return res.status(400).json({error: "No contact found."})

    if(req.user._id.toString() !== contact.postedBy._id.toString()) return res.status(400).json({error: "You cant delete this! No permission!."})

    const result = await Contact.findByIdAndDelete(id);
    return (
        res.status(200).json({message:"Contact deleted!", ...contact._doc}));
} catch (err) {
    console.log(err);
}
}); */}

{/*Edit Contact
router.put("/editcontact", auth, async (req, res) => {
    const { id } = req.body;
  
    if (!id) return res.status(400).json({ error: "no id specified." });
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "please enter a valid id" });
  
    try {
      const contact = await Contact.findOne({ _id: id });
  
      if (req.user._id.toString() !== contact.postedBy._id.toString())
        return res
          .status(401)
          .json({ error: "you can't edit other people contacts!" });
  
      const updatedData = { ...req.body, id: undefined };
      const result = await Contact.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
  
      return res.status(200).json({ ...result._doc });
    } catch (err) {
      console.log(err);
    }
  }); */}

  module.exports = router;