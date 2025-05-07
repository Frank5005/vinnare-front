import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//General Imports 
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword';
import LandingPage from './pages/LandingPage';
import NewPassword from './pages/NewPassword';
//Admin - Employee
import AdminEmployeeHomepage from './pages/Admin - Employee/AdminEmployeeHomepage';
import CategoryList from './pages/Admin - Employee/CategoryList';
import CreateCategory from './pages/Admin - Employee/CreateCategory';
import CreateEmployee from './pages/Admin - Employee/CreateEmployee';
import CreateProduct from './pages/Admin - Employee/CreateProduct';
import JobsList from './pages/Admin - Employee/JobsList';
import ProductsList from './pages/Admin - Employee/ProductsList';
import ViewAllUsers from './pages/Admin - Employee/ViewAllUsers';

//Shopper
import Cart from './pages/Shopper/Cart';
import CheckoutAddress from './pages/Shopper/CheckoutAddress';
import CheckoutPayment from './pages/Shopper/CheckoutPayment';
import CheckoutShipping from './pages/Shopper/CheckoutShipping';
import MyOrders from './pages/Shopper/MyOrders';
import OrderDetail from './pages/Shopper/OrderDetail';
import ProductDetail from './pages/Shopper/ProductDetail';
import ShopList from './pages/Shopper/ShopList';
import Wishlist from './pages/Shopper/Wishlist';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/new-password" element={<NewPassword />} />

        {/* Admin - Employee */}
        <Route path="/admin-employee-homepage" element={<AdminEmployeeHomepage />} />
        <Route path="/category-list" element={<CategoryList />} />
        <Route path="/create-category" element={<CreateCategory />} />
        <Route path="/create-employee" element={<CreateEmployee />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/jobs-list" element={<JobsList />} />
        <Route path="/products-list" element={<ProductsList />} />
        <Route path="/view-all-users" element={<ViewAllUsers />} />

        {/* Shopper */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout-address" element={<CheckoutAddress />} />
        <Route path="/checkout-payment" element={<CheckoutPayment />} />
        <Route path="/checkout-shipping" element={<CheckoutShipping />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order-detail" element={<OrderDetail />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/shop-list" element={<ShopList />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Catch-all route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App
