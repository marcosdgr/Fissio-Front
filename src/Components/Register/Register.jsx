import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  getLocalidades, 
  registerPaciente, 
 
} from "../../Custom/CustomRegister.js";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Datos de usuario
    email: "",
    password: "",
    confirmPassword: "",
    // Datos de paciente
    dni: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    telefono: "",
    direccion: "",
    sexo: "",
    localidad: ""
  });

  const [localidades, setLocalidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Cargar localidades al montar el componente
  useEffect(() => {
    fetchLocalidades();
  }, []);

  const fetchLocalidades = async () => {
    try {
      const data = await getLocalidades();
      setLocalidades(data);
    } catch (error) {
      console.error("Error al cargar localidades:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar localidades',
        text: 'No se pudieron cargar las localidades. Intente recargar la página.',
        confirmButtonColor: '#0470BB'
      });
    }
  };

  // Función para mostrar alertas de error
  const showError = (title, message) => {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonColor: '#0470BB'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando se empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones básicas
    if (!formData.email) newErrors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
    
    if (!formData.password) newErrors.password = "La contraseña es requerida";
    else if (formData.password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    if (!formData.dni) newErrors.dni = "El DNI es requerido";
    else if (!/^\d{7,8}$/.test(formData.dni)) newErrors.dni = "El DNI debe tener 7-8 dígitos";
    
    if (!formData.nombre) newErrors.nombre = "El nombre es requerido";
    if (!formData.apellido) newErrors.apellido = "El apellido es requerido";
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = "La fecha de nacimiento es requerida";
    
    if (!formData.telefono) newErrors.telefono = "El teléfono es requerido";
    else if (!/^\d{10}$/.test(formData.telefono.replace(/\s/g, ''))) newErrors.telefono = "El teléfono debe tener 10 dígitos";
    
    if (!formData.direccion) newErrors.direccion = "La dirección es requerida";
    if (!formData.sexo) newErrors.sexo = "El sexo es requerido";
    if (!formData.localidad) newErrors.localidad = "La localidad es requerida";

    setErrors(newErrors);
    
    // Si hay errores, mostrar el primero con SweetAlert2
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      showError('Error de validación', firstError);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Formatear datos para envío
      const registroData = {
        MailUsuario: formData.email,
        PasswordUsuario: formData.password,
        DNI: formData.dni,
        NombrePaciente: formData.nombre,
        ApellidoPaciente: formData.apellido,
        FechaNacPaciente: formData.fechaNacimiento,
        TelefonoPaciente: formData.telefono,
        DireccionPaciente: formData.direccion,
        Sexo: formData.sexo,
        idLocalidad: parseInt(formData.localidad)
      };

      // Registrar paciente
      await registerPaciente(registroData);
      
      // Mostrar éxito y navegar al login
      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: `Bienvenido ${formData.nombre}! Tu cuenta ha sido creada exitosamente. Serás redirigido al login para ingresar.`,
        confirmButtonColor: '#0470BB',
        confirmButtonText: 'Ir al Login'
      });
      
      // Navegar al login
      navigate('/login');
      
    } catch (error) {
      console.error("Error al registrar paciente:", error);
      
      // Manejo específico de errores según código de estado
      const status = error.response?.status;
      const message = error.response?.data?.message;
      
      switch (status) {
        case 400:
          // Datos faltantes o inválidos
          if (message?.includes('Mail')) {
            showError('Email requerido', 'El email es obligatorio para crear la cuenta');
          } else if (message?.includes('DNI')) {
            showError('DNI inválido', 'El DNI ya está registrado o tiene un formato incorrecto');
          } else if (message?.includes('campos')) {
            showError('Campos requeridos', 'Todos los campos marcados con * son obligatorios');
          } else {
            showError('Datos inválidos', message || 'Verifique que todos los datos sean correctos');
          }
          break;
          
        case 409:
          // Usuario ya existe
          showError('Usuario ya existe', 'Ya existe una cuenta con este email. Intente con otro email o vaya al login si ya tiene cuenta.');
          break;
          
        case 422:
          // Error de validación específica
          showError('Error de validación', message || 'Los datos ingresados no cumplen con los requisitos');
          break;
          
        case 500:
          // Error del servidor
          showError('Error del servidor', 'Ocurrió un problema en el servidor. Intente nuevamente más tarde');
          break;
          
        default:
          // Error genérico o sin conexión
          if (error.code === 'ERR_NETWORK') {
            showError('Error de conexión', 'No se pudo conectar al servidor. Verifique su conexión a internet');
          } else {
            showError('Error inesperado', message || 'Ocurrió un error inesperado. Intente nuevamente');
          }
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center mb-0">
                <span className="material-symbols-outlined me-2">person_add</span>
                Registro de Paciente
              </h3>
              <p className="text-center mb-0 mt-2">
                <small>Complete todos los campos para crear su cuenta</small>
              </p>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="row g-3">
                
                {/* Sección de Datos de Usuario */}
                <div className="col-12">
                  <h5 className="text-primary border-bottom pb-2">Datos de Acceso</h5>
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ejemplo@email.com"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">Contraseña *</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña *</label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Repita la contraseña"
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                {/* Sección de Datos Personales */}
                <div className="col-12 mt-4">
                  <h5 className="text-primary border-bottom pb-2">Datos Personales</h5>
                </div>

                <div className="col-md-4">
                  <label htmlFor="dni" className="form-label">DNI *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.dni ? 'is-invalid' : ''}`}
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    placeholder="12345678"
                    maxLength="8"
                  />
                  {errors.dni && <div className="invalid-feedback">{errors.dni}</div>}
                </div>

                <div className="col-md-4">
                  <label htmlFor="nombre" className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                  />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>

                <div className="col-md-4">
                  <label htmlFor="apellido" className="form-label">Apellido *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    placeholder="Apellido"
                  />
                  {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento *</label>
                  <input
                    type="date"
                    className={`form-control ${errors.fechaNacimiento ? 'is-invalid' : ''}`}
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                  />
                  {errors.fechaNacimiento && <div className="invalid-feedback">{errors.fechaNacimiento}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="sexo" className="form-label">Sexo *</label>
                  <select
                    className={`form-select ${errors.sexo ? 'is-invalid' : ''}`}
                    id="sexo"
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {errors.sexo && <div className="invalid-feedback">{errors.sexo}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="telefono" className="form-label">Teléfono *</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="381-1234567"
                  />
                  {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="localidad" className="form-label">Localidad *</label>
                  <select
                    className={`form-select ${errors.localidad ? 'is-invalid' : ''}`}
                    id="localidad"
                    name="localidad"
                    value={formData.localidad}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione una localidad...</option>
                    {localidades.map((loc) => (
                      <option key={loc.idLocalidad} value={loc.idLocalidad}>
                        {loc.NombreLocalidad}
                      </option>
                    ))}
                  </select>
                  {errors.localidad && <div className="invalid-feedback">{errors.localidad}</div>}
                </div>

                <div className="col-12">
                  <label htmlFor="direccion" className="form-label">Dirección *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    placeholder="Calle, número, barrio..."
                  />
                  {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
                </div>

                <div className="col-12 mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registrando...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined me-2">person_add</span>
                        Registrar Paciente
                      </>
                    )}
                  </button>
                </div>
                
                <div className="col-12 text-center">
                  <small className="text-muted">* Campos obligatorios</small>
                  <hr className="my-3" />
                  <p className="text-muted mb-2">¿Ya tienes una cuenta?</p>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/login')}
                    disabled={loading}
                  >
                    <span className="material-symbols-outlined me-2">login</span>
                    Ir al Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
