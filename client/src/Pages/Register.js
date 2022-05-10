import {React,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap'
import axios from 'axios';
import Swal from 'sweetalert2';
function Register() {
    const history = useNavigate();
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})

  const setField =(field, value)=>{
    setForm({
      ...form,
      [field]: value
    })
    if(!!errors[field])
    setErrors({
      ...errors,
      [field]: null
    })
  }
  const validateForm=()=>{

const{email, password, username}= form;
const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const newErrors = {};

if (!email || email === "") {
  newErrors.email = "Please Enter Email";
}
if( email && regex.test(form.email) === false){
  newErrors.email ="Invalid Email Address"
}

if(!username || username === ''){
  newErrors.username = 'Please Enter Username'
}

if(!password || password === ''){
  newErrors.password = 'Please Enter Password'
}
return newErrors;
  }
   const onsubmit=(e)=>{
    e.preventDefault();
    const fromErrors= validateForm()

    if(Object.keys(fromErrors).length > 0){
      setErrors(fromErrors)
      console.log(errors)
    }else{
      axios.post('http://localhost:3001/auth/register',form).then((res)=>{
        console.log(res);
        setForm('')
        history('/')
        Swal.fire({
          icon: 'success',
          title: 'Register successfully',
          showConfirmButton: false,
          timer: 1500
        })
    }).catch((err)=>{
        Swal.fire({
          icon: 'error',
          title: err.response.data.message,
          showConfirmButton: false,
          timer: 1500
        })
        console.log("err",err.response.data.message)
      })
    }
   }
  return (
      <Container className=' d-flex justify-content-center'>
 <div className='div1'><Form onSubmit={onsubmit}>
    <Form.Group className="mb-3" controlId="username">
      <Form.Label>UserName</Form.Label>
      <Form.Control type="text" placeholder="Enter name" value={form.username} onChange={e => setField ('username',e.target.value)} isInvalid={errors.username}/>
      <Form.Control.Feedback type="invalid"> {errors.username}</Form.Control.Feedback>
    </Form.Group>
    <Form.Group className="mb-3" controlId="email">
      <Form.Label>Email address</Form.Label>
      <Form.Control type="text" placeholder="Enter email" value={form.email} onChange={e => setField ('email',e.target.value)} isInvalid={errors.email}/>
      <Form.Control.Feedback type="invalid"> {errors.email}</Form.Control.Feedback>
    </Form.Group>
    <Form.Group className="mb-3" controlId="password">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Password" value={form.password} onChange={e => setField ('password',e.target.value)} isInvalid={errors.password} />
      <Form.Control.Feedback type="invalid"> {errors.password}</Form.Control.Feedback>
    </Form.Group>
   
    <Button variant="primary" type="submit">
      Submit
    </Button>
  </Form></div>
      </Container>
   
  )
}

export default Register