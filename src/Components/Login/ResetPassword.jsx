import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetearContrasena } from '../../Custom/CustomLogin';
import { showSuccess, showError } from '../../Utils/sweetAlerts';
import '../../Css/Login/Login.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // Obtener el token de la URL

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValido, setTokenValido] = useState(true);

  // Verificar que existe el token
  useEffect(() => {
    console.log('Token recibido de la URL:', token);
    console.log('Tipo de token:', typeof token);
    console.log('Longitud del token:', token?.length);
    
    if (!token) {
      showError('Link inválido', 'No se encontró el token de recuperación');
      setTokenValido(false);
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [token, navigate]);

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar contraseñas
  const validarFormulario = () => {
    if (!formData.password || !formData.confirmPassword) {
      showError('Campos requeridos', 'Por favor complete todos los campos');
      return false;
    }

    if (formData.password.length < 6) {
      showError('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Contraseñas no coinciden', 'Las contraseñas ingresadas no son iguales');
      return false;
    }

    return true;
  };

  // Submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setIsLoading(true);

    try {
      console.log('Enviando reset con token:', token);
      console.log('Nueva contraseña longitud:', formData.password.length);
      
      await resetearContrasena(token, formData.password);

      showSuccess(
        '¡Contraseña actualizada!',
        'Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión.'
      );

      // Limpiar formulario
      setFormData({
        password: '',
        confirmPassword: ''
      });

      // Redirigir al login después de 2 segundos
      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      console.error('Error completo al resetear contraseña:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        showError('Token inválido o expirado', 'El link de recuperación ha expirado o es inválido. Solicita uno nuevo.');
      } else if (status === 404) {
        showError('Usuario no encontrado', 'No se encontró el usuario asociado al token');
      } else {
        showError('Error', message || 'No se pudo actualizar la contraseña. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValido) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-danger" style={{ fontSize: '4rem' }}>
            error
          </span>
          <h3 className="mt-3">Link inválido</h3>
          <p className="text-muted">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* FORMULARIO */}
        <div className="col-md-6 d-flex align-items-center justify-content-center px-3 px-md-0">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <div className="text-center mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '3rem' }}>
                lock_reset
              </span>
              <h2 className="mt-3 mb-1">Restablecer Contraseña</h2>
              <p className="text-muted">Ingresa tu nueva contraseña</p>
            </div>

            <form onSubmit={handleSubmit}>
              
              {/* NUEVA CONTRASEÑA */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  <span className="material-symbols-outlined me-2">lock</span>
                  Nueva Contraseña *
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${formData.password ? 'is-valid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength="6"
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

              {/* CONFIRMAR CONTRASEÑA */}
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  <span className="material-symbols-outlined me-2">lock</span>
                  Confirmar Contraseña *
                </label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`form-control ${
                      formData.confirmPassword && formData.password === formData.confirmPassword 
                        ? 'is-valid' 
                        : formData.confirmPassword 
                        ? 'is-invalid' 
                        : ''
                    }`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite la contraseña"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <div className="text-danger small mt-1">
                    Las contraseñas no coinciden
                  </div>
                )}
              </div>

              {/* ALERT INFO */}
              <div className="alert alert-info d-flex align-items-start mb-3">
                <span className="material-symbols-outlined me-2">info</span>
                <small>
                  La contraseña debe tener al menos 6 caracteres.
                </small>
              </div>

              {/* BOTÓN */}
              <button
                type="submit"
                className="btn btn-primary w-100 mb-3 login-btn-primary"
                disabled={isLoading || formData.password !== formData.confirmPassword}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined me-2">check_circle</span>
                    Restablecer Contraseña
                  </>
                )}
              </button>

            </form>

            {/* LINK VOLVER AL LOGIN */}
            <div className="text-center">
              <button
                className="btn btn-link text-decoration-none"
                onClick={() => navigate('/login')}
              >
                <span className="material-symbols-outlined me-1">arrow_back</span>
                Volver al login
              </button>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center login-info-panel">
          <div className="text-center p-4">
            <img src="/logo-color.png" alt="Fissio" className="img-fluid mb-3" style={{ maxHeight: '120px' }} />
            <h3 className="login-welcome-title mb-3">Recuperación de Cuenta</h3>
            <p className="text-muted mb-0">
              Crea una nueva contraseña segura para tu cuenta
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
