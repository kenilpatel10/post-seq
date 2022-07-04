import { React, useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Container,
  Form,
  Row,
  Col,
  Modal,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { IoMdRemoveCircle } from "react-icons/io";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";

import { BsFillChatTextFill } from "react-icons/bs";
import Loader from "./Loader";
import Swal from "sweetalert2";
const Posts = () => {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [listOfComments, setListOfComments] = useState([]);
  const [listOfLikes, setListOfLikes] = useState([]);
  const [newComment, setNewComment] = useState([]);

  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setTimeout(() => {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((res) => {
          const postData = res.data.listOfPosts;
          setLoading(false);
          setListOfPosts(postData.reverse());
          setListOfLikes(
            res.data.listOfLikes.map((like) => {
              return like.PostId;
            })
          );
          setListOfComments(res.data.listOfComments);
        });
    }, 1000);
  }, []);

  const deleteComments = (id, id1) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        setListOfComments(
          listOfComments.filter((val) => {
            return val.id === id;
          })
        );
        axios.get(`http://localhost:3001/comments/${id1}`).then((res) => {
          setListOfComments(res.data);
        });
      });
  };
  const deletePosts = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
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
            axios
              .get("http://localhost:3001/posts", {
                headers: { accessToken: localStorage.getItem("accessToken") },
              })
              .then((res) => {
                const postData = res.data.listOfPosts;

                setListOfPosts(postData.reverse());
              });
          });
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
      }
    });
  };

  const addComment = () => {
    const id = localStorage.getItem("postId");
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

        if (res.data.error) {
        } else {
          const commentToAdd = { commentText: newComment };
          setListOfComments([...listOfComments, commentToAdd]);
          axios.get(`http://localhost:3001/comments/${id}`).then((res) => {
            setListOfComments(res.data);
          });
        }

        setNewComment("");
      });
    // }
  };

  const LikePost = (postId) => {
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
    setShow(true);
    localStorage.setItem("postId", id);

    axios.get(`http://localhost:3001/comments/${id}`).then((res) => {
      setListOfComments(res.data);
    });
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
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
          {listOfPosts.length > 0 ? (
            <Container className="justify-content-center">
              {listOfPosts.map((e, i) => {
                const d = new Date(e.updatedAt);
                const n = d.getUTCHours();

                return (
                  <Card className="m-4" style={{ minWidth: "200px" }}>
                    <Card.Header>
                      <Row>
                        <Col className="d-flex p-1 px-2"> @{e.username}</Col>
                        <Col className="d-flex justify-content-end">
                          {" "}
                          {e.username === localStorage.getItem("userName") ? (
                            <>
                              <Dropdown>
                                <Dropdown.Toggle></Dropdown.Toggle>
                                <Dropdown.Menu size="sm" title="sgs">
                                  <Dropdown.Item
                                    as={Link}
                                    to={`/updatepost/${e.id}`}
                                  >
                                    Edit
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => deletePosts(e.id)}
                                  >
                                    Delete
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </>
                          ) : null}
                        </Col>
                      </Row>
                    </Card.Header>
                    <Card.Body className="text-center ">
                      <Card.Text>
                        <img
                          style={{
                            minHeight: "200px",
                            maxHeight: "400px",
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
                            style={{ color: "tomato", fontSize: "23px" }}
                            onClick={() => LikePost(e.id)}
                          ></AiFillHeart>
                        ) : (
                          <AiOutlineHeart
                            className="mt-1"
                            style={{ color: "tomato", fontSize: "23px" }}
                            onClick={() => LikePost(e.id)}
                          ></AiOutlineHeart>
                        )}

                        <p className="mx-3 mt-1 ">{e.Likes.length}</p>
                        <BsFillChatTextFill
                          onClick={() => handleComment(e.id)}
                          className="mt-1"
                          style={{ color: "skyblue", fontSize: "20px" }}
                        />
                      </div>
                      {/* <p className="text-end  text-muted">{n} hours ago</p> */}
                    </Card.Footer>
                    <>
                      <Modal
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        show={show}
                        onHide={handleClose}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Comments</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
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
                                  <div className="d-flex justify-content-between">
                                    <span>
                                      {i.commentText} &nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                    <div>
                                      {i.username ===
                                      localStorage.getItem("userName") ? (
                                        <>
                                          <p
                                            style={{ marginTop: "0px" }}
                                            onClick={() =>
                                              deleteComments(
                                                i.id,
                                                localStorage.getItem("postId")
                                              )
                                            }
                                          >
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
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p>No Comments</p>
                          )}
                        </Modal.Body>
                        <Modal.Footer></Modal.Footer>

                        <div className="d-flex">
                          <Form.Control
                            className="m-3"
                            name="comment"
                            value={newComment}
                            onChange={(x) => setNewComment(x.target.value)}
                            // onClick={() => addComment()}
                            placeholder="Type a comment"
                          />

                          {newComment !== "" ? (
                            <BsFillArrowRightCircleFill
                              onClick={() => addComment()}
                              className="m-3 "
                              style={{ fontSize: "30px" }}
                            ></BsFillArrowRightCircleFill>
                          ) : null}
                        </div>
                      </Modal>
                    </>
                  </Card>
                );
              })}
            </Container>
          ) : (
            <h1 className="spinner" style={{ color: "gray" }}>
              {" "}
              No Posts
            </h1>
          )}
        </>
      )}
    </div>
  );
};

export default Posts;
