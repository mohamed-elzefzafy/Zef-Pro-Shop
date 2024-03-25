import { useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, Image, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation, useUpdateProfileMutation } from "../redux/slices/usersApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../Loader";
import { useGetMyOrdersQuery } from "../redux/slices/ordersApiSlice";
import Message from './../Message';
import { FaTimes } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";



const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState();

  const dispatch = useDispatch();
// const navigate = useNavigate();
  const {userInfo} = useSelector(state => state.auth);

  useEffect(()=>{
    if (userInfo) {
      setName(userInfo?.name);
      setEmail(userInfo?.email);
    }

  },[ userInfo , userInfo.name , userInfo.email])

  const [ updateProfile , {isLoading : loadingUpdateProfile}] = useUpdateProfileMutation();
  const {data : orders , isLoading , ordersError} = useGetMyOrdersQuery();

  // useEffect(()=>{
  //   (async()=>{
  //   const res = await getmy
  //   })()
  // },[])

  const submitHandler = async(e) => {
e.preventDefault();
if (password !== confirmPassword) {
  return toast.warning("password don't match");
}

const fd = new FormData();
fd.append("name" , name);
fd.append("email" , email);
fd.append("password" , password);
fd.append("profilePhoto" , profilePhoto);
try {
  const res = await updateProfile(fd).unwrap();
dispatch(setCredentials(res));
toast.success("profile updated successfully");
} catch (error) {
  toast.error(error?.data?.message || error.error)
}
  }

  return (
    <Row>
<Col md={3}>
<h2>{userInfo?.isAdmin ? "Admin" : "User"} Profile</h2>
<Form onSubmit={submitHandler}>
<FormGroup controlId="name" className="my-2">
  <Form.Label>Name</Form.Label>
  <Form.Control
  type="text"
  placeholder="Enter name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
</FormGroup>

<FormGroup controlId="email" className="my-2">
  <Form.Label>Email Address</Form.Label>
  <Form.Control
  type="email"
  placeholder="Enter email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  />
</FormGroup>

<FormGroup controlId="password" className="my-2">
  <Form.Label>Password</Form.Label>
  <Form.Control
  type="password"
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  />
</FormGroup>

<FormGroup controlId="confirmPassword" className="my-2">
  <Form.Label>confirm Password</Form.Label>
  <Form.Control
  type="password"
  placeholder="confirm password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  />
</FormGroup>

<Image src={profilePhoto ? URL.createObjectURL(profilePhoto)  :  userInfo?.profilePhoto?.url} fluid width="100px" height="100px"/>
<FormGroup controlId="profilePhoto" className="my-2">
  <Form.Label>profilePhoto</Form.Label>
  <Form.Control
  type="file"
  placeholder="confirm password"
  onChange={(e) => setProfilePhoto(e.target.files[0])}
  />
</FormGroup>

<Button type="submit" className="my-2" variant="primary">Update</Button>
{loadingUpdateProfile && <Loader/>}
</Form>
</Col>

<Col md={9}>
<h2>My Orders</h2>
{isLoading ? (<Loader/>) :  ordersError ? (
<Message variant="danger">{ordersError.data.message || ordersError.message}</Message>
) : (
  <>
  {orders?.length > 0 ? (
    <Table striped hover responsive className="table-sm">
<thead>
<tr>
<th>ID</th>
  <th>DATE</th>
  <th>TOTAL</th>
  <th>PAID</th>
  <th>DELIVERD</th>
  <th></th>
</tr>
</thead>

<tbody>
{orders.map(order => 
  <tr>
<th>{order?._id}</th>
  <th>{order?.createdAt.substring(0 , 10)}</th>
  <th>{order?.totalPrice}</th>
  <th>{order?.isPaid ? order?.paidAt.substring(0 , 10) : <FaTimes color="red"/>}</th>
  <th>{order?.isDeliverd ? order?.deliverdAt.substring(0 , 10) : <FaTimes color="red"/>}</th>
  <th>
    <LinkContainer to={`/order/${order?._id}`}>
      <Button className="btn-sm">Details</Button>
    </LinkContainer>
  </th>
</tr>
)}
</tbody>
</Table>
  ) :(<h1>There's No Orders</h1>)}
  </>

  )}
</Col>

    </Row>
  )
}

export default ProfileScreen