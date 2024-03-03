import { Link, useParams } from "react-router-dom"
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import Rating from "../components/Rating";
import { useEffect, useState } from "react";
import request from "../utils/request";
import { useGetOneProductQuery } from "../redux/slices/productsApiSlice";


const ProductScreen = () => {
  const {productId} = useParams();
  const {data : product , isLoading , error} = useGetOneProductQuery(productId);

  return (
    <>
          <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      
    {isLoading ? (
      <h2>Loading...</h2>
    ) : error ? (
      <div>{error?.data?.message || error?.message}</div>
    ) : (

      <>

      <Row>
        <Col md={5}>
    <Image src={product?.image} fluid alt={product?.name}/>
        </Col>

        <Col md={4}>
          <ListGroup variant="flush">
<ListGroup.Item>
  <h3>{product?.name}</h3>
</ListGroup.Item>
<ListGroup.Item>
<Rating value={product.rating} text={`${product.numReviews}Reviews`}/>
</ListGroup.Item>

<ListGroup.Item>
 price : ${product?.price} 
</ListGroup.Item>

<ListGroup.Item>
description : {product?.description} 
</ListGroup.Item>

          </ListGroup>
        </Col>

        <Col md={3}>
<Card>
  <ListGroup >
    <ListGroup.Item>
      <Row>
        <Col>
          price : 
        </Col>
        <Col>
          <strong>{product.price}</strong>
        </Col>
      </Row>
    </ListGroup.Item>
    <ListGroup.Item>
      <Row>
        <Col>
          status : 
        </Col>
        <Col>
          <strong>{product.countInStock > 0 ?"in Stock" : "out of stock"}</strong>
        </Col>
      </Row>
    </ListGroup.Item>
    <ListGroup.Item>
      <Button className="btn-block" 
      disabled={product.countInStock <= 0}
      type="button">
        Add to cart
      </Button>
    </ListGroup.Item>
  </ListGroup>
</Card>
        </Col>
      </Row>
      </>
    )}

    </>
  )
}

export default ProductScreen