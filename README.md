# Roomify
Easy way to view furniture in your home before buying



# frontend Architecture

roomify-frontend/
├── public/                 # ملفات عامة زي الـ favicon
│
├── src/
│   ├── assets/             # :art: الصور الثابتة وملف الـ CSS العالمي
│   │   ├── images/
│   │   └── index.css       # (إعدادات Tailwind الأساسية هنا)
│   │
│   ├── components/         # :jigsaw: المكونات المرئية المشتركة (بدون Logic معقد)
│   │   ├── ui/             # (مكونات Shadcn الجاهزة بتنزل هنا أوتوماتيك: Button, Input)
│   │   └── common/         # (مكوناتك العامة: LoadingSpinner, ErrorBoundary, Modal)
│   │
│   ├── features/           # :brain: العقل المدبر (كل ميزة في صندوق مقفول)
│   │   │
│   │   ├── auth/           # :closed_lock_with_key: ميزة تسجيل الدخول والتوثيق
│   │   │   ├── api/        # (authApi.js, useLogin.js, useRegister.js)
│   │   │   ├── components/ # (LoginForm.jsx, RegisterForm.jsx)
│   │   │   └── schemas/    # (loginSchema.js, registerSchema.js) <-- Zod Validation
│   │   │
│   │   ├── products/       # :shopping_bags: ميزة المنتجات
│   │   │   ├── api/        # (productsApi.js, useGetProducts.js, useGetProductById.js)
│   │   │   └── components/ # (ProductCard.jsx, ProductList.jsx, Filters.jsx)
│   │   │
│   │   ├── cart/           # :shopping_cart: ميزة سلة المشتريات
│   │   │   ├── api/        # (لو السلة بتتسجل في الداتا بيز: cartApi.js, useUpdateCart.js)
│   │   │   └── components/ # (CartItem.jsx, CartSummary.jsx)
│   │   │
│   │   └── orders/         # :credit_card: ميزة الدفع والطلبات
│   │       ├── api/        # (ordersApi.js, useCreateOrder.js)
│   │       ├── components/ # (CheckoutForm.jsx)
│   │       └── schemas/    # (checkoutSchema.js) <-- Zod Validation لبيانات الشحن
│   │
│   ├── hooks/              # :hook: الـ Custom Hooks للـ UI (ملهاش علاقة بالـ API)
│   │   ├── useClickOutside.js
│   │   └── useDebounce.js  # (مفيد جداً في البحث عن المنتجات)
│   │
│   ├── layouts/            # :frame_photo: هياكل الصفحات الثابتة
│   │   ├── MainLayout.jsx  # (جواه Navbar + <Outlet /> + Footer)
│   │   └── AdminLayout.jsx # (جواه Sidebar + <Outlet />)
│   │
│   ├── pages/              # :page_facing_up: الصفحات الأساسية (تجميع المكونات من الـ features)
│   │   ├── Home.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── CartPage.jsx
│   │   └── CheckoutPage.jsx
│   │
│   ├── router/             # :motorway: إعدادات مسارات الموقع بالكامل
│   │   └── index.jsx       # (هنا بنعمل createBrowserRouter)
│   │
│   ├── store/              # :convenience_store: مخازن الـ Global State (Zustand)
│   │   ├── useAuthStore.js # (لتخزين حالة اليوزر وهل هو مسجل دخول ولا لأ)
│   │   └── useCartStore.js # (لتخزين المنتجات اللي في السلة محلياً)
│   │
│   ├── utils/              # :tools: أدوات مساعدة وتهيئة
│   │   ├── axios.js        # (إعدادات الـ Interceptors والـ withCredentials للكوكيز)
│   │   └── formatters.js   # (دوال تنسيق السعر والتاريخ)
│   │
│   └── main.jsx            # :rocket: نقطة البداية (فيها QueryClientProvider و RouterProvider)