import { Link, useNavigate, useParams } from "react-router-dom"
import { Alert, Button, Card, Col, Form, Image, ListGroup, Modal, Row } from "react-bootstrap";
import Rating from "../components/Rating";
import { Fragment, useEffect, useState } from "react";
import request from "../utils/request";
import { useCreateProductMutation, useGetOneProductQuery } from "../redux/slices/productsApiSlice";
import Loader from "../Loader";
import Message from "../Message";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { useCreateReviewMutation, useDeleteReviewByAdminMutation, useDeleteReviewMutation, useUpdateReviewMutation } from "../redux/slices/reviewsApiSlice";
import { toast } from "react-toastify";
import MetaComponent from "../components/MetaComponent";


const ProductScreen = () => {
  const {productId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const [modalShow, setModalShow] = useState(false);
  const [updatedReviewComment, setUpdatedReviewComment] = useState("");
  const [updatedReviewRating, setUpdatedReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviedMsg, setReviedMsg] = useState(false);

  const {userInfo} = useSelector(state => state.auth);
  const {data : product , isLoading , refetch , error} = useGetOneProductQuery(productId);
  const [createReview] = useCreateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReviewByAdmin] = useDeleteReviewByAdminMutation();


  const addToCartHandler = () => {
dispatch(addToCart({...product , qty}))
navigate("/cart");
  }

  
const handleClose = () => {
  setModalShow(false);
}

const handleShowModal = () => {
  setModalShow(true);
}

const deleteReviewByAdminHandler = async(reviewQuery) => {
try {
  await deleteReviewByAdmin({productId  , reviewQuery}).unwrap();
  refetch();
} catch (error) {
  
}
}
const deleteReviewHandler = async (reviewQuery) => {
try {
  await deleteReview({productId  , reviewQuery}).unwrap();
  refetch();
} catch (error) {
  
}
}

const updateReviewHandler = async(reviewQuery) => {
try {
  await updateReview({
    comment : updatedReviewComment,
    rating : updatedReviewRating,
    productId,
    reviewQuery 
  })
  refetch();
  handleClose();
} catch (error) {
  
}
}


const writReviewHandler = async() => {
  try {
    if (reviewComment === "") {
      return toast.warning("review comment is required");
    }
    if (reviewRating ===  0) {
      return toast.warning("review rating is required");
    }
  const res =  await createReview( {
      comment : reviewComment,
      rating : reviewRating,
      productId
    }).unwrap();
    refetch();
    toast.success(res?.message);
    setReviewComment("");
    setReviewRating(0);
  } catch (error) {
    
  }
};

  return (
    <>
          <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
    {isLoading ? (
    <Loader/>
    ) : error ? (
      <Message variant="danger">{error?.data?.message || error?.message}</Message>
    ) : (

      <>
      <MetaComponent title={product?.name} description={product?.description}/>
      <Row>
        <Col md={5}>
    <Image src={product?.images[0]?.url} fluid alt={product?.name}/>
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
    {product.countInStock > 0 &&
    <ListGroup.Item>
      <Row>
        <Col>
          qty : 
        </Col>

        <Col>
        <Form.Control 
as="select"
value={qty}
onChange={(e) => setQty(Number(e.target.value))}
>
{[...Array(product.countInStock).keys()].map(qty => 
<option key={qty + 1} value={qty + 1}>{qty + 1}</option>
)}
</Form.Control>
        </Col>
      </Row>
    </ListGroup.Item>
    }
    <ListGroup.Item>
      <Button className="btn-block" 
      disabled={product.countInStock <= 0}
      type="button"
      onClick={addToCartHandler}>
        Add to cart
      </Button>
    </ListGroup.Item>
  </ListGroup>
</Card>
        </Col>
      </Row>
      </>
    )}



{/* start review  */}
<Row>
              <Col className="mt-5">
                <h5>reviews</h5>
                <ListGroup variant="flush">
                { product?.reviews?.map((review , index) => 
<Fragment key={review?._id}>
<ListGroup.Item >
                <h4>{review?.user?.name} {" "} {review?.user?.lastName}</h4>
                <Image width="40px" height="40px" roundedCircle  src={review?.user?.profilePhoto} className="me-2"/>
                {/* <br /> */}
                {/* <Rating readonly size={20} initialValue={review?.rating}/> */}
                <Rating value={review?.rating}/>
                <br />
                <b className="text-danger">{(review?.createdAt)?.substring(0 , 10)} <br /></b>
            <p className="fs-5">{review?.comment}</p>
        {userInfo?.name && userInfo?._id === review?.user?.userId ? (
          <div className="mt-3 fs-4">
        <i className="bi bi-pencil-square text-primary me-3" style={{cursor : "pointer"}} 
        onClick={handleShowModal}></i> 
             <i className="bi bi-trash text-danger" onClick={() => deleteReviewHandler(review?._id)}  style={{cursor : "pointer"}}> </i>
          </div>
        ) : ""}
        {userInfo?.name && userInfo?.isAdmin &&
          <div className=" fs-4 mt-2"> <i className="bi bi-trash-fill text-danger" onClick={() => deleteReviewByAdminHandler(review?._id)}  style={{cursor : "pointer"}}> </i></div>
        
        }
                </ListGroup.Item>

                {/* model start  */}
<Modal show={modalShow} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title> <div className="font fs-5">Update Review </div> </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
        
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label >Write a reviewa</Form.Label>
          <Form.Control defaultValue={review?.comment} onChange={(e) => setUpdatedReviewComment(e.target.value)}/>
        </Form.Group>
  
        <Form.Select defaultValue={review?.rating} aria-label="Default select example" onChange={(e) => setUpdatedReviewRating(e.target.value)}>
        <option value="0">Your Rating</option>
        <option value="5">5 (Very Good)</option>
        <option value="4">4 (Good)</option>
        <option value="3">3 (Average)</option>
        <option value="2">2 (Bad)</option>
        <option value="1">1 (Awful)</option>
      
      </Form.Select>
      </Form>
      
         </Modal.Body>
         <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={() => updateReviewHandler(review?._id)}>Save changes</Button>
        </Modal.Footer>
      </Modal>


{/* model end  */}
                
</Fragment>
                )}
         </ListGroup>
                
              </Col>
            </Row>
            <hr />
          
          {!userInfo?.name &&
            <Alert variant="danger">Login first to send review</Alert>
          }
    
      {userInfo.name &&
    
        <Form>
        <h5>  Review Form</h5>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label >Write a reviewe</Form.Label>
          <Form.Control value={reviewComment} as="textarea" rows={3} onChange={(e) => setReviewComment(e.target.value)}/>
        </Form.Group>
  
        <Form.Select value={reviewRating} aria-label="Default select example" onChange={(e) => setReviewRating(e.target.value)}>
        <option>Your Rating</option>
        <option value="5">5 (Very Good)</option>
        <option value="4">4 (Good)</option>
        <option value="3">3 (Average)</option>
        <option value="2">2 (Bad)</option>
        <option value="1">1 (Awful)</option>
      
      </Form.Select>
      <Alert show={reviedMsg} variant="danger">your reviewd this product before</Alert>
  
      <Button variant="primary" className="mt-3 mb-3" onClick={writReviewHandler}>Submit</Button>
      </Form>
      }
        
{/* end review  */}



    </>
  )
}

export default ProductScreen