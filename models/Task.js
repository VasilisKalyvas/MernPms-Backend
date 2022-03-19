const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
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
    belongToUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Description is required!"],
        ref: "User",
        default: undefined 
    },
    belongToProject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: undefined 
    },
});

const Task = new mongoose.model("Task", TaskSchema);

module.exports = Task;