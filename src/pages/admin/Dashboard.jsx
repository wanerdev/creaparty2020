import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Calendar,
  FileText,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

// Import real management pages
import ProductsManagement from './ProductsManagement';
import QuotationsManagement from './QuotationsManagement';
import ReservationsManagement from './ReservationsManagement';
import GalleryManagement from './GalleryManagement';

// Dashboard Home View
const DashboardHome = () => (
  <div>
    <h2 className="text-3xl font-bold gradient-text mb-6">Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: 'Cotizaciones Pendientes', value: '12', color: 'from-autumn-500 to-rust-500' },
        { title: 'Reservas del Mes', value: '28', color: 'from-rust-500 to-terracotta-500' },
        { title: 'Productos', value: '145', color: 'from-sage-500 to-autumn-500' },
        { title: 'Eventos Completados', value: '89', color: 'from-terracotta-500 to-autumn-600' },
      ].map((stat, index) => (
        <div
          key={index}
          className="glass-card p-6 rounded-2xl"
        >
          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4`}>
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
          <div className="text-autumn-600">{stat.title}</div>
        </div>
      ))}
    </div>
  </div>
);


const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Package, label: 'Productos', path: '/admin/productos' },
    { icon: Calendar, label: 'Reservas', path: '/admin/reservas' },
    { icon: FileText, label: 'Cotizaciones', path: '/admin/cotizaciones' },
    { icon: ImageIcon, label: 'Galería', path: '/admin/galeria' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-autumn-50 via-cream-100 to-sage-50">
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-screen glass-card border-r border-autumn-200 z-40 transition-all duration-300"
        style={{ width: sidebarOpen ? 280 : 80 }}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <h1 className="text-2xl font-bold gradient-text">
                Creaparty2020
              </h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-autumn-100 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-autumn-700" />
              ) : (
                <Menu className="w-6 h-6 text-autumn-700" />
              )}
            </button>
          </div>

          {/* Menu */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-autumn-700 hover:bg-autumn-100 transition-colors group"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="font-medium">
                  Cerrar Sesión
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 280 : 80 }}
      >
        <div className="p-8">
          <Routes>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="productos" element={<ProductsManagement />} />
            <Route path="reservas" element={<ReservationsManagement />} />
            <Route path="cotizaciones" element={<QuotationsManagement />} />
            <Route path="galeria" element={<GalleryManagement />} />
            <Route path="/" element={<DashboardHome />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
