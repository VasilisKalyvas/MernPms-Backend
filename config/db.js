const  mongoose  = require("mongoose")

const connectDB = async () => {
    return mongoose
    .connect("mongodb+srv://bkalivas:((u27SOx@cluster0.h3acx.mongodb.net/CMS?retryWrites=true&w=majority")
    .then(()=> console.log(`Connected to the database...`))
    .catch((err) => console.log(err));
};


module.exports = connectDB;