import { Button, Col, Image, Row, Table } from "react-bootstrap";
import { useAdminGetProductsQuery, useDeleteProductMutation, useGetProductsQuery } from "../../redux/slices/productsApiSlice"
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Loader from "../../Loader";
import Message from "../../Message";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";


const ProductsListScreen = () => {
const navigate = useNavigate();
  const {data : products , isLoading , refetch ,error} = useAdminGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  


const deleteHandler = async (id) => {
  try {
    swal({
      title: "Are you sure you want delete this product?",
      // text: "if you delete this products",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async(willDelete) => {
      if (willDelete) {
      const res =  await deleteProduct(id).unwrap();
       refetch();
      if (res.data === "product deleted successfully") {
       toast.success("Product deleted successfully");
        }}
    });
    
  } catch (error) {
    toast.error(error?.data?.message || error?.message)
  }
}




  // const deleteHandler = async(id) => {
  //   window.confirm("Are you sure you want to delete");
  // const res = await deleteProduct(id);
  // refetch();
  // if (res.data === "product deleted successfully") {
  //   toast.success("Product deleted successfully");
  // }
  // }
  return (
  <>
    <Row>
      <Col>
        <h1>Products</h1>
      </Col>

      <Col className="text-end">
          <Button onClick={() => navigate('/admin/createproduct')}> <FaPlus/> Create Product</Button>
      </Col>
    </Row>
    {isLoading ? <Loader/> : error ? <Message variant="danger">{error.message}</Message> :
    (
      <>
        <Table striped bordered hover responsive className="table-sm">
 <thead>
<tr>
<th>syrial</th>
{/* <th>ID</th> */}
  <th>NAME</th>
  <th>PRICE</th>
  <th>CATEGORY</th>
  {/* <th>BRAND</th> */}
  <th></th>
</tr>
 </thead>
 <tbody>
{products?.map((product , index) => 
  <tr key={product?._id}>
  <td>{index + 1}</td>
  {/* <td>{product?._id}</td> */}
  <td>{product?.name}  <Image className="ms-2" src={product?.images[0]?.url} fluid width="40px" height="40px"/> </td>
  <td>{product?.price}</td>
  <td>{product?.category?.name}</td>    {/* TODO category.name  */}
  {/* <td>{product?.brand}</td> */}
  <td>
<LinkContainer to={`/admin/product/${product._id}/edit`}>
  <Button className="mx-2 btn-sm mb-1"> <FaEdit/> </Button>
</LinkContainer>

  <Button variant="danger" className="mx-2 btn-sm mb-1" onClick={() => deleteHandler(product?._id)}> <FaTrash /> </Button>


  </td>
</tr>
)}
 </tbody>
        </Table>
      </>
    )
     }
  </>
  )
}

export default ProductsListScreen