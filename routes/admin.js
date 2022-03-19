const router = require('express').Router();
const auth = require('../middlewares/auth');
const admin = require("../middlewares/admin");


router.get("/admin", auth, admin, async  (req, res) => {
    return  res.status(200).json({...req.user._doc});
});
module.exports = router;