import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../Custom/CustomLogin';
import { useAuthStore } from '../../Store/useAuthStore';
import { showSuccess, showError } from '../../Utils/sweetAlerts';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await loginUser({
        MailUsuario: formData.email,
        PasswordUsuario: formData.password
      });

      console.log('Login exitoso:', response);
      
      // Usar Zustand para guardar el estado global
      login(response.user || response);
      
      // Mostrar mensaje de éxito
      showSuccess('¡Login exitoso!', 'Bienvenido a Fissio');
      
      // Navegar a home
      navigate('/');
      
    } catch (error) {
      console.error('Error en login:', error);
      showError('Error al iniciar sesión', error.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Lado izquierdo - Formulario */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <div className="text-center mb-4">
              <img src="/logo-negro.png" alt="Fissio" style={{ height: '60px' }} />
              <h2 className="mt-3 mb-1">Iniciar Sesión</h2>
              <p className="text-muted">Ingresa a tu cuenta de Fissio</p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                <span className="material-symbols-outlined me-2">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  <span className="material-symbols-outlined me-2">email</span>
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  <span className="material-symbols-outlined me-2">lock</span>
                  Contraseña
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={isLoading}
                style={{ backgroundColor: '#0470BB', borderColor: '#0470BB' }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined me-2">login</span>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-muted">
                ¿No tienes cuenta? 
                <a href="/register" className="text-decoration-none ms-1" style={{ color: '#0470BB' }}>
                  Regístrate aquí
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Lado derecho - Imagen/Información */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center" 
             style={{ backgroundColor: '#f8f9fa' }}>
          <div className="text-center">
            <span className="material-symbols-outlined" style={{ fontSize: '120px', color: '#0470BB' }}>
              medical_services
            </span>
            <h3 className="mt-3" style={{ color: '#0470BB' }}>Bienvenido a Fissio</h3>
            <p className="text-muted">
              Gestiona tus citas médicas de forma fácil y segura
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;