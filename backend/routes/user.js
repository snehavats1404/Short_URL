const express=require("express");
const {handleuserSignup,handlelogin}=require("../controllers/user");
const { checkForAuthentication } = require('../middleware/auth');
const router=express.Router();
router.get('/verify-token', checkForAuthentication, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  // If token is valid, return user data
  res.json({ user: req.user });
});

router.post('/',handleuserSignup); 
router.post("/login",handlelogin);

module.exports=router;