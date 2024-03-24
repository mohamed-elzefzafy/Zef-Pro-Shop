import { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Col, Form, FormGroup, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../redux/slices/usersApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../Loader";


const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [login , {isLoading}] = useLoginMutation();
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
  
 try {
  const res = await login({email , password}).unwrap();
  dispatch(setCredentials({...res}));
  navigate(redirect);

 } catch (error) {
  toast.error(error?.data?.message || error.error)
 }
  }
  return (
    <FormContainer>
    <h1>Login</h1>
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            className="my-3"
            placeholder="Enter Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

        </FormGroup>
        <FormGroup>
          <Form.Label>Password</Form.Label>
          <Form.Control
            className=""
            placeholder="Enter Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <Button className="mt-2" type="submit" variant="primary" disabled={isLoading}>Login</Button>
        {isLoading &&  <Loader/>}
      </Form>
      <Row className="py-3">
        <Col>
          new customer <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen;