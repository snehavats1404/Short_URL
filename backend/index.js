const express=require("express");
const URL=require("./models/url");
const path=require('path');
const cookieParser= require('cookie-parser');
const {checkForAuthentication, restrictTo}= require('./middleware/auth');
const cors = require('cors');
const {connectToMongoose}=require("./connections");
const urlRoute=require("./routes/url");
const staticRoute=require('./routes/staticRouter');
const userRoute=require('./routes/user');
const router = require("./routes/url");


const app=express();
const PORT= 8006; 
connectToMongoose('mongodb://localhost:27017/short-url').then(()=>console.log('MongoDb connected'));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());



app.use(checkForAuthentication);

app.set("view engine","ejs");
app.set('views',path.resolve("./views"));





app.use("/url",restrictTo(["NORMAL","ADMIN"]),urlRoute);
app.use("/",staticRoute);
app.use("/user",userRoute);


//dynamic route
app.get('/url/:shortid',async (req,res)=>{
    const shortid =req.params.shortid;
    
    const entry=await URL.findOneAndUpdate({
        shortid
    },{
        $push:{
            visitHistory: {
               timestamp: Date.now(),
            },
        }
    }
);
res.redirect(entry.redirectURL);
})






app.listen(PORT,()=>console.log(`Server started at PORT:${PORT}`))