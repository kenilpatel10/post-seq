import { React, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import Swal from "sweetalert2";
function Login() {
  const history = useNavigate();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const { setAuth } = useContext(AuthContext);

  useEffect(() => {
    if (localStorage.getItem("accessToken") !== null) {
      history("/home");
    }
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
    const { email, password, username } = form;
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const newErrors = {};

    if (!email || email === "") {
      newErrors.email = "Please Enter Email";
    }
    if (email && regex.test(form.email) === false) {
      newErrors.email = "Invalid Email Address";
    }

    if (!password || password === "") {
      newErrors.password = "Please Enter Password";
    }
    return newErrors;
  };
  const onsubmit = (e) => {
    e.preventDefault();
    const fromErrors = validateForm();
    if (Object.keys(fromErrors).length > 0) {
      setErrors(fromErrors);
    } else {
      axios
        .post("http://localhost:3001/auth/login", form)
        .then((res) => {
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("userId", res.data.userid);
          localStorage.setItem("userName", res.data.username);
          setForm("");
          setAuth(true);
          Swal.fire({
            icon: "success",
            title: "LogIn successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          history("/home");
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: err.response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    }
  };
  return (
    <div>
      <Container className=" d-flex justify-content-center ">
        <div className="div1">
          <h3 className="text-center">Login</h3>
          <Form onSubmit={onsubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                isInvalid={errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                isInvalid={errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Login;
