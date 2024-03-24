import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
// import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { Provider } from 'react-redux';
import strore from './redux/store';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PrivateRoute from './components/PrivateRoute';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import ProfileScreen from './screens/ProfileScreen';
import AdminRoute from './components/AdminRoute';
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductsListScreen from './screens/admin/ProductsListScreen';
import CreateProductScreen from './screens/admin/CreateProductScreen';
import EditProductScreen from './screens/admin/EditProductScreen';
import UsersListScreen from './screens/admin/UsersListScreen';
import { HelmetProvider } from 'react-helmet-async';




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
 <Route index={true} path='/' element={<HomeScreen/>}/>
 <Route path='/page/:pageNumber' element={<HomeScreen/>}/>
 <Route path='/search/:keyWord' element={<HomeScreen/>}/>
 <Route path='/search/:keyWord/page/:pageNumber' element={<HomeScreen/>}/>
 <Route path='/products/:productId' element={<ProductScreen/>}/>
 <Route path='/cart' element={<CartScreen/>}/>
 <Route path='/login' element={<LoginScreen/>}/>
 <Route path='/register' element={<RegisterScreen/>}/> 

 <Route path='' element={<PrivateRoute/>}>
 <Route path='/shipping' element={<ShippingScreen/>}/> 
 <Route path='/payment' element={<PaymentScreen/>}/> 
 <Route path='/placeorder' element={<PlaceOrderScreen/>}/> 
 <Route path='/order/:id' element={<OrderScreen/>}/> 
 <Route path='/profile' element={<ProfileScreen/>}/> 
 </Route>


 <Route path='' element={<AdminRoute/>}>
<Route path='/admin/orderlist' element={<OrderListScreen/>}/>
<Route path='/admin/products' element={<ProductsListScreen/>}/>
<Route path='/admin/createproduct' element={<CreateProductScreen/>}/>
<Route path='/admin/createproduct' element={<CreateProductScreen/>}/>
<Route path='/admin/product/:id/edit' element={<EditProductScreen/>}/>
<Route path='/admin/users' element={<UsersListScreen/>}/>
 </Route>

</Route>
    
  )
)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <HelmetProvider>
  <Provider store={strore}>
  <PayPalScriptProvider deferLoading={true}>
  <RouterProvider router={router}/>
  </PayPalScriptProvider>
  </Provider>
  </HelmetProvider>
  </React.StrictMode>
);
reportWebVitals();
