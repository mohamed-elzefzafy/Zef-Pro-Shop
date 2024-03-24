import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../redux/slices/productsApiSlice";
import Loader from "../Loader";
import {  useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";



const HomeScreen = () => {
const {keyWord ,pageNumber} = useParams();
  const {data  , isLoading , error} = useGetProductsQuery({keyWord ,pageNumber});
  
 
  return (
  <>
  {isLoading ? (
    <Loader/>
  ) : error ? (
    <div>{error?.data?.message || error?.message}</div>
  ) : (
    <>
  {!keyWord &&   <ProductCarousel/>}
    <h1>Latest Products</h1>
    <Row>
    {data?.products?.map(product => 
      <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
    <Product product={product}/>
      </Col>
    )}
    </Row>
    <Paginate pages={data?.pages} page={data?.page} keyWord={keyWord}/>
    </>
  )}

  </>
  )
}

export default HomeScreen;