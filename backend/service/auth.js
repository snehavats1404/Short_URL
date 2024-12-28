const jwt=require("jsonwebtoken");
const secret="sneha$123$";


function setUser(user) {
    return jwt.sign({
        id: user._id,
        email: user.email,
        name: user.name
    }, process.env.JWT_SECRET || 'sneha$123$', {
        expiresIn: '24h'
    });
}


function getUser(token){
    if(!token) return null;
    try{
        return jwt.verify(token,secret);
    }catch(error){
        return null
    }    
}

module.exports={
    setUser,
    getUser,
}