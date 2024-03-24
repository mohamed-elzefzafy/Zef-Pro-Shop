import { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Col, Form, FormGroup, Image, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, useRegisterMutation } from "../redux/slices/usersApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../Loader";


const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [register , {isLoading}] = useRegisterMutation();
  const {userInfo} = useSelector(state => state.auth);

  const {search} = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || "/";

  useEffect(()=> {
    if (userInfo) {
      navigate(redirect);
    }
  },[userInfo , redirect , navigate])


  const submitHandler =async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return
    }
  
    const fd = new FormData();
    fd.append("name" , name );
    fd.append("email" , email );
    fd.append("password" , password );
    fd.append("profilePhoto" , profilePhoto );
 try {
  const res = await register(fd).unwrap();
  dispatch(setCredentials({...res}));
  navigate(redirect);

 } catch (error) {
  toast.error(error?.data?.message || error.error)
 }
  }
  return (
    <FormContainer>
    <h1 className="mb-3">Register</h1>
      <Form onSubmit={submitHandler}>
      <FormGroup controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            className="my-3"
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

        </FormGroup>

        <FormGroup controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            className="my-3"
            placeholder="Enter Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

        </FormGroup>
        <FormGroup controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            className=""
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>

        <FormGroup controlId="confirmpassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            className=""
            placeholder="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormGroup>
      {profilePhoto && 
        <Image src={profilePhoto &&  URL.createObjectURL(profilePhoto)} width="150px" height="50px" fluid/>
      }
    

        <FormGroup controlId="confirmpassword">
          <Form.Label>profile photo</Form.Label>
          <Form.Control
            className=""
            // placeholder="Confirm password"
            type="file"
            // value={profilePhoto}
            onChange={(e) => setProfilePhoto(e.target.files[0])}
          />
        </FormGroup>

        <Button className="mt-3" type="submit" variant="primary" disabled={isLoading}>Register</Button>
        {isLoading &&  <Loader/>}
      </Form>
      <Row className="py-3">
        <Col>
          have account ?  <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>login</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen