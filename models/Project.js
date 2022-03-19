const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required!"]
    },
    description:{
        type: String,
        required: [true, "Description is required!"]
    },
    status:{
        type: Boolean,
        default: false
    },
    tasks: {
       type: [{ type: mongoose.Schema.Types.ObjectId, unique:true, sparse:true,  ref: "Task"}] 
    },
    users: {
        type: [{ type: mongoose.Schema.Types.ObjectId,  unique:true, sparse:true, ref: "User"}]

    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const Project = new mongoose.model("Project", ProjectSchema);

module.exports = Project;