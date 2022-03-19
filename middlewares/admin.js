
const User = require("../models/User");

module.exports = (req, res, next) => {
   if(!req.user.role){
       res.status(403)
       return res.status(403).json({error: "Forbidden !!!"});
   }
   
    next();

}