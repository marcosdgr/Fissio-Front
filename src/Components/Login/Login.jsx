import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../Custom/CustomLogin';
import { useAuthStore } from '../../Store/useAuthStore';
import { showSuccess, showError } from '../../Utils/sweetAlerts';
import '../../Css/Login/Login.css';

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

    // Validaciones del frontend
    if (!formData.email || !formData.password) {
      showError('Campos requeridos', 'Por favor ingrese email y contraseña');
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser({
        MailUsuario: formData.email,
        PasswordUsuario: formData.password
      });

      console.log('Login exitoso - Respuesta completa:', response);
      
      // Guardar en Zustand (usar la estructura correcta del backend)
      login(response);
      
      // Mostrar mensaje de éxito
      showSuccess('¡Login exitoso!', `Bienvenido ${response.usuario?.NombrePaciente || response.usuario?.NombreProfesional || response.usuario?.MailUsuario || 'a Fissio'}`);
      
      // Redirigir según el tipo de usuario
      const tipoUsuario = response.usuario?.idTipoUsuario || response.usuario?.TipoUsuario;
      
      if (tipoUsuario === 1 || tipoUsuario === 'Administrador') {
        navigate('/admin');
      } else if (tipoUsuario === 2 || tipoUsuario === 'Profesional' || tipoUsuario === 'Kinesiologo') {
        navigate('/kinesiologo');
      } else if (tipoUsuario === 3 || tipoUsuario === 'Paciente') {
        navigate('/paciente');
      } else {
        // Por defecto, navegar a paciente si no se reconoce el tipo
        navigate('/paciente');
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      
      // Manejo específico de errores según código de estado
      const status = error.response?.status;
      const message = error.response?.data?.message;
      
      switch (status) {
        case 400:
          // Mail y contraseña son requeridos
          showError('Campos requeridos', message || 'Mail y contraseña son requeridos');
          break;
          
        case 401:
          // Credenciales inválidas
          showError('Credenciales incorrectas', 'Email o contraseña incorrectos. Verifique sus datos e intente nuevamente.');
          break;
          
        case 403:
          // Usuario inactivo
          showError('Usuario inactivo', 'Su cuenta ha sido desactivada. Contacte al administrador para más información.');
          break;
          
        case 500:
          // Error del servidor
          showError('Error del servidor', 'Ocurrió un problema en el servidor. Intente nuevamente más tarde.');
          break;
          
        default:
          // Error genérico o sin conexión
          if (error.code === 'ERR_NETWORK') {
            showError('Error de conexión', 'No se pudo conectar al servidor. Verifique su conexión a internet.');
          } else {
            showError('Error inesperado', message || 'Ocurrió un error inesperado. Intente nuevamente.');
          }
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Lado izquierdo - Formulario */}
        <div className="col-md-6 d-flex align-items-center justify-content-center px-3 px-md-0">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <div className="text-center mb-4">
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
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  className={`form-control ${!formData.email && error ? 'is-invalid' : formData.email ? 'is-valid' : ''}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  <span className="material-symbols-outlined me-2">lock</span>
                  Contraseña *
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${!formData.password && error ? 'is-invalid' : formData.password ? 'is-valid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingrese su contraseña"
                    required
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
                className="btn btn-primary w-100 mb-3 login-btn-primary"
                disabled={isLoading}
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
                <a href="/register" className="text-decoration-none ms-1 login-link-primary">
                  Regístrate aquí
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Lado derecho - Logo y información */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center login-info-panel">
          <div className="text-center p-4">
            <img src="/logo-color.png" alt="Fissio" className="img-fluid mb-3" style={{ maxHeight: '120px' }} />
            <h3 className="login-welcome-title mb-3">Bienvenido a Fissio</h3>
            <p className="text-muted mb-0">
              Gestiona tus citas médicas de forma fácil y segura
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;