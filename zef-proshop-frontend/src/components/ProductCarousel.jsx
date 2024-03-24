import React from 'react'
import { useGetTopProductsQuery } from '../redux/slices/productsApiSlice'
import Loader from '../Loader';
import Message from './../Message';
import { Carousel, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCarousel = () => {
  const {data : products , isLoading , error} = useGetTopProductsQuery();
  return isLoading ? <Loader/> : error ? <Message variant="danger">{error}</Message> : 

  (
    <Carousel pause="hover" className='bg-primary mb-4' style={{height : 300}} variant="dark">
      {products?.map(product => 
      <Carousel.Item>
        <Link to={`/products/${product?._id}`}>
        <Image src={product.images[0].url}  alt={product?.name} style={{maxHeight : 300 , objectFit : "contain"}}/>
           <Carousel.Caption className='carousel-caption'>
         <h2>{product?.name} {" "} ${product?.price}</h2>
           </Carousel.Caption>
        </Link>
      </Carousel.Item>
      )}
    </Carousel>
  )
}

export default ProductCarousel