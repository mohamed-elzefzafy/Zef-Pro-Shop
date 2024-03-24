import { Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import Rating from "./Rating"


const Product = ({product}) => {
  return (
    <Card className="p-4 mb-3">
      <Link to={`/products/${product._id}`}>
        <Card.Img src={product?.images[0]?.url} variant="top" width="200px" height="200px" style={{objectFit : "contain"}}/>
      </Link>
      <Card.Body>
      <Link to={`/products/${product._id}`}>
      <Card.Title as="div" className="product-title">
      <strong>{product.name}</strong>
      </Card.Title>
      </Link>

<Card.Text as="div"  className="mt-3">
<Rating value={product.rating} text={`${product.numReviews}Reviews`}/>
</Card.Text>
      <Card.Text as="h3" className="mt-3">
         ${product.price}
      </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product