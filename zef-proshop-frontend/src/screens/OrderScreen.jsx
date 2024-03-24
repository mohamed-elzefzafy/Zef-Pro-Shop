import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { useGetOneOrderQuery, useGetPayPalClientIdQuery, usePayOrderMutation, useUpdateOrderToDeliverMutation } from "../redux/slices/ordersApiSlice";
import Loader from "../Loader";
import Message from "../Message";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";


const OrderScreen = () => {
  const {id} = useParams();
  const {data : order , refetch , isLoading , error } = useGetOneOrderQuery(id)


  
  const [payOrder , {isLoading : payLoading}] = usePayOrderMutation();

  const [{isPending}  , paypalDispatch ] = usePayPalScriptReducer();
  const {data : paypal , isLoading : loadingPaypal , error : errorPaypal} = useGetPayPalClientIdQuery();
  const [updateOrderToDeliver , {isLoading : loadingUpdateDeliver , error : errorUpdateDeliver}] = useUpdateOrderToDeliverMutation();
  const {userInfo} = useSelector(state => state.auth);

  useEffect(() => {
    if (!errorPaypal && !loadingPaypal && paypal.clientId) {
  const loadPaypalScript = async () => {
    paypalDispatch({
      type : "resetOptions",
      value : {
      "client-id" : paypal.clientId,
      currency : "USD",
      }
    })
    paypalDispatch({type : "setLoadingStatus" , value : "pending"});
  }
  if (order && !order.isPaid) {
    if (!window.paypal) {
      loadPaypalScript();
    }
  }
    }
  },[order , paypal , paypalDispatch , loadingPaypal , errorPaypal])

  function onApprove(data , actions) {
  return  actions.order.capture().then(async function(details) {
      try {
        await payOrder({id  , details});
        refetch();
        toast.success("payment successful");
      } catch (error) {
        toast.error(error?.data?.message || error.message)
      }
    })
  };


  // function onApprove(data, actions) {
  //   return actions.order.capture().then(async function (details) {
  //     try {
  //       await payOrder({ id, details });
  //       refetch();
  //       toast.success('Order is paid');
  //     } catch (err) {
  //       toast.error(err?.data?.message || err.error);
  //     }
  //   });
  // }


  async function onApproveTest() {
    await payOrder({id  , details : {payer : {}}});
    refetch();
    toast.success("payment successful");
  };

  
  function onError(error) {
    toast.error(error.message);
  };

  function createOrder(data , actions) {
   return actions.order.create({
    purchase_units : [
      {
        amount : {
          value : order?.totalPrice
        }
      }
    ] 
   }).then(orderId => {return orderId})
  };

  const deliverOrderHandler = async() => {
    try {
      await updateOrderToDeliver(id).unwrap();
    refetch();
    toast.success("order delivered");
  } catch (error) {
    toast.error(error?.data?.message || error.message)
      
    }
  }

  return isLoading ? <Loader/> : error ? <Message variant="danger">{error.message}</Message> : 
  (
    <>
<h1>Order {order._id}</h1>
<Row>

  <Col md={8}>
<ListGroup variant="flush">
<ListGroup.Item>
  <h2>Shipping</h2>
  <p>
    <strong>Name : </strong> {order?.user?.name}
  </p>

  <p>
    <strong>Email : </strong> {order?.user?.email}
  </p>
  <p>
    <strong>Address : </strong> {order?.shippingAddress?.address} , {order?.shippingAddress?.city}
     , {order?.shippingAddress?.country}, {order?.shippingAddress?.postalCode}
  </p>

  {order.isDeliverd ?   <Message>Deliverd at :  {order?.deliverdAt.substring(0 , 10)}</Message>   : <Message variant="danger">Not Deliverd</Message>}
</ListGroup.Item>

<ListGroup.Item>
  <h2>Payment Method</h2>

  <p>
    <strong>Method : </strong> {order?.paymentMethod}
  </p>
  {order.isPaid ?   <Message>Paid at :  {order?.paidAt.substring(0 , 10)}</Message>   : <Message variant="danger">Not Paid</Message>}
</ListGroup.Item>
<ListGroup.Item>
  <h2>Order Items</h2>
  {order?.orderItems.map(order => 
  <ListGroup.Item>
  <Row>
        <Col md={1}>
 <Image fluid rounded src={order.image} />
        </Col>
        <Col md={7}>
    <Link to={`/products/${order._id}`}>
{order?.name}
    </Link>
        </Col>

        <Col md={4}>
          {order.qty} * {order.price} = ${order.qty * order.price}
        </Col>
      </Row>
  </ListGroup.Item>
  )}
</ListGroup.Item>
</ListGroup>
  </Col>

  <Col md={4}>
<Card>
  <ListGroup>
    <ListGroup.Item>
    <h2>Order Summary</h2>
    </ListGroup.Item>
    <ListGroup.Item>
    <Row>
      <Col>
        Items
      </Col>

      <Col>
${order?.itemsPrice}
      </Col>
    </Row>
    </ListGroup.Item>
  
    <ListGroup.Item>
    <Row>
      <Col>
        Shipping
      </Col>

      <Col>
${order?.shippingPrice}
      </Col>
    </Row></ListGroup.Item>
    <ListGroup.Item>    <Row>
      <Col>
        Tax
      </Col>

      <Col>
${order?.taxPrice}
      </Col>
    </Row>

  </ListGroup.Item>
    <ListGroup.Item>  <Row>
      <Col>
        Total
      </Col>

      <Col>
${order?.totalPrice}
      </Col>
    </Row>
    </ListGroup.Item>
{!order.isPaid && (
  <ListGroup.Item>
    {payLoading && <Loader/>}
    {isPending ? (
<Loader/>
    ) : (
<div>
  {/* <Button className="mb-3" onClick={onApproveTest}>Test Pay Order</Button> */}
  <div>
    <PayPalButtons
    createOrder={createOrder}
    onApprove={onApprove}
    onError={onError}
    ></PayPalButtons>
    
  </div>
</div>
    )}
  </ListGroup.Item>
)}
{loadingUpdateDeliver && <Loader/>}
{userInfo && userInfo.isAdmin && !order.isDeliverd && order.isPaid &&
(
  <ListGroup.Item>
<Button type="button" className="btn btn-block" onClick={deliverOrderHandler}>
Mark as Deliver
</Button>
</ListGroup.Item>
)
}
  </ListGroup>
</Card>
  </Col>

</Row> 
    </>
  )
}

export default OrderScreen


