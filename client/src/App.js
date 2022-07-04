import "./App.css";

// import Navbar from './NavBar';
import Posts from "./Pages/Posts";
import Swal from "sweetalert2"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreatePost from "./Pages/CreatePost";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { AuthContext } from "./AuthContext";
import { React, useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import {FaHouseUser } from 'react-icons/fa';
import UpdatePost from "./Pages/UpdatePost";
// import { useNavigate } from "react-router-dom";
function App() {
  const [auth, setAuth] = useState(false);
  const token = localStorage.getItem("accessToken");
// const history = useNavigate()
  useEffect(() => {
    if (token) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setAuth(false);
    Swal.fire({
    
      icon: 'success',
      title: 'You are logged out successfully',
      showConfirmButton: false,
      timer: 1500
    })
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ auth, setAuth }}>
        <Router>
          <div>
            <Navbar  fixed='top'
 bg="dark" variant="dark">
              <Container>
                <Navbar.Brand as ={Link} to="/home">
                  <BsFillMenuButtonWideFill /> Posts
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                  {auth === true ? (
                    <>
              <h5 className="mx-3 mt-3" style={{color:"white"}}><FaHouseUser className="mb-2 mx-2"/>{localStorage.getItem("userName")}</h5>
           

                      <Link
                        onClick={handleLogout}
                        className=" mx-2 "
                        style={{ textDecoration: "none" }}
                        to="/"
                      >
                        LogOut
                      </Link>
                   
                    </>
                  ) : (
                    <>
                      <Link
                        className=" mx-2"
                        style={{ textDecoration: "none" }}
                        to="/"
                      >
                        Login
                      </Link>
                      <Link
                        className=" mx-2"
                        style={{ textDecoration: "none" }}
                        to="/register"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </Navbar.Collapse>
                <Nav></Nav>
              </Container>
            </Navbar>
          </div>
          <Routes>
            <Route  path="/home" element={auth === true ? <Posts /> : <Login/>} />
            <Route path="/" exact element={auth === false ? <Login /> : <Posts/>} />
            <Route path="/register" element={auth === false ? <Register /> : <Posts/>} />
            <Route path="/createpost" element={auth === true ? <CreatePost /> : <Login/>} />
            <Route path="/updatepost/:id" element={auth === true ? <UpdatePost /> : <Login/>} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
