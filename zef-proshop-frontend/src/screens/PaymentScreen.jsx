import { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Col, Form } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../redux/slices/cartSlice";

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("paypal");

  const {shippingAddress} = useSelector(state => state.cart);

  useEffect(()=>{
    if(shippingAddress.address === "" || shippingAddress.city === "" 
    || shippingAddress.country === "" || shippingAddress.address === null 
    ||  shippingAddress.address === undefined) {
      navigate("/shipping")
    }
  },[shippingAddress , navigate])

  const submitHandler = (e) => {
e.preventDefault();
dispatch(savePaymentMethod(paymentMethod));
navigate("/placeorder")
  };
  return (
    <FormContainer>
    <CheckoutSteps step1 step2 step3/>
    <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
 <Form.Group>
  <Form.Label as="legend">Select Method</Form.Label>
  <Col>
    <Form.Check
      type="radio"
      className="my-2"
      label="Paypal or Credit method"
      id="paypal"
      name="payment method"
       value="paypal"
       checked
       onChange={(e) => setPaymentMethod(e.target.value)}
    />
  </Col>
 </Form.Group>
 <Button variant="primary" type="submit">Continue</Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen;