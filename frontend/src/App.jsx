import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/user/Home";
import Auth from "./pages/user/Auth";
import ProductDetail from "./pages/user/ProductDetail";
import { AuthProvider } from "./context/AuthContext";
import ProductsPage from "./pages/user/ProductsPage";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import Profile from "./pages/user/Profile";

// Import Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import ProductManager from "./pages/admin/ProductManager";
import OrderManager from "./pages/admin/OrderManager";
import RevenueManager from "./pages/admin/RevenueManager";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="auth" element={<Auth />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="products" element={<ProductManager />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="revenue" element={<RevenueManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
