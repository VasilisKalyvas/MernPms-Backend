const  mongoose  = require("mongoose")

const connectDB = async () => {
    return mongoose
    .connect("//mongodbURL")
    .then(()=> console.log(`Connected to the database...`))
    .catch((err) => console.log(err));
};


module.exports = connectDB;
