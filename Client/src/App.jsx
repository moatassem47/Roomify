import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AnimationPage from "./components/common/AnimationPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleProtectedRoute from "./components/common/RoleProtectedRoute";
import { USER_ROLES, getRoleHome } from "./utils/roleRoutes";
import { useEffect } from "react";
import useAuth from "./store/authStore";
import MainLayout from "./layout/MainLayout";
import DeliveryLayout from "./layout/DeliveryLayout";
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutFailed from "./pages/CheckoutFailed";
import OurStory from "./pages/OurStory";
import AdminProducts from "./features/admin/pages/AdminProducts";
import AnimatedAdminPages from "./features/admin/components/AnimatedAdminPages"
import AdminRoute from "./features/admin/components/AdminRoute"
import AdminLayout from "./layout/AdminLayout"
import Dashboard from "./features/admin/pages/Dashboard"
import Orders from "./features/admin/pages/Orders"
import Delivery from "./features/admin/pages/Delivery"
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import DeliveryProtectedRoute from "./features/delivery/components/DeliveryProtectedRoute";
import DeliveryDashboard from "./features/delivery/pages/DeliveryDashboard";
import DeliveryOrders from "./features/delivery/pages/DeliveryOrders";
import DeliveryHistory from "./features/delivery/pages/DeliveryHistory";
import DeliveryProfile from "./features/delivery/pages/DeliveryProfile";
import DeliveryOrderDetails from "./features/delivery/pages/DeliveryOrderDetails";

const GuestRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getRoleHome(user?.role)} replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const { checkAuth, isCheckingAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center font-sans text-brand-cedar">
        Loading your session...
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignUp />
            </GuestRoute>
          }
        />
        <Route
          path="/"
          element={
            <RoleProtectedRoute allowedRoles={USER_ROLES} requireAuth={false}>
              <MainLayout />
            </RoleProtectedRoute>
          }
        >
          <Route
            index
            element={
              <AnimationPage>
                <Home />
              </AnimationPage>
            }
          />
          <Route
            path="shop"
            element={
              <AnimationPage>
                <Shop />
              </AnimationPage>
            }
          />
          <Route
            path="product/:id"
            element={
              <AnimationPage>
                <ProductDetails />
              </AnimationPage>
            }
          />
          <Route
            path="cart"
            element={
              <AnimationPage>
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              </AnimationPage>
            }
          />
          <Route
            path="checkout"
            element={
              <AnimationPage>
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              </AnimationPage>
            }
          />
          <Route
            path="checkout/success"
            element={
              <AnimationPage>
                <ProtectedRoute>
                  <CheckoutSuccess />
                </ProtectedRoute>
              </AnimationPage>
            }
          />
          <Route
            path="checkout/cancel"
            element={
              <AnimationPage>
                <ProtectedRoute>
                  <CheckoutFailed />
                </ProtectedRoute>
              </AnimationPage>
            }
          />
          <Route
            path="orders"
            element={
              <AnimationPage>
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              </AnimationPage>
            }
          />
          <Route
            path="orders/:id"
            element={
              <AnimationPage>
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              </AnimationPage>
            }
          />
          <Route
            path="profile"
            element={
              <AnimationPage>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </AnimationPage>
            }
          />
          <Route
            path="wishlist"
            element={
              <AnimationPage>
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              </AnimationPage>
            }
          />
          <Route
            path="story"
            element={
              <AnimationPage>
                <OurStory />
              </AnimationPage>
            }
          />
          <Route
            path="*"
            element={
              <AnimationPage>
                <Page404 />
              </AnimationPage>
            }
          />
        </Route>
        <Route
          path="/admin"
          element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
          }
        >
          <Route
            index
            element={
              <AnimatedAdminPages>
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              </AnimatedAdminPages>
            }
          />
          <Route
            path="inventory"
            element={
              <AnimatedAdminPages>
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              </AnimatedAdminPages>
            }
          />
          <Route
            path="orders"
            element={
              <AnimatedAdminPages>
                <AdminRoute>
                  <Orders />
                </AdminRoute>
              </AnimatedAdminPages>
            }
          />
          <Route
            path="delivery"
            element={
              <AnimatedAdminPages>
                <AdminRoute>
                  <Delivery />
                </AdminRoute>
              </AnimatedAdminPages>
            }
          />
        </Route>
        <Route
          path="/delivery"
          element={
            <DeliveryProtectedRoute>
              <DeliveryLayout />
            </DeliveryProtectedRoute>
          }
        >
          <Route
            index
            element={
              <AnimationPage>
                <DeliveryDashboard />
              </AnimationPage>
            }
          />
          <Route
            path="orders"
            element={
              <AnimationPage>
                <DeliveryOrders />
              </AnimationPage>
            }
          />
          <Route
            path="orders/:id"
            element={
              <AnimationPage>
                <DeliveryOrderDetails />
              </AnimationPage>
            }
          />
          <Route
            path="history"
            element={
              <AnimationPage>
                <DeliveryHistory />
              </AnimationPage>
            }
          />
          <Route
            path="profile"
            element={
              <AnimationPage>
                <DeliveryProfile />
              </AnimationPage>
            }
          />
          <Route path="*" element={<Navigate to="/delivery" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
