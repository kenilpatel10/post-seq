import {React, useState} from 'react'
import { Container, Form, Button, FormControl } from 'react-bootstrap'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function CreatePost() {
const history = useNavigate();
  const [form, setForm] = useState({
    title:'',
    username:"",
    postText: "",
    image:''  
  })
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

const{title, postText, username}= form;
const newErrors={}

if(!title || title=== ''){
  newErrors.title = 'Please Enter Title'
}

if(!username || username === ''){
  newErrors.username = 'Please Enter Username'
}

if(!postText || postText === ''){
  newErrors.postText = 'Please Enter Description'
}
return newErrors;
  }
  const [selectedImage, setSelectedImage] = useState();
  const [Image, setImage] = useState();
  const imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () =>{
      if(reader.readyState === 2){
        setSelectedImage(reader.result)
        setImage(e.target.files[0])
        console.log("target1",e.target.files[0])
      }
    }
 
    reader.readAsDataURL(e.target.files[0])
    console.log("target",e.target.files[0])
  };
  const removeSelectedImage = () => {
    setSelectedImage();
  };

   const onsubmit=(e)=>{
    e.preventDefault();
    console.log("first")
    const fromErrors= validateForm()
      const fd = new FormData;
      fd.append("title",form.title)
      fd.append("postText",form.postText)
      fd.append("image",Image)
      fd.append( "userId", localStorage.getItem("userId"))
      axios.post('http://localhost:3001/posts',fd).then((res)=>{
        console.log(res);
        setForm('')
        history('/home')
    }).catch(
      console.log("kaib")
    )
   }
  return (
    <div>
      <Container className=' d-flex justify-content-center'>
<div>
<Form onSubmit={onsubmit} className="div1" encType="multipart/form-data" >
  <Form.Group  className="mb-3" controlId="title">
    <Form.Label>Title</Form.Label>
    <Form.Control name='title' type="text" placeholder="Title" value={form.title} onChange={e => setField ('title',e.target.value)} isInvalid={errors.title}/>
  <Form.Control.Feedback type="invalid"> {errors.title}</Form.Control.Feedback>
  </Form.Group>
  {/* <Form.Group className="mb-3" controlId="username">
    <Form.Label>Username</Form.Label>
    <Form.Control name='username' type="text" placeholder="Username" value={form.username} onChange={e => setField ('username',e.target.value)} isInvalid={errors.username}/>
     <Form.Control.Feedback type="invalid"> {errors.username}</Form.Control.Feedback>
     </Form.Group> */}
  <Form.Group className="mb-3" controlId="postText">
    <Form.Label>Post Description</Form.Label>
    <Form.Control name='postText'as="textarea" rows={3} placeholder="Description" value={form.postText} onChange={e => setField ('postText',e.target.value)} isInvalid={errors.postText} />
     <Form.Control.Feedback type="invalid"> {errors.postText}</Form.Control.Feedback>
     </Form.Group>
     <Form.Group className="mb-3" controlId="postText">
    <Form.Label>Select Image</Form.Label>
    <Form.Control  accept="image/*"
          type="file"
          onChange={imageHandler} name='image'  isInvalid={errors.image} />
     <Form.Control.Feedback type="invalid"> {errors.image}</Form.Control.Feedback>
     </Form.Group>
     <div className='m-3'>
       <img style={{maxHeight:"100px", maxWidth: "200px"}} src={selectedImage} alt=''/>
       {selectedImage ? 
       <Button  onClick={removeSelectedImage}>X</Button>: null
       }
     </div> 
  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>
    </div>
      </Container>
      </div>
    
  )
}

export default CreatePost