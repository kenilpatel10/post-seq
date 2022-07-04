import { React, useState, useEffect } from "react";
import { Container, Form, Button, FormControl, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
function UpdatePost() {
  const history = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    username: "",
    postText: "",
    image: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((res) => {
      setForm({
        title: res.data.title,
        username: res.data.username,
        postText: res.data.postText,
        image: res.data.image,
      });

      setSelectedImage(res.data.image);
    });
  }, []);

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };
  const validateForm = () => {
    const { title, postText, image } = form;
    const newErrors = {};

    if (!title || title === "") {
      newErrors.title = "Please Enter Title";
    }
    if (!postText || postText === "") {
      newErrors.postText = "Please Enter Description";
    }
    // if( image !== Image){
    //   newErrors.image = 'Please Upload Image'
    // }
    return newErrors;
  };
  const [selectedImage, setSelectedImage] = useState();
  const [Image, setImage] = useState();
  const imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setSelectedImage(reader.result);
        setImage(e.target.files[0]);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };
  const removeSelectedImage = () => {
    setSelectedImage();
  };
  const userName = localStorage.getItem("userName");

  const onsubmit = (e) => {
    e.preventDefault();

    const fromErrors = validateForm();
    if (Object.keys(fromErrors).length > 0) {
      setErrors(fromErrors);
    } else {
      const fd = new FormData();
      //   if(selectedImage){
      //     fd.append("image",Image)
      //   }
      fd.append("title", form.title);
      fd.append("postText", form.postText);
      fd.append("username", userName);
      axios
        .put(`http://localhost:3001/posts/update/${id}`, fd)
        .then((res) => {
          setForm("");
          history("/home");
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
  };
  return (
    <div>
      <Container className=" d-flex justify-content-center">
        <div>
          <Form
            onSubmit={onsubmit}
            className="div1"
            encType="multipart/form-data"
          >
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                isInvalid={errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {" "}
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="postText">
              <Form.Label>Post Description</Form.Label>
              <Form.Control
                name="postText"
                as="textarea"
                rows={3}
                placeholder="Description"
                value={form.postText}
                onChange={(e) => setField("postText", e.target.value)}
                isInvalid={errors.postText}
              />
              <Form.Control.Feedback type="invalid">
                {" "}
                {errors.postText}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default UpdatePost;
