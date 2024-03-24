import React, { useState } from 'react'
import { Badge, Button, Container, Dropdown, Image, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import {FaShoppingCart, FaUser} from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { loggingout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import SearchComponent from './SearchComponent';

const Header = () => {
  const {keyWord} =useParams();
const dispatch = useDispatch();
const navigate = useNavigate();
const [keyWordState, setKeyWordState] = useState(keyWord || "")
  const {cartItems} = useSelector(state => state.cart);
  const {userInfo} = useSelector(state => state.auth);
  const [logout] = useLogoutMutation();


  const logoutHandler = async() => {
  try {
    await logout().unwrap();
    dispatch(loggingout());
    navigate("/login")
  } catch (error) {
    toast.error(error?.data?.message || error.error)
  }
  }

  const resetSearch = () => {
  navigate("/");
  setKeyWordState("");
  }
  return (
    <header>
      <Navbar bg='dark' variant='dark' expand="lg" collapseOnSelect>
  <Container>
  <LinkContainer to='/'>
  <Navbar.Brand >
  <Image
  width="50px" height="50px"
  className='rounded-circle'
  style={{objectFit: "fill"}}
   src='https://res.cloudinary.com/dw1bs1boz/image/upload/v1710276555/Zef-Proshop/default/WhatsApp_Image_2024-03-12_at_22.48.06_52b076a1_sc3kgx.jpg'/>
  </Navbar.Brand>
  </LinkContainer>

       <Navbar.Toggle aria-controls='basic-navbar-nav'/>
       <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='ms-auto'>



        {keyWord &&
  <Button variant='outline-success' onClick={resetSearch} className="me-2">
Reset Search
  </Button>
  }
<SearchComponent keyWordState={keyWordState} setKeyWordState={setKeyWordState}/>
{userInfo && !userInfo?.isAdmin  && 

  <LinkContainer to='/cart'>
        <Nav.Link> <FaShoppingCart/> {cartItems.length >  0 && 
          <Badge pill bg="danger">
          {cartItems.length}
          {/* {cartItems.reduce((acc , item) => acc + item.qty , 0) }  */}
      </Badge>
        } Cart 
      
         </Nav.Link>
        </LinkContainer>

}
  {
    userInfo && !userInfo?.isAdmin && (
<>
<Image src={userInfo?.profilePhoto?.url} width="40px" height="40px" className='ms-2 rounded-circle'/>
<NavDropdown title={userInfo?.name} id='username'>
<LinkContainer to="/profile">
<NavDropdown.Item>Profile</NavDropdown.Item>
</LinkContainer>
<NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
    </NavDropdown>
</>
  )   
  }


  {  userInfo && userInfo?.isAdmin   && (

    <>
  <Image src={userInfo?.profilePhoto?.url} width="40px" height="40px" className='ms-2 rounded-circle'/>
  <NavDropdown title={`Admin : ${userInfo?.name}`} id='adminmenue'>
      <LinkContainer to="/admin/products">
        <NavDropdown.Item>Products</NavDropdown.Item>
      </LinkContainer>
      <LinkContainer to="/admin/users">
        <NavDropdown.Item>Users</NavDropdown.Item>
      </LinkContainer>
      <LinkContainer to="/admin/orderlist">
        <NavDropdown.Item>Orders</NavDropdown.Item>
      </LinkContainer>

      <LinkContainer to="/profile">
<NavDropdown.Item>Admin Profile</NavDropdown.Item>
</LinkContainer>
<NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
    </NavDropdown>
  </>
  )}



{!userInfo && !userInfo?.name && 
  <>
    <LinkContainer to='/login'>
        <Nav.Link> <FaUser/> Login</Nav.Link>
        </LinkContainer>
    
        <LinkContainer to='/register'>
        <Nav.Link> <FaUser/> Register</Nav.Link>
        </LinkContainer>
    </>
}

        </Nav>
       </Navbar.Collapse>
  </Container>

      </Navbar>
    </header>
  )
}

export default Header;