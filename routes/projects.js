const auth = require('../middlewares/auth');
const router = require('express').Router();
const Project = require('../models/Project');


//Get Project by users
router.get("/myprojects", auth, async (req, res) => {
  try {
      const myprojects = await Project.find({users: req.user._id})
      .populate("tasks")
      .populate({
        path : 'tasks',
        populate : {
          path : 'belongToUser'
        }
      }).populate("users", "-password")
      .populate("createdBy","-password");
      return res.status(200).json({projects: myprojects});
  } catch (err) {
      console.log(err);
  }
  });
  module.exports = router;