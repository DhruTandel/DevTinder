const validator=require("validator")


const signUpValidation=(req)=>{
    const {firstName,lastName,emailID,password}=req.body;

    const validateEmail=validator.isEmail(emailID)
    if(!validateEmail){
        throw new Error("Email is invalid")
    }

    const validatePassword=validator.isStrongPassword(password)
    if(!validatePassword){
        throw new Error("Password should contain 1 uppercase, 1 lower case and special character and must be 6 charcter long")
    }
}

module.exports=signUpValidation;