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
import ProductDetail from './pages/Shopper/ProductDetail';
import ShopList from './pages/Shopper/ShopList';
import Wishlist from './pages/Shopper/Wishlist';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';


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
        <Route path="/admin/homepage" element={
          <ProtectedRoute allowedRoles={["Admin", "Seller"]}>
            <AdminEmployeeHomepage />
          </ProtectedRoute>
        } />
        <Route path="/admin/categories-list" element={
          <ProtectedRoute allowedRoles={["Admin", "Seller"]}>
            <CategoryList />
          </ProtectedRoute>
        } />
        <Route path="/admin/create-category" element={
          <ProtectedRoute allowedRoles={["Admin", "Seller"]}>
            <CreateCategory />
          </ProtectedRoute>
        } />
        <Route path="/admin/create-employee" element={
          <ProtectedRoute allowedRoles={["Admin", "Seller"]}>
            <CreateEmployee />
          </ProtectedRoute>
        } />
        <Route path="/admin/create-product" element={
          <ProtectedRoute allowedRoles={["Admin", "Seller"]}>
            <CreateProduct />
          </ProtectedRoute>
        } />
        <Route path="/admin/jobs-list" element={
          <ProtectedRoute allowedRoles={["Admin", "Seller"]}>
            <JobsList />
          </ProtectedRoute>
        } />
        <Route path="/admin/products-list" element={
          <ProtectedRoute allowedRoles={["Admin", "Seller"]}>
            <ProductsList />
          </ProtectedRoute>
        } />
        <Route path="/admin/view-all-users" element={
          <ProtectedRoute allowedRoles={["Admin", "Seller"]}>
            <ViewAllUsers />
          </ProtectedRoute>
        } />

        {/* Shopper */}
        <Route path="/cart" element={
          <ProtectedRoute allowedRoles={["Shopper"]}>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/checkout-address" element={
          <ProtectedRoute allowedRoles={["Shopper"]}>
            <CheckoutAddress />
          </ProtectedRoute>
        } />
        <Route path="/checkout-payment" element={
          <ProtectedRoute allowedRoles={["Shopper"]}>
            <CheckoutPayment />
          </ProtectedRoute>
        } />
        <Route path="/checkout-shipping" element={
          <ProtectedRoute allowedRoles={["Shopper"]}>
            <CheckoutShipping />
          </ProtectedRoute>
        } />
        <Route path="/my-orders" element={
          <ProtectedRoute allowedRoles={["Shopper"]}>
            <MyOrders />
          </ProtectedRoute>
        } />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/shop-list" element={<ShopList />} />
        <Route path="/wishlist" element={
          <ProtectedRoute allowedRoles={["Shopper"]}>
            <Wishlist />
          </ProtectedRoute>
        } />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
