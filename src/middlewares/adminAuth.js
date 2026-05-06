const adminAuth=(req,res,next)=>{
    console.log("Middleware is running")
    const token="xyz";
    const isAdminAuthorised=token==="xyz";
    if(!isAdminAuthorised){
        res.status(401).send("Unauthorized Admin")
    }else{
        next()
    }
}

module.exports=adminAuth