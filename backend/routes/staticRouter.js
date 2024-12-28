const express= require('express');
const router=express.Router();
const {restrictTo}= require("../middleware/auth");
const URL = require('../models/url');  // Adjust path if necessary

router.get('/admin/urls',restrictTo(['ADMIN']), async(req,res)=>{
    const allurls = await URL.find();
    return res.render("home",{
        urls: allurls,
    });
});



// In your backend route handler
router.get('/', async (req, res) => {
  try {
    const urls = await URL.find({ createdBy: req.user._id });
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch URLs' });
  }
});

router.get('/signup',(req,res)=>{
    return res.render("signup");
})

router.get('/login',(req,res)=>{
    return res.render("login");
})


module.exports=router;