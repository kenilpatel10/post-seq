const express = require("express");
const router = express.Router();
const { Posts ,Likes,Comments} = require("../models");
const multer= require("multer");
const path = require('path');
const {validateToken} = require("../Middleware/validateAuth");
const fs = require("fs");
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
    const listOfPosts = await Posts.findAll({include: [Likes,Comments]});

     const listOfLikes = await Likes.findAll({where :{UserId : req.user.id}})
     const listOfComments =await Comments.findAll()
     res.json({listOfPosts:listOfPosts, listOfLikes: listOfLikes, listOfComments: listOfComments});
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
    username: req.body.username
    }
 const posts=await Posts.create(post);
  res.status(201).json({
    message:"Success", 
    posts   
  }
  );
  } catch (error) {
    console.log(error)
    res.status(401).json({
      message:"Please Fill Every Fields",
    }
    );
  }
});
// router.put("/update/:id",upload.single("image"),async (req, res) => {
//   id = req.params.id
//   let post = Posts.findByPk(id);
//   if (!post) {
//     return next(new ErrorHandler("Post not found", 404));
//   }
//   post = await Posts.update(req.body, {
//  where:{id:id}
//   });
//   res.status(200).json({
//     success: true,
//     post,
//   });
// });

router.put("/update/:id",upload.single("image"),async (req, res) => {
  try {
    let id =  req.params.id
    if(req.file && req.file.path){
      let findImage = await Posts.findByPk(id);
      if(findImage && findImage.image){ 
        fs.unlinkSync(findImage.image);
  
        const post = await Posts.update({
          title:req.body.title,
          postText: req.body.postText,
          image:req.file.path,
          username: req.body.username
         }   
        ,{where: {id: id}})
        res.status(201).json(post)
       
        }
    }else{
      const post = await Posts.update({
        title:req.body.title,
        postText: req.body.postText,
        image:req.body.image,
        username: req.body.username
       }   
      ,{where: {id: id}})
      res.status(201).json(post)
    }
  } catch (error) {
    console.log(error)
  }

    
});
router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});





module.exports = router;