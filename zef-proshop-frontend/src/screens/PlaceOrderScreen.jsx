import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"
import CheckoutSteps from "../components/CheckoutSteps";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import Message from "../Message";
import { useCreateOrderMutation } from "../redux/slices/ordersApiSlice";
import Loader from './../Loader';
import { clearCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";


const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);


  const [createOrder , {isLoading , error}] = useCreateOrderMutation();

  useEffect(()=>{
    if(cart.shippingAddress.address === "" || cart.shippingAddress.address  === null || cart.shippingAddress.address === undefined) {
      navigate("/shipping")
    } else if (cart.paymentMethod === "" || cart.paymentMethod === null || cart.paymentMethod === undefined) {
      navigate("/payment")
    }
  },[cart.shippingAddress.address , cart.paymentMethod ,  navigate])


  const placeOrderHandler = async() => {
try {
  const res = await createOrder({
    orderItems : cart.cartItems,
    shippingAddress : cart.shippingAddress,
    paymentMethod : cart.paymentMethod,
    itemsPrice : cart.itemsPrice,
    taxPrice : cart.taxPrice, 
    shippingPrice : cart.shippingPrice,
    totalPrice : cart.totalPrice
  }).unwrap();
  dispatch(clearCart());
  navigate(`/order/${res._id}`)
} catch (error) {
  toast.error(error.message)
}
  }

  return (
<>
<CheckoutSteps step1 step2 step3 step4/>
<Row>
  <Col md={8}>
<ListGroup variant="flush">
  <ListGroup.Item>
    <h2>Shipping</h2>
    <p>
      <strong>Address : </strong>
      {cart.shippingAddress.address} , {cart.shippingAddress.city} {" "}
       {cart.shippingAddress.postalCode} , {cart.shippingAddress.country}
    </p>

  </ListGroup.Item>
  <ListGroup.Item>
    <h2>Payment Method</h2>
    <p>
      <strong>Method : </strong> {cart.paymentMethod}
    </p>
  </ListGroup.Item>
  <ListGroup.Item>
    <h2>Order Items</h2>
    {cart?.cart?.cartItems?.length === 0 ? (
      <Message>Your Cart is Empty</Message>
    ) : (
      <ListGroup variant="flush">
        {cart.cartItems.map(item => 
        <ListGroup.Item>
      <Row>
        <Col md={1}>
 <Image fluid rounded src={item.image} />
        </Col>
        <Col md={7}>
    <Link to={`/products/${item._id}`}>
{item.name}
    </Link>
        </Col>

        <Col md={4}>
          {item.qty} * {item.price} = ${item.qty * item.price}
        </Col>
      </Row>
        </ListGroup.Item>
        )}
      </ListGroup>
    )}
  </ListGroup.Item>
</ListGroup>
  </Col>

  <Col md={4}>
<Card>
<ListGroup >
  <ListGroup.Item>
  <h2>Order Summary</h2>
  </ListGroup.Item>
  <ListGroup.Item>
  <Row>
    <Col>
      items : 
    </Col>
    <Col>
$ {cart?.itemsPrice}
    </Col>
  </Row>
  </ListGroup.Item>

  <ListGroup.Item>
  <Row>
    <Col>
      Shipping : 
    </Col>
    <Col>
$ {cart?.shippingPrice}
    </Col>
  </Row>
  </ListGroup.Item>

  <ListGroup.Item>
  <Row>
    <Col>
      Tax : 
    </Col>
    <Col>
$ {cart?.taxPrice}
    </Col>
  </Row>
  </ListGroup.Item>

  <ListGroup.Item>
  <Row>
    <Col>
      Total : 
    </Col>
    <Col>
$ {cart?.totalPrice}
    </Col>
  </Row>
  </ListGroup.Item>


  {error &&
    <ListGroup.Item>
   <Message>{error}</Message>
   </ListGroup.Item>
   }


  <ListGroup.Item>
    <Button type="button" className="btn-block"
     onClick={placeOrderHandler} disabled={cart?.cartItems?.length  <= 0  }>Place Order</Button>
     {isLoading && <Loader/>}
  </ListGroup.Item>
</ListGroup>
</Card>
</Col>
</Row>
</>
  )
}

export default PlaceOrderScreen