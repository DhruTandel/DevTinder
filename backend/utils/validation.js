const validator = require("validator");

const signUpValidation = (req) => {
  const { firstName, lastName, emailID, password } = req.body;

  const validateEmail = validator.isEmail(emailID);
  if (!validateEmail) {
    throw new Error("Email is invalid");
  }

  const validatePassword = validator.isStrongPassword(password);
  if (!validatePassword) {
    throw new Error(
      "Password should contain 1 uppercase, 1 lower case and special character and must be 6 charcter long",
    );
  }
};

const validateProfileData = (req) => {
  const updateAllowedField = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "skills",
    "profession"
  ];

  const isEditAllowed=Object.keys(req.body).every((field)=>{
    return updateAllowedField.includes(field)
  })
 
  return isEditAllowed;
};

module.exports = {signUpValidation,validateProfileData};
