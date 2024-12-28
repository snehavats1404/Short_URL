const mongoose=require("mongoose");


async function connectToMongoose(url){
    await mongoose.connect(url);
    console.log("connected to mongodb");
}

module.exports={
    connectToMongoose,
}