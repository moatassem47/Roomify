import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useEffect } from "react";
import AnimationPage from "./components/AnimationPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import { USER_ROLES, getRoleHome } from "./utils/roleRoutes";
import useAuth from "./store/authStore";
import MainLayout from "./layout/MainLayout";
const DeliveryLayout =lazy(()=>import("./layout/DeliveryLayout"));
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
const Shop =lazy(()=>import( "./pages/Shop"));
const ProductDetails =lazy(()=>import( "./pages/ProductDetails"));
const Cart =lazy(()=>import( "./pages/Cart"));
const Checkout =lazy(()=>import( "./pages/Checkout"));
const CheckoutSuccess =lazy(()=>import( "./pages/CheckoutSuccess"));
const CheckoutFailed =lazy(()=>import("./pages/CheckoutFailed"));
const OurStory =lazy(()=>import( "./pages/OurStory"));
const AdminProducts =lazy(()=>import( "./features/admin/pages/AdminProducts"));
import AnimatedAdminPages from "./features/admin/components/AnimatedAdminPages"
import AdminRoute from "./features/admin/components/AdminRoute"
const AdminLayout =lazy(()=>import("./layout/AdminLayout"));
const Dashboard =lazy(()=>import("./features/admin/pages/Dashboard"));
const Orders =lazy(()=>import("./features/admin/pages/Orders"))
const Customers =lazy(()=>import("./features/admin/pages/Customers"))
const Delivery = lazy(()=>import("./features/admin/pages/Delivery"));
const MyOrders =lazy(()=>import("./pages/MyOrders"));
const OrderDetails=lazy(()=>import("./pages/OrderDetails"));
const Profile =lazy(()=>import("./pages/Profile"))
const  Wishlist=lazy(()=>import("./pages/Wishlist"));
const VerifyEmail =lazy(()=>import("./pages/VerifyEmail"));
const SignUp =lazy(()=>import( "./pages/SignUp"));
const ResetPassword=lazy(()=>import("./pages/ResetPassword"))
import Loading from "./components/Loading";
import Login from "./pages/Login";
const DeliveryProtectedRoute=lazy(()=>import( "./features/delivery/components/DeliveryProtectedRoute"));
const DeliveryDashboard =lazy(()=>import( "./features/delivery/pages/DeliveryDashboard"));
const DeliveryOrders=lazy(()=>import("./features/delivery/pages/DeliveryOrders"));
const DeliveryHistory =lazy(()=>import( "./features/delivery/pages/DeliveryHistory"));
const DeliveryProfile =lazy(()=>import( "./features/delivery/pages/DeliveryProfile"));
const DeliveryOrderDetails =lazy(()=>import( "./features/delivery/pages/DeliveryOrderDetails"));

const GuestRoute = ({ children }) => {
  const isAuthenticated = useAuth((state)=>state.isAuthenticated);
  const user = useAuth((state)=>state.user);

  if (isAuthenticated) {
    return <Navigate to={getRoleHome(user?.role)} replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const checkAuth = useAuth((s) => s.checkAuth);
  const isCheckingAuth = useAuth((s) => s.isCheckingAuth);

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
      <Suspense fallback={<Loading/>}>
        <Routes location={location} key={location.pathname}>
        
          
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
            path="/signup"
            element={
              <GuestRoute>
                <SignUp />
              </GuestRoute>
            }
          />
            <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
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
              path="customers"
              element={
                <AnimatedAdminPages>
                  <AdminRoute>
                    <Customers />
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
          <Route path="/verify-email/:token" element={<VerifyEmail/>}/>
          <Route path="/changePassword/:token" element={<ResetPassword/>}/>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;
