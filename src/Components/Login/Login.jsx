import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, envioCorreoRecuperacion } from '../../Custom/CustomLogin';
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
  const [mostrarRecuperacion, setMostrarRecuperacion] = useState(false);
  const [emailRecuperacion, setEmailRecuperacion] = useState('');
  const [isLoadingRecuperacion, setIsLoadingRecuperacion] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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

      login(response);

      const nombre = response.usuario?.NombrePaciente || response.usuario?.NombreEmpleado || response.usuario?.MailUsuario || 'a Fissio';

      showSuccess(
        '¡Login exitoso!',
        `Bienvenido ${nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase()}`
      );

      const rol = response.usuario?.NombreRol;          
      const permiso = response.usuario?.PermisosEmpleado;  

      if (rol === "Administrador") {
        navigate("/admin");

      } else if (rol === "Paciente") {
        navigate("/paciente");

      } else if (rol === "Empleado") {

        if (permiso === "Kinesiología") {
          navigate("/kinesiologo");

        } else if (permiso === "Administración") {
          navigate("/secretaria");

        } else {
          navigate("/paciente");
        }

      } else {
        navigate("/");
      }

    } catch (error) {
      console.error('Error en login:', error);

      const status = error.response?.status;
      const message = error.response?.data?.message;

      switch (status) {
        case 400:
          showError('Campos requeridos', message || 'Mail y contraseña son requeridos');
          break;

        case 401:
          showError('Credenciales incorrectas', 'Email o contraseña incorrectos.');
          break;

        case 403:
          showError('Usuario inactivo', 'Su cuenta ha sido desactivada.');
          break;

        case 500:
          showError('Error del servidor', 'Intente nuevamente más tarde.');
          break;

        default:
          if (error.code === 'ERR_NETWORK') {
            showError('Error de conexión', 'No se pudo conectar con el servidor.');
          } else {
            showError('Error inesperado', message || 'Ocurrió un error inesperado.');
          }
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para solicitar recuperación de contraseña
  const handleRecuperarPassword = async (e) => {
    e.preventDefault();
    
    if (!emailRecuperacion) {
      showError('Email requerido', 'Por favor ingrese su correo electrónico');
      return;
    }

    setIsLoadingRecuperacion(true);
    
    try {
      await envioCorreoRecuperacion(emailRecuperacion);
      
      showSuccess(
        '¡Correo enviado!',
        'Revisa tu bandeja de entrada. Te hemos enviado un link para restablecer tu contraseña (válido por 15 minutos).'
      );
      
      setEmailRecuperacion('');
      setMostrarRecuperacion(false);
      
    } catch (error) {
      console.error('Error al solicitar recuperación:', error);
      
      const message = error.response?.data?.message;
      
      if (error.response?.status === 404) {
        showError('Usuario no encontrado', 'No existe una cuenta con este correo electrónico');
      } else {
        showError('Error', message || 'No se pudo enviar el correo de recuperación');
      }
    } finally {
      setIsLoadingRecuperacion(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

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
              
              {/* EMAIL */}
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

              {/* CONTRASEÑA */}
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

              {/* Link para recuperar contraseña */}
              <div className="text-center mb-3">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none p-0"
                  onClick={() => setMostrarRecuperacion(true)}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

            </form>

            {/* LINK REGISTER */}
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

        {/* PANEL DERECHO */}
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

      {/* MODAL DE RECUPERACIÓN DE CONTRASEÑA */}
      {mostrarRecuperacion && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <span className="material-symbols-outlined me-2">lock_reset</span>
                  Recuperar Contraseña
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setMostrarRecuperacion(false);
                    setEmailRecuperacion('');
                  }}
                  disabled={isLoadingRecuperacion}
                ></button>
              </div>
              
              <form onSubmit={handleRecuperarPassword}>
                <div className="modal-body">
                  <p className="text-muted mb-3">
                    Ingresa tu correo electrónico y te enviaremos un link para restablecer tu contraseña.
                  </p>
                  
                  <div className="mb-3">
                    <label htmlFor="emailRecuperacion" className="form-label">
                      <span className="material-symbols-outlined me-2">email</span>
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="emailRecuperacion"
                      value={emailRecuperacion}
                      onChange={(e) => setEmailRecuperacion(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      required
                      disabled={isLoadingRecuperacion}
                    />
                  </div>
                  
                  <div className="alert alert-info d-flex align-items-start">
                    <span className="material-symbols-outlined me-2">info</span>
                    <small>El link de recuperación será válido por 15 minutos.</small>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setMostrarRecuperacion(false);
                      setEmailRecuperacion('');
                    }}
                    disabled={isLoadingRecuperacion}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoadingRecuperacion}
                  >
                    {isLoadingRecuperacion ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined me-2">send</span>
                        Enviar Link
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
