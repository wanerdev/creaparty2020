import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/public/Home';
import Catalog from './pages/public/Catalog';
import Gallery from './pages/public/Gallery';
import Availability from './pages/public/Availability';
import Quotation from './pages/public/Quotation';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-autumn-200 border-t-autumn-500 rounded-full animate-spin" />
      </div>
    );
  }

  return user ? children : <Navigate to="/admin/login" />;
};

// Public Layout
const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/catalogo"
          element={
            <PublicLayout>
              <Catalog />
            </PublicLayout>
          }
        />
        <Route
          path="/galeria"
          element={
            <PublicLayout>
              <Gallery />
            </PublicLayout>
          }
        />
        <Route
          path="/disponibilidad"
          element={
            <PublicLayout>
              <Availability />
            </PublicLayout>
          }
        />
        <Route
          path="/cotizacion"
          element={
            <PublicLayout>
              <Quotation />
            </PublicLayout>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
                  <p className="text-autumn-600 text-xl">Página no encontrada</p>
                </div>
              </div>
            </PublicLayout>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
