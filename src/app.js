const express=require("express");

const app=express()

app.use("/testtt",(req,res)=>{
    res.send("Hello from server")
})

app.listen(3000,()=>{
    console.log("Serve started at port 3000")
})