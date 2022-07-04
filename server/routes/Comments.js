
const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const {validateToken} = require("../Middleware/validateAuth")
router.get("/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comments.findAll({ where: { PostId: postId } });
    res.json(comments);
  } catch (error) {
    
  }

});

router.delete("/:commentId",validateToken,async (req, res) => {
  try {
    const commentId = req.params.commentId
    await Comments.destroy({where:{id : commentId}})
    res.json({message: "Success"});
    
  } catch (error) {
    
  }

});
router.post("/",validateToken, async (req, res) => {
  try {
    const {PostId} = req.body;
    const UserId = req.user.id;
    const username = req.user.username
    const comment = {commentText:req.body.commentText,username:username, UserId: UserId , PostId: PostId}
    // const UserId = req.user.id;
   
    // const comment = req.body;
    // const username = req.user.username
    // comment.username = username
    // comment.UserId =UserId
    await Comments.create(comment);
    res.json(comment);
  } catch (error) {
  
  }

});

module.exports = router;