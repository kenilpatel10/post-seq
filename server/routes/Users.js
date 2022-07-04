const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt= require("bcryptjs")
const { sign } = require("jsonwebtoken");
router.get("/", async (req, res) => {
    try {
        const listOfUsers = await Users.findAll();
        res.json(listOfUsers);
        
    } catch (error) {
        
    }

});

router.post("/register", async (req, res) => {
    try {

        const user= await Users.findOne({where:{email: req.body.email}})
        const user1= await Users.findOne({where:{username: req.body.username}})
       if(user1){
        res.status(401).json({
          message: `Username Should be unique`,
      })
       }
console.log(user)
if(user){
    res.status(401).json({
        message: `User Already Exists`,
    })
}
if(!user && !user1){
  bcrypt.hash(req.body.password,10).then((hash)=>{
 Users.create({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
  })
   
      console.log("user",req.body);
    res.status(201).json({
      status: `Success 💥`,
    });
}
    
     
     
    } catch (error) {
        
    }

});


router.post("/login", async (req, res) => {
  
  const { email, password } = req.body;

  const user = await Users.findOne({ where: { email: email } });

  if (user) {
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) res.status(401).json({ message: "Wrong Email And Password Combination" });
      const accessToken = sign(
                  { username: user.username, id: user.id },
                  "importantsecret"
                );
             
                res.status(201).json({
                              username: user.username,
                              email: user.email,
                              userid:user.id,
                              accessToken,
                              message:"You Are Logged In"
                            });
    })
  }
else{
  
  res.status(400).json({ message: "User Doesn't Exist" })
}

  
  
});

// router.post("/login", async (req, res) => {
   
//         const { email, password } = req.body;
      
//         if (!email || !password) {
//           return res.status(400).json({
//             message: "Please enter email and password",
//           });
//         }
//         const user = await Users.findOne({where:{ email }});

//         if(!user){
//           return res.status(400).json({
//             message: "Invalid Email or Password",
//           });
//         }
//         bcrypt.compare(password, user.password).then((match)=>{
//           if(!match){
//             res.json({ message:"Password didnt not match"})
//           }
//           res.status(201).json({
//             username: user.username,
//             email: user.email,
//             accessToken,
//           });
  
//         })
//         const accessToken = sign(
//           { username: user.username, id: user.id },
//           "importantsecret"
//         );
     
// });

module.exports = router;