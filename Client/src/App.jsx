import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useEffect } from "react";
import AnimationPage from "./components/common/AnimationPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import useAuth from "./store/authStore";
import MainLayout from "./layout/MainLayout";
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
import AdminLayout from "./layout/AdminLayout"
const Dashboard =lazy(()=>import("./features/admin/pages/Dashboard"))
const Orders =lazy(()=>import("./features/admin/pages/Orders"))
const Delivery = lazy(()=>import("./features/admin/pages/Delivery"));
const MyOrders =lazy(()=>import("./pages/MyOrders"));
const OrderDetails=lazy(()=>import("./pages/OrderDetails"));
const Profile =lazy(()=>import("./pages/Profile"))
const  Wishlist=lazy(()=>import("./pages/Wishlist"));
const VerifyEmail =lazy(()=>import("./pages/VerifyEmail"));
const SignUp =lazy(()=>import( "./pages/SignUp"));
const ResetPassword=lazy(()=>import("./pages/ResetPassword"))
import Loading from "./components/common/Loading";

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
       <Suspense fallback={<Loading/>}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<MainLayout />}>
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
                path="signup"
                element={
                  <AnimationPage>
                    <SignUp />
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
                      <Dashboard />
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
            <Route path="/verify-email/:token" element={<VerifyEmail/>}/>
            <Route path="/changePassword/:token" element={<ResetPassword/>}/>
          </Routes>
       </Suspense>
    </AnimatePresence>
  );
}

export default App;
