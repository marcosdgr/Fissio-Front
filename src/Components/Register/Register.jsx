import React, { useState, useEffect } from "react";
import { 
  getLocalidades, 
  registerPaciente, 
 
} from "../../Custom/CustomRegister.js";

const Register = () => {
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
    }
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

    // Validaciones básicas - tú puedes agregar las tuyas propias aquí
    if (!formData.email) newErrors.email = "El email es requerido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    if (!formData.dni) newErrors.dni = "El DNI es requerido";
    if (!formData.nombre) newErrors.nombre = "El nombre es requerido";
    if (!formData.apellido) newErrors.apellido = "El apellido es requerido";
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = "La fecha de nacimiento es requerida";
    if (!formData.telefono) newErrors.telefono = "El teléfono es requerido";
    if (!formData.direccion) newErrors.direccion = "La dirección es requerida";
    if (!formData.sexo) newErrors.sexo = "El sexo es requerido";
    if (!formData.localidad) newErrors.localidad = "La localidad es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      
      alert("Paciente registrado exitosamente");
      
      // Resetear formulario
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        dni: "",
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        telefono: "",
        direccion: "",
        sexo: "",
        localidad: ""
      });
      
      setErrors({});
      
    } catch (error) {
      console.error("Error al registrar paciente:", error);
      alert(`Error al registrar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center mb-0">Registro de Paciente</h3>
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
                      'Registrar Paciente'
                    )}
                  </button>
                </div>
                
                <div className="col-12">
                  <small className="text-muted">* Campos obligatorios</small>
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
