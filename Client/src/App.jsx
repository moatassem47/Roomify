import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AnimationPage from "./components/common/animationPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { useEffect } from "react";
import useAuth from "./store/authStore";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutFailed from "./pages/CheckoutFailed";
import OurStory from "./pages/OurStory";
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
          <Route path="checkout/cancel" element={
            <AnimationPage>
              <ProtectedRoute>
                <CheckoutFailed />
              </ProtectedRoute>
            </AnimationPage>
          } />
          <Route path="story" element={
            <AnimationPage>
                <OurStory /> 
            </AnimationPage>
          } />
          <Route
            path="*"
            element={
              <AnimationPage>
                <Page404 />
              </AnimationPage>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
