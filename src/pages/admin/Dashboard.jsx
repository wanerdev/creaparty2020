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
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabase';
import Button from '../../components/ui/Button';

// Import real management pages
import ProductsManagement from './ProductsManagement';
import QuotationsManagement from './QuotationsManagement';
import ReservationsManagement from './ReservationsManagement';
import GalleryManagement from './GalleryManagement';

// Dashboard Home View
const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingQuotations: 0,
    monthReservations: 0,
    totalProducts: 0,
    completedEvents: 0,
    loading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Cotizaciones pendientes
      const { count: pendingCount } = await supabase
        .from('cotizaciones')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'pendiente');

      // Reservas del mes actual
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const { count: monthReservationsCount } = await supabase
        .from('reservas')
        .select('*', { count: 'exact', head: true })
        .gte('fecha_evento', firstDay.toISOString().split('T')[0])
        .lte('fecha_evento', lastDay.toISOString().split('T')[0]);

      // Total de productos
      const { count: productsCount } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true });

      // Eventos completados (reservas confirmadas pasadas)
      const { count: completedCount } = await supabase
        .from('reservas')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'completada')
        .lt('fecha_evento', now.toISOString().split('T')[0]);

      setStats({
        pendingQuotations: pendingCount || 0,
        monthReservations: monthReservationsCount || 0,
        totalProducts: productsCount || 0,
        completedEvents: completedCount || 0,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const statCards = [
    {
      title: 'Cotizaciones Pendientes',
      value: stats.pendingQuotations,
      color: 'from-autumn-500 to-rust-500',
      icon: FileText,
      link: '/admin/cotizaciones',
    },
    {
      title: 'Reservas del Mes',
      value: stats.monthReservations,
      color: 'from-rust-500 to-terracotta-500',
      icon: Calendar,
      link: '/admin/reservas',
    },
    {
      title: 'Productos',
      value: stats.totalProducts,
      color: 'from-sage-500 to-autumn-500',
      icon: Package,
      link: '/admin/productos',
    },
    {
      title: 'Eventos Completados',
      value: stats.completedEvents,
      color: 'from-terracotta-500 to-autumn-600',
      icon: TrendingUp,
      link: '/admin/reservas',
    },
  ];

  if (stats.loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-16 h-16 border-4 border-autumn-200 border-t-autumn-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(stat.link)}
              className="glass-card p-4 md:p-6 rounded-2xl cursor-pointer hover:shadow-soft-xl transition-all duration-300 group"
            >
              <div className={`inline-flex p-2 md:p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-3 md:mb-4`}>
                <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="flex items-center justify-between">
                <div className="text-sm md:text-base text-autumn-600">{stat.title}</div>
                <ArrowRight className="w-4 h-4 text-autumn-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const [isMobile, setIsMobile] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Detect mobile screen
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true); // Auto-open on desktop
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Close sidebar when clicking outside on mobile
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen && !event.target.closest('aside') && !event.target.closest('.sidebar-toggle')) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, sidebarOpen]);

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

  const closeMobileMenu = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-autumn-50 via-cream-100 to-sage-50">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSidebarOpen(!sidebarOpen);
        }}
        className="sidebar-toggle md:hidden fixed top-4 left-4 z-50 p-4 rounded-xl bg-white shadow-soft-lg hover:bg-autumn-50 transition-colors active:scale-95"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <X className="w-7 h-7 text-autumn-700" />
        ) : (
          <Menu className="w-7 h-7 text-autumn-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen glass-card border-r border-autumn-200 z-40 transition-all duration-300
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          ${!isMobile && !sidebarOpen ? 'w-20' : 'w-64 md:w-72'}
        `}
      >
        <div className="p-4 md:p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            {sidebarOpen && (
              <h1 className="text-xl md:text-2xl font-bold gradient-text">
                Creaparty2020
              </h1>
            )}
            {!isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl hover:bg-autumn-100 transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 md:w-6 md:h-6 text-autumn-700" />
                ) : (
                  <Menu className="w-5 h-5 md:w-6 md:h-6 text-autumn-700" />
                )}
              </button>
            )}
          </div>

          {/* Menu */}
          <nav className="space-y-2 flex-1 overflow-y-auto">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-autumn-700 hover:bg-autumn-100 transition-colors group"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium text-sm md:text-base">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-autumn-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="font-medium text-sm md:text-base">
                  Cerrar Sesión
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`
          transition-all duration-300 min-h-screen
          ${isMobile ? 'ml-0' : (sidebarOpen ? 'ml-72' : 'ml-20')}
        `}
      >
        <div className="p-4 md:p-8 pt-20 md:pt-8">
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
