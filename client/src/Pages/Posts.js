import { React, useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Container, Form, Badge } from "react-bootstrap";
import InputEmoji from "react-input-emoji";
import { Link } from "react-router-dom";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { Accordion } from "react-bootstrap";
import { IoMdRemoveCircle } from "react-icons/io";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
const Posts = () => {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [listOfComments, setListOfComments] = useState([]);
  const [listOfLikes, setListOfLikes] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [chosenEmoji, setChosenEmoji] = useState(null);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };
  useEffect(() => {
    axios
      .get("http://localhost:3001/posts", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((res) => {
        setListOfPosts(res.data.listOfPosts);
        setListOfLikes(
          res.data.listOfLikes.map((like) => {
            return like.PostId;
          })
        );
        console.log(res.data);
      });
  }, []);

  const deleteComments = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        setNewComment(
          newComment.filter((val) => {
            return val.id === id;
          })
        );
      });
  };
  const deletePosts = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        setListOfPosts(
         listOfPosts.filter((val) => {
            return val.id === id;
          })
        );
      });
  };
  const addComment = (id) => {
    console.log("first", localStorage.getItem("postId"));
    if (newComment === "") {
      alert("Please add something");
    } else {
      axios
        .post(
          "http://localhost:3001/comments",
          {
            commentText: newComment,
            PostId: localStorage.getItem("postId"),
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((res) => {
          setNewComment(res.data);
          console.log("comments", res.data);

          if (res.data.error) {
            console.log(res.data.error);
          } else {
            const commentToAdd = { commentText: newComment };
            setListOfComments([...listOfComments, commentToAdd]);
          }
          setNewComment("");
        });
    }
  };
  const LikePost = (postId) => {
    console.log("first", localStorage.getItem("postId"));

    axios
      .post(
        "http://localhost:3001/likes",
        {
          PostId: postId,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (res.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );
        if (listOfLikes.includes(postId)) {
          setListOfLikes(
            listOfLikes.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          setListOfLikes([...listOfLikes, postId]);
        }
      });
  };

  const handleComment = (id) => {
    localStorage.setItem("postId", id);
    console.log(id);
    axios.get(`http://localhost:3001/comments/${id}`).then((res) => {
      setListOfComments(res.data);
      console.log("comments", res.data);
    });
  };

  return (
    <div>
      <div
        className="d-flex flex-row m-4  position-fixed "
        style={{ zIndex: "1" }}
      >
        <Button
          className="shadow-box-example z-depth-5"
          as={Link}
          to="/createpost"
          eventKey={2}
        >
          Add
        </Button>
      </div>

      <Container className="justify-content-center">
        {listOfPosts.map((e, i) => {
          const d = new Date(e.updatedAt);
          const n = d.getUTCHours();
          console.log("n", n);
          return (
            <Card className="m-4" style={{ minWidth: "200px" }}>
              <Card.Header className="text-left ">
                @ Kenil Patel{e.username}
                <div>
                                  {"kenil" ===
                                  localStorage.getItem("userName") ? (
                                    <>
                                      <p
                                        style={{ marginTop: "0px" }}
                                        onClick={() => deletePosts(e.id)}>
                                        <IoMdRemoveCircle />
                                      </p>
                                    </>
                                  ) : (
                                    <p
                                      style={{
                                        fontSize: "12px",
                                        color: "gray",
                                      }}
                                    >
                                      @{e.username}
                                    </p>
                                  )}
                                </div>
              </Card.Header>
              <Card.Body className="text-center ">
                <Card.Text>
                  <img
                    style={{
                      minHeight: "200px",
                      maxHeight:"400px",
                      minWidth: "200px",
                      maxWidth: "content-fit",
                    }}
                    src={`http://localhost:3001/${e.image.substr(
                      8,
                      e.image.length
                    )}`}
                    alt=""
                  />
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Card.Title>{e.title}</Card.Title>
                <p>{e.postText}</p>
                <div className="d-flex">
                  {listOfLikes.includes(e.id) ? (
                    <AiFillHeart
                      className="mt-1"
                     style={{color: "tomato",fontSize:"23px"}}
                      onClick={() => LikePost(e.id)}
                    ></AiFillHeart>
                  ) : (
                    <AiOutlineHeart
                      className="mt-1"
                      style={{color: "tomato",fontSize:"23px"}}
                      onClick={() => LikePost(e.id)}
                    ></AiOutlineHeart>
                  )}

                  <p className="mx-3 mt-1 ">{e.Likes.length}</p>
                </div>
                {/* <p className="text-end  text-muted">{n} hours ago</p> */}
              </Card.Footer>
              <>
                <Accordion onClick={() => handleComment(e.id)}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Comments</Accordion.Header>
                    <Accordion.Body className="accor">
                      {listOfComments.length > 0 ? (
                        listOfComments.map((i) => {
                          return (
                            <div
                              className="pt-1 px-3 pb-1 m-1"
                              style={{
                                borderRadius: "10px",
                                backgroundColor: "#F5F5F5  ",
                              }}
                            >
                              <Card.Text className="d-flex justify-content-between">
                                <span>
                                  {chosenEmoji ? (
                                    <span>you :{chosenEmoji.emoji}</span>
                                  ) : null}
                                  {i.commentText} &nbsp;&nbsp;&nbsp;&nbsp;
                                </span>
                                <div>
                                  {i.username ===
                                  localStorage.getItem("userName") ? (
                                    <>
                                      <p
                                        style={{ marginTop: "0px" }}
                                        onClick={() => deleteComments(i.id)}>
                                        <IoMdRemoveCircle />
                                      </p>
                                    </>
                                  ) : (
                                    <p
                                      style={{
                                        fontSize: "12px",
                                        color: "gray",
                                      }}
                                    >
                                      @{i.username}
                                    </p>
                                  )}
                                </div>
                              </Card.Text>
                            </div>
                          );
                        })
                      ) : (
                        <Card.Text>No Comments</Card.Text>
                      )}
                    </Accordion.Body>
                    <Form className="d-flex felx-row ">
                      <InputEmoji
                        value={newComment}
                        onChange={setNewComment}
                        cleanOnEnter
                        onEnter={() => addComment()}
                        placeholder="Type a comment"
                      />
                      {newComment !== "" ? (
                        <BsFillArrowRightCircleFill
                          onClick={() => addComment()}
                          className="my-4"
                          style={{ fontSize: "30px" }}
                        ></BsFillArrowRightCircleFill>
                      ) : null}
                    </Form>
                  </Accordion.Item>
                </Accordion>
              </>
            </Card>
          );
        })}
      </Container>
    </div>
  );
};

export default Posts;
