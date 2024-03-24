import React, { useState } from 'react'
import {  Link, useNavigate } from 'react-router-dom';
import { useCreateProductMutation } from '../../redux/slices/productsApiSlice';
import FormContainer from '../../components/FormContainer';
import { Button, Form, Image } from 'react-bootstrap';
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery }
 from '../../redux/slices/categoryApiSlice';
import swal from 'sweetalert';
import { toast } from 'react-toastify';

const CreateProductScreen = () => {
  const navigate = useNavigate();
  const [CatCreate, setCatCreate] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState();



  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);


const {data : categories ,  refetch : refetchCategories } = useGetCategoriesQuery();

  const [deleteCategory ] = useDeleteCategoryMutation();

     const [createCategory] = useCreateCategoryMutation();

     const [createProduct ] = useCreateProductMutation();



const deleteCategoryHandler = async(id) => {
  if (category !== undefined ) {
    swal({
      title: "Are you sure?",
      text: "if you delete this category all products bleong will deleted",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async(willDelete) => {
      if (willDelete) {
        await deleteCategory(id);
        refetchCategories();
        }
      
    });
    
  }

}

const createNewCategory = async(e) => {
  e.preventDefault();
  if (newCategory === "" || !newCategoryImage) {
  return  toast.warning("category field is required")
  }
try {
  const fd = new FormData();
fd.append("name" , newCategory);
fd.append("image" , newCategoryImage);
const res = await createCategory(fd);
refetchCategories();
setCategory(res?.data?._id);
toast.success("category created successfully");
} catch (error) {
  toast.error(error?.data?.message || error.message)
}
}






const createNewProductHandler =async(e) => {
  e.preventDefault();
  try {
    const fd = new FormData();
    fd.append("name" ,name);
    fd.append("price" ,price);
    fd.append("description" ,description);
    fd.append("countInStock" ,countInStock);
    fd.append("category" ,category);

    for (let i = 0; i < images.length; i++) {
      fd.append("images", images[i]);
    }



  const res =  await createProduct(fd);
  if (res?.data?.message === "success") {
    navigate("/admin/products")
  }

  setName("");
  setPrice(0);
  setDescription("");
  setCountInStock(0);
  setCategory("");
  setNewCategory("");
  setImages([]);


  } catch (error) {
    toast.error(error?.data?.message || error.message)
  }
}


  return (
    <>
    <Link to="/admin/products" className="btn btn-light my-3">
     Go Back
    </Link>
    <FormContainer>
      <h1>Create Product</h1>
  
        <Form>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="Price" className="my-2">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="countInStock" className="my-2">
            <Form.Label>count In Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter countInStock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="description" className="my-2">
            <Form.Label>description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>




          <Form.Group className="mb-3" controlId="formBasicCategory">
        <Form.Label>Category {category && <>
        
        <i className="bi bi-x-lg fs-3 mx-2 fw-bold text-danger" 
         disabled={CatCreate}
          onClick={() => deleteCategoryHandler(category)}></i> (<small>remove selected</small>)</> } 
         </Form.Label>
    <Form.Select
    required
    name="category"
    aria-label="Default Select Example"
    onChange={(e) => setCategory(e.target.value)}
    disabled={CatCreate}
    >
      <option value="">Choose Category</option>
      {categories?.map(category => 
        <option value={category?._id}>{category?.name}</option>
      )}
    

    </Form.Select>
      </Form.Group>



      <Form.Group className="mb-3" controlId="formBasicNewCategory" >
            <Form.Label>
           create new category category name (remove any selected category above){" "}
            </Form.Label>
            <Form.Control name="newCategory" type="text" 
              onChange={(e) => setNewCategory(e.target.value)}
              value={newCategory}
              placeholder='category name'
              onKeyUp={(e) => e.target.value === "" ? setCatCreate(false) : setCatCreate(true)}
              disabled={category === "" ? false : true}
              
            />
          </Form.Group>

         {newCategoryImage && 
          <Image width="100px" height="100px" src={newCategoryImage && URL.createObjectURL(newCategoryImage)} fluid/>
          }

      {newCategory !== ""  && 
        <Form.Group className="mb-3 mt-3" controlId="formBasicMultiple">
        <Form.Label>Category Image</Form.Label>
        <Form.Control
          // required
          disabled={category === "" ? false : true}
          type="file"
          onChange={(e) => setNewCategoryImage(e.target.files[0])}
        />
      </Form.Group>
      }
      <Button 
      disabled={category === "" ? false : true}
      onClick={createNewCategory} variant="info" className='mb-2' type="submit">Create New Category</Button> 

          <Form.Group controlId="description" className="my-2">
            <Form.Label>Product Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => setImages(e.target.files)}
            />
          </Form.Group>


          

          <Button onClick={createNewProductHandler} type="submit" className="mt-2">Create Product</Button>

        </Form>
      
    </FormContainer>

  </>
  )
}

export default CreateProductScreen