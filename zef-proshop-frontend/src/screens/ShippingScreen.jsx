import { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../redux/slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";


const ShippingScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {shippingAddress} = useSelector(state => state.cart);

  const [address, setAddress] = useState( shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");



  const submitHandler = (e) => {
    e.preventDefault();
 dispatch(saveShippingAddress({address , city, postalCode, country}));
 navigate("/payment")
  }
  return (
    <FormContainer>
    <CheckoutSteps step1 step2/>
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="Address" className="my-2">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        </Form.Group>


        <Form.Group controlId="city" className="my-2">
        <Form.Label>City</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        </Form.Group>

        <Form.Group controlId="postalcode" className="my-2">
        <Form.Label>Postal Code</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter postal code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
        </Form.Group>
        
        <Form.Group controlId="country" className="my-2">
        <Form.Label>Country</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter postal code"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        </Form.Group>
<Button variant="primary" type="submit" className="mt-2">Continue</Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen;