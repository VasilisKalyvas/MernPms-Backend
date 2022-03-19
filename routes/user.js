const User = require('../models/User');
const Task = require('../models/Task');
const auth = require('../middlewares/auth');
const mongoose = require("mongoose");
const router = require('express').Router();
const admin = require('../middlewares/admin');
const { JsonWebTokenError } = require('jsonwebtoken');
const Project = require('../models/Project');


// USER

//Get Users
router.get("/users", auth, admin,  async (req, res) => {
try {
    const users = await User.find({id: req.user._id});
    return res.status(200).json({users: users});
} catch (err) {
    console.log(err);
}
});
//Delete User
router.delete("/deleteuser/:id", auth, admin, async (req, res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({error: "No id specified."})
    if(!mongoose.isValidObjectId(id)) return res.status(400).json({error: "Please enter a valid id."})

try {

    const user = await User.find({id: id});
    if(!user) return res.status(400).json({error: "No user found."})


    const result = await User.findByIdAndDelete(id);
    return (
        res.status(200).json({message:"User deleted!", ...user._doc}));
} catch (err) {
    console.log(err);
}
});
//Edit User
router.put("/edituser", auth, admin,  async (req, res) => {
    const { id } = req.body;
  
    if (!id) return res.status(400).json({ error: "no id specified." });
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "please enter a valid id" });
  
    try {
      const user = await User.findOne({ _id: id });
  
      const updatedData = { ...req.body, id: undefined };
      const result = await User.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
  
      return res.status(200).json({ ...result._doc });
    } catch (err) {
      console.log(err);
    }
  });
//Get single User
router.get("/user/:id", auth, async (req, res) => {
    const { id } = req.params;
  
    if (!id) return res.status(400).json({ error: "no id specified." });
  
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "please enter a valid id" });
  
    try {
      const user = await User.findOne({ _id: id });
  
      return res.status(200).json({ ...user._doc });
    } catch (err) {
      console.log(err);
    }
  });

//TASKS

//Get user's task
router.get("/usertasks/:id", auth, admin,  async (req, res) => {
    
  const {id} = req.params;
  if(!id) return res.status(400).json({error: "No id specified."})
  if(!mongoose.isValidObjectId(id)) return res.status(400).json({error: "Please enter a valid id."});
  try {
      const users = await User.find({_id: id});
      const tasks = await Task.find({belongTo: id}).populate("belongTo", "-password");
  return (
      res.status(200).json({users: users, tasks: tasks}) );
} catch (err) {
  console.log(err);
}
});
//Create task for a user by id
router.post("/createusertasks/:id",auth, admin, async (req,res) => {
  const{name, description} = req.body;
  const {id} = req.params;
  if(!id) return res.status(400).json({error: "No id specified."})
  if(!mongoose.isValidObjectId(id)) return res.status(400).json({error: "Please enter a valid id."});
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
      //Contact Already Exists
       const newTask = new Task({name, description,  belongTo: id});


       //Save the contact
       const result = await newTask.save();

       return res.status(201).json({ ...result._doc });
   }
   catch(err){
       console.log(err);
       return res.status(500).json({ error: err.message });
   }
});
//Get single user's task
router.get("/usertasks/:id", auth, async (req, res) => {
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
//Edit user's task
router.put("/editusertask", auth, admin,  async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "no id specified." });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const task = await Task.findOne({ _id: id });

    const updatedData = { ...req.body, id: undefined };
    const result = await Task.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return res.status(200).json({ ...result._doc });
  } catch (err) {
    console.log(err);
  }
});
//Delete user's Task
router.delete("/deleteusertask/:id", auth, admin, async (req, res) => {
  const {id} = req.params;
  if(!id) return res.status(400).json({error: "No id specified."})
  if(!mongoose.isValidObjectId(id)) return res.status(400).json({error: "Please enter a valid id."})

try {
  const task = await Task.find({id: id});
  if(!task) return res.status(400).json({error: "No contact found."})


  const result = await Task.findByIdAndDelete(id);
  return (
      res.status(200).json({message:"Task deleted!", ...task._doc}));
} catch (err) {
  console.log(err);
}
});

//PROJECT


// Create Project
router.post("/project", auth, admin, async (req,res) => {
  const{name, description, users} = req.body;
 // const task = tasks.toString();
  //const user = users.toString();
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
  
       const newProject = new Project({name, description, users, createdBy: req.user._id});


       //Save the contact
       const result = await newProject.save();

       return res.status(201).json({ ...result._doc });
   }
   catch(err){
       console.log(err);
       return res.status(500).json({ error: err.message });
   }
});

//Edit Project
router.put("/editproject", auth, admin,  async (req, res) => {
  const { id } = req.body;
  
    if (!id) return res.status(400).json({ error: "no id specified." });
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "please enter a valid id" });
  
    try {
      const project = await Project.findOne({ _id: id });
  
      const updatedData = { ...req.body, id: undefined };
      const result = await Project.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
  
      return res.status(200).json({ ...result._doc });
    } catch (err) {
      console.log(err);
    }
  });

//Delete Project
router.delete("/deleteproject/:id", auth, admin, async (req, res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({error: "No id specified."})
    if(!mongoose.isValidObjectId(id)) return res.status(400).json({error: "Please enter a valid id."})

try {
    const project = await Project.find({_id: id});
    if(!project) return res.status(400).json({error: "No project found."})


    const resultTask = await Task.deleteMany({belongToProject: id});
    const result = await Project.findByIdAndDelete(id);
    return (
        res.status(200).json({message:"Project deleted!"}));
} catch (err) {
    console.log(err);
}
});
// Get All Projects
router.get("/projects", auth, admin, async (req, res) => {
  try {
    const projects = await Project.find()
    .populate("tasks")
      .populate({
        path : 'tasks',
        populate : {
          path : 'belongToUser'
        }
      }).populate("users", "-password")
      .populate("createdBy","-password");
  
    return res.status(200).json({projects: projects});
  } catch (err) {
    console.log(err);
  }
});

//Get a single project.
router.get("/project/:id", auth, admin, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified." });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const project = await Project.findOne({ _id: id });

    return res.status(200).json({ ...project._doc });
  } catch (err) {
    console.log(err);
  }
});

//Add user to the project
router.put("/addusertoproject/:id", auth, admin,  async (req, res) => {
  const { id} =  req.params;
  const { users } =  req.body;
  if (!id) return res.status(400).json({ error: "no id specified." });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const project = await Project.findOne({ _id: id });
 
    const result = await Project.findByIdAndUpdate(id,  { $addToSet: {users:users}  }, {
    new: true,
    });
    return res.status(200).json({ ...result });
  } catch (err) {
    console.log(err);
  }
});

//Remove user to the project
router.put("/removeusertoproject/:id", auth, admin,  async (req, res) => {
  const { id} =  req.params;
  const { users } =  req.body
  if (!id) return res.status(400).json({ error: "no id specified." });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const project = await Project.findOne({ _id: id });
    const result = await Project.findByIdAndUpdate( id,  { $pull: {users:users}},{
      new: true,
      });
    const removeTask = await Task.deleteOne( { _id: id } && {belongToUser:users} && { belongToProject: id}, {
      new: true,
    });
    return res.status(200).json({ ...result._doc });
  } catch (err) {
    console.log(err);
  }
});

//Get projects tasks
router.get("/projecttasks/:id", auth, admin,  async (req, res) => {
    
  const {id} = req.params;
  if(!id) return res.status(400).json({error: "No id specified."})
  if(!mongoose.isValidObjectId(id)) return res.status(400).json({error: "Please enter a valid id."});
  try {
      const project = await Project.find({_id: id});
      const tasks = await Task.find({belongToProject: id}).populate({
        path : 'belongToUser'
      });
  return (
      res.status(200).json({project: project, tasks: tasks}) );
} catch (err) {
  console.log(err);
}
});

//Create task for the project
router.post("/createtaskforproject/:id", auth, admin,  async (req, res) => {
  const{name, description, belongToUser} = req.body;
  const {id} = req.params;
  if(!id) return res.status(400).json({error: "No id specified."})
  if(!mongoose.isValidObjectId(id)) return res.status(400).json({error: "Please enter a valid id."});
  //Check all input fields
  if(!name || !description || !belongToUser){
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
    
    const result = await Project.find({_id:id, "users":  belongToUser });
    console.log(result);
    console.log(belongToUser);
    if(result.length===0){
        return res
        .status(400)
        .json({ error:`User doenst exists in Project!`});
    }else{
      const newTask = new Task({name, description,  belongToUser: belongToUser, belongToProject: id});
      const resultTask = await newTask.save();
      const taskId = newTask._id;
      const addtoProject = await Project.findByIdAndUpdate(id,  {$addToSet: { tasks : taskId }}, {
    new: true,
    });
       //Save the Task
       
       return res.status(201).json({ ...resultTask._doc });
    }
   }
   catch(err){
       console.log(err);
       return res.status(500).json({ error: err.message });
   }
});

//Remove task from the project
router.put("/removetaskfromproject", auth, admin,  async (req, res) => {
  const { id} =  req.body;
  if (!id) return res.status(400).json({ error: "no id specified." });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const project = await Project.findOne({ _id: id });
    const data = { ...req.body,  id: undefined };
    const result = await Project.findByIdAndUpdate( id,  { $pull: data},{
      new: true,
      });
    return res.status(200).json({ ...result._doc });
  } catch (err) {
    console.log(err);
  }
});

//Get single task
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

//Edit task
router.put("/edittask", auth, admin,  async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "no id specified." });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const task = await Task.findOne({ _id: id });

    const updatedData = { ...req.body, id: undefined };
    const result = await Task.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return res.status(200).json({ ...result._doc });
  } catch (err) {
    console.log(err);
  }
});
//Done task
router.put("/donetask/:id", auth,  async (req, res) => {
  const {id} = req.params;

  if (!id) return res.status(400).json({ error: "no id specified." });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const task = await Task.find({ _id: id });
    const result = await Task.findByIdAndUpdate(id, {status:true}, {
      new: true,
    });

    return res.status(200).json({ ...result._doc });
  } catch (err) {
    console.log(err);
  }
});
//UnDone task
router.put("/undonetask/:id", auth,  async (req, res) => {
  const {id} = req.params;

  if (!id) return res.status(400).json({ error: "no id specified." });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const task = await Task.find({ _id: id });
    const result = await Task.findByIdAndUpdate(id, {status:false}, {
      new: true,
    });

    return res.status(200).json({ ...result._doc });
  } catch (err) {
    console.log(err);
  }
});
//Delete task
router.delete("/deletetask/:id", auth, admin, async (req, res) => {
  const {id} = req.params;
  if(!id) return res.status(400).json({error: "No id specified."})
  if(!mongoose.isValidObjectId(id)) return res.status(400).json({error: "Please enter a valid id."})

try {
  const task = await Task.find({id: id});
  if(!task) return res.status(400).json({error: "No Task found."})


  const result = await Task.findByIdAndDelete(id);
  return (
      res.status(200).json({message:"Task deleted!", ...task._doc}));
} catch (err) {
  console.log(err);
}
})
/// For Testing

//Find a project by id that contains a specific user 
router.get("/projectbyBelongToUser/:id", auth, admin, async (req, res) => {
  try {
    const {id} = req.params;
    const {belongToUser} = req.body;
    const result = await Project.find( { _id:id} && {"users": {$in:  belongToUser }});
    if(result.length ==! 0){
      
      return res.status(200).json(result);
    
    }else{
      return res.status(500).json({ error:`User doenst exists in Project!`});
    }
  } catch (err) {
    console.log(err);
  }
});



module.exports = router;