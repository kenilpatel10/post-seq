const express = require("express");
const router = express.Router();
const { Posts ,Likes} = require("../models");
const multer= require("multer");
const path = require('path');
const {validateToken} = require("../Middleware/validateAuth");
// const Likes = require("../models/Likes");
const storage= multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null , 'uploads/')
  },
  filename: (req, file , cb)=>{
    console.log(file);
    cb(null, "image" + Date.now() + path.extname(file.originalname) )
  }

})
const upload = multer({storage: storage});

router.get("/",validateToken,async (req, res) => {
  try {
    const listOfPosts = await Posts.findAll({include: [Likes]});

     const listOfLikes = await Likes.findAll({where :{UserId : req.user.id}})
     res.json({listOfPosts:listOfPosts, listOfLikes: listOfLikes});
    } catch (error) {
    
  }

});

const data = {
 "image": upload.single("image"),
 "token": validateToken

}

router.delete("/:postId",validateToken,async (req, res) => {
  try {
    const postId = req.params.postId
    await Posts.destroy({where:{id : postId}})
    res.json({message: "Success"});
    
  } catch (error) {
    
  }

});
router.post("/",upload.single("image"),async (req, res) => {
  try {
    // const userId = req.params.userId;

    // console.log("idsdfgeargherg",req.user.id)
    // const userid   = req.user.id
    // console.log("id",validateToken.id)
    let post ={
      title:req.body.title,
    postText: req.body.postText,
    image:req.file.path,
    // UserId: userid
    }
 const posts=await Posts.create(post);
  res.json({
    message:"Success", 
    posts   
  }
  );
  } catch (error) {
    console.log(error)
    res.json({
      message:"not Success", 
      error
    }
    );
  }
  
});


module.exports = router;