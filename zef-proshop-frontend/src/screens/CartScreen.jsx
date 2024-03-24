import { Col, Image, ListGroup, Row , Form, Button, Card } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import {  Link, useNavigate } from 'react-router-dom';
import Message from '../Message';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';

const CartScreen = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const {cartItems} = useSelector(state => state.cart);

const addToCartHandler = async(product , qty) => {
await dispatch(addToCart({...product , qty}))
}

const handleDeleteFromCart =(id) => {
dispatch(removeFromCart(id))
}

const checkOutHandler = () => {
  navigate(`/login?redirect=/shipping`);
}
  return (
  <Row>
    <Col md={8}>
<h1 className='mb-3'>Shopping Cart</h1>
{cartItems.length === 0 ? (
  <Message>
    Your Cart Is empty  <Link to="/"> Go Back</Link>
  </Message>
) : (
<ListGroup variant='flush'>
{cartItems?.map(item => 
<ListGroup.Item key={item._id}>
<Row>
  <Col md={2}>
<Image src={item.image} fluid/>
  </Col>
  <Col md={3}>
<Link to={`/product/${item._id}`}>{item.name}</Link>
  </Col>
  <Col md={2}>
    ${item.price}
  </Col>
  <Col md={2}>
  <Form.Control 
as="select"
value={item.qty}
onChange={(e) => addToCartHandler(item  , Number(e.target.value))}
>
{[...Array(item.countInStock).keys()].map(qty => 
<option key={qty + 1} value={qty + 1}>{qty + 1}</option>
)}
</Form.Control>
  </Col>
  <Col md={2}>
  <Button type='button' variant='light' onClick={() => handleDeleteFromCart(item._id)}>
  <FaTrash className='text-danger' />
  </Button>
  </Col>
</Row>
</ListGroup.Item>
)}
</ListGroup>

)}
    </Col>
    <Col md={4}>
<Card>
  <ListGroup>
    <ListGroup.Item>
    <h2>  SubTotal ({cartItems.length}) Items</h2>
    {cartItems.reduce((acc , item) =>  acc + item.price * item.qty , 0).toFixed(2)}
    </ListGroup.Item>
    <ListGroup.Item>
      <Button  type='button' className='btn-block' disabled={cartItems.length < 1}
      onClick={checkOutHandler}>Proceed to checkOut</Button>
    </ListGroup.Item>
  </ListGroup>
</Card>
    </Col>
  </Row>
  )
}

export default CartScreen