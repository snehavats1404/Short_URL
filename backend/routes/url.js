const express= require('express');
const{handleGenerateshortURL,handleGetAnalytics}=require("../controllers/url");
const router=express.Router();
router.post("/",handleGenerateshortURL);

router.get('/analytics/:shortid',handleGetAnalytics);
module.exports=router;