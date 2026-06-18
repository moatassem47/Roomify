# Roomify Frontend Architecture

```text
roomify-frontend/
├── public/                           # ملفات عامة متاحة مباشرة للمتصفح
│                                      # favicon, logos, robots.txt
│
├── src/
│   ├── assets/                       # الصور والملفات الثابتة
│   │   ├── images/                   # صور المنتجات، اللوجو، البانرات
│   │   └── index.css                 # Tailwind directives + global styles
│   │
│   ├── components/                   # Components مشتركة على مستوى المشروع كله
│   │   ├── ui/                       # Shadcn Components (Button, Input, Dialog...)
│   │   └── common/                   # LoadingSpinner, Modal, EmptyState, ErrorBoundary
│   │
│   ├── features/                     # كل Feature معزولة لوحدها
│   │
│   │   ├── auth/
│   │   │   ├── api/                  # login, register, logout, refresh token requests
│   │   │   ├── components/           # LoginForm, RegisterForm
│   │   │   └── schemas/              # Zod validation schemas
│   │   │
│   │   ├── products/
│   │   │   ├── api/                  # get products, product details, search, filters
│   │   │   └── components/           # ProductCard, ProductGrid, Filters
│   │   │
│   │   ├── cart/
│   │   │   ├── api/                  # update cart, sync cart with backend
│   │   │   └── components/           # CartItem, QuantitySelector, CartSummary
│   │   │
│   │   ├── orders/
│   │   │   ├── api/                  # create order, get order details
│   │   │   ├── components/           # CheckoutForm, OrderSummary
│   │   │   └── schemas/              # checkout validation
│   │   │
│   │   ├── admin/
│   │   │   ├── api/                  # CRUD products, users, orders
│   │   │   ├── components/           # ProductTable, UserTable, DashboardCards
│   │   │   └── pages/                # Admin Dashboard pages
│   │   │
│   │   └── delivery/
│   │       ├── api/                  # assigned orders, update delivery status
│   │       ├── components/           # DeliveryOrderCard, StatusBadge
│   │       └── pages/                # Delivery dashboard pages
│   │
│   ├── hooks/                        # Custom hooks خاصة بالـ UI
│   │   ├── useClickOutside.js        # غلق المودال عند الضغط خارجها
│   │   ├── useDebounce.js            # تأخير البحث
│   │   └── useLocalStorage.js        # التعامل مع localStorage
│   │
│   ├── layouts/                      # الهياكل الرئيسية للصفحات
│   │   ├── MainLayout.jsx            # Navbar + Footer + Outlet
│   │   ├── AdminLayout.jsx           # Sidebar Admin + Outlet
│   │   └── DeliveryLayout.jsx        # Sidebar Delivery + Outlet
│   │
│   ├── pages/                        # صفحات العميل العادية
│   │   ├── Home.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── router/
│   │   └── index.jsx                 # createBrowserRouter + protected routes
│   │
│   ├── store/                        # Zustand Stores
│   │   ├── useAuthStore.js           # user + token + auth state
│   │   ├── useCartStore.js           # cart state
│   │   └── useThemeStore.js          # dark/light mode
│   │
│   ├── utils/                        # Helper functions
│   │   ├── axios.js                  # axios instance + interceptors
│   │   ├── constants.js              # app constants
│   │   ├── formatters.js             # price/date formatting
│   │   └── validators.js             # helper validation functions
│   │
│   ├── services/                     # خدمات خارجية
│   │   ├── stripe.js                 # Stripe integration
│   │   └── cloudinary.js             # Image upload helpers
│   │
│   ├── types/                        # لو حولت TypeScript مستقبلاً
│   │
│   └── main.jsx                      # App Entry Point
│                                      # QueryClientProvider
│                                      # RouterProvider
│                                      # ThemeProvider
```
