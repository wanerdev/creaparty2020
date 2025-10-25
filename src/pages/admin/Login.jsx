import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError('Credenciales inválidas. Por favor intenta de nuevo.');
      setLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob top-1/4 left-1/4 w-96 h-96 bg-autumn-300 animate-blob" />
        <div className="blob bottom-1/4 right-1/4 w-[500px] h-[500px] bg-rust-200 animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <Card className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-3xl bg-gradient-to-br from-autumn-500 to-rust-500 animate-scale-in">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Panel de Administración
            </h1>
            <p className="text-autumn-600">Ingresa tus credenciales</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-autumn-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-autumn-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-modern pl-12"
                  placeholder="admin@creaparty2020.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-autumn-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-autumn-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-modern pl-12"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-autumn-600 hover:text-autumn-700 transition-colors"
            >
              ← Volver al sitio
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
