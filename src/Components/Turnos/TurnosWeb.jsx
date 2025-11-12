import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { solicitarTurnoWeb } from '../../Custom/CustomTurnos';
import { getDisponibilidadHorarios } from '../../Custom/CustomTurnos';
import { useAuthStore } from '../../Store/useAuthStore';

const TurnosWeb = () => {
  const [formData, setFormData] = useState({
    FechaRequeridaTurno: '',
    HorarioRequeridoTurno: '',
    InformeTurno: '',
    idPaciente: ''
  });
  
  const [ordenMedica, setOrdenMedica] = useState(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHorarios, setIsLoadingHorarios] = useState(false);
  
  const { user } = useAuthStore();

  // Cargar idPaciente del usuario autenticado
  useEffect(() => {
    if (user?.usuario?.idPaciente) {
      setFormData(prev => ({
        ...prev,
        idPaciente: user.usuario.idPaciente
      }));
    }
  }, [user]);

  // Función para mostrar alertas de éxito
  const showSuccess = (title, message) => {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      confirmButtonColor: '#0470BB',
      timer: 3000
    });
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

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si cambia la fecha, cargar horarios disponibles
    if (name === 'FechaRequeridaTurno' && value) {
      cargarHorariosDisponibles(value);
    }
  };

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo (imágenes y PDFs)
      const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!tiposPermitidos.includes(file.type)) {
        showError('Archivo no válido', 'Solo se permiten imágenes (JPG, PNG) y archivos PDF');
        e.target.value = '';
        return;
      }
      
      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showError('Archivo muy grande', 'El archivo debe ser menor a 10MB');
        e.target.value = '';
        return;
      }
      
      setOrdenMedica(file);
    }
  };

  // Cargar horarios disponibles para una fecha
  const cargarHorariosDisponibles = async (fecha) => {
    setIsLoadingHorarios(true);
    try {
      const response = await getDisponibilidadHorarios(fecha);
      
      // El backend devuelve horariosDisponibles como array de objetos {value, label, horario, cupoMaximo, disponibles}
      let horarios = [];
      if (response.horariosDisponibles && Array.isArray(response.horariosDisponibles)) {
        horarios = response.horariosDisponibles.filter(h => h.value && h.label);
      }
      
      setHorariosDisponibles(horarios);
      
      // Limpiar horario seleccionado si ya no está disponible
      if (formData.HorarioRequeridoTurno && 
          !horarios.find(h => h.value === formData.HorarioRequeridoTurno)) {
        setFormData(prev => ({
          ...prev,
          HorarioRequeridoTurno: ''
        }));
      }
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      showError('Error', 'No se pudieron cargar los horarios disponibles');
      setHorariosDisponibles([]);
    } finally {
      setIsLoadingHorarios(false);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validaciones del frontend
      if (!formData.FechaRequeridaTurno || !formData.HorarioRequeridoTurno || !formData.idPaciente) {
        showError('Campos requeridos', 'Por favor complete todos los campos obligatorios');
        return;
      }

      // Validar que la fecha no sea en el pasado
      const fechaSeleccionada = new Date(formData.FechaRequeridaTurno);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaSeleccionada < hoy) {
        showError('Fecha inválida', 'No se pueden solicitar turnos para fechas pasadas');
        return;
      }

      // Crear FormData para enviar archivo
      const formDataToSend = new FormData();
      formDataToSend.append('FechaRequeridaTurno', formData.FechaRequeridaTurno);
      formDataToSend.append('HorarioRequeridoTurno', formData.HorarioRequeridoTurno);
      formDataToSend.append('InformeTurno', formData.InformeTurno);
      formDataToSend.append('idPaciente', formData.idPaciente);
      
      if (ordenMedica) {
        formDataToSend.append('ordenMedica', ordenMedica);
      }

      const response = await solicitarTurnoWeb(formDataToSend);
      
      showSuccess(
        '¡Solicitud enviada!', 
        response.message || 'Su solicitud será procesada por nuestro personal. Recibirá confirmación pronto.'
      );

      // Limpiar formulario
      setFormData({
        FechaRequeridaTurno: '',
        HorarioRequeridoTurno: '',
        InformeTurno: '',
        idPaciente: user?.usuario?.idPaciente || ''
      });
      setOrdenMedica(null);
      setHorariosDisponibles([]);
      
      // Limpiar input de archivo
      const fileInput = document.getElementById('ordenMedica');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error al solicitar turno:', error);
      const errorMessage = error.response?.data?.message || 'Error al enviar la solicitud';
      showError('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener fecha mínima (mañana)
  const getFechaMinima = () => {
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    return mañana.toISOString().split('T')[0];
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white py-3">
              <h4 className="card-title mb-0 text-center">
                <span className="material-symbols-outlined me-2">calendar_add_on</span>
                Solicitar Turno
              </h4>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Información del paciente */}
                <div className="mb-4">
                  <h6 className="text-muted mb-3">
                    <span className="material-symbols-outlined me-1">person</span>
                    Información del Paciente
                  </h6>
                  {user?.usuario?.idPaciente ? (
                    <div className="alert alert-info">
                      {user.usuario.NombrePaciente && user.usuario.ApellidoPaciente ? (
                        <div>
                          <strong>Paciente:</strong> {user.usuario.NombrePaciente} {user.usuario.ApellidoPaciente}
                          <br />
                          <small className="text-muted">
                            DNI: {user.usuario.DNI || 'No registrado'} | 
                            Email: {user.usuario.MailUsuario}
                          </small>
                        </div>
                      ) : (
                        <div>
                          <strong>Usuario:</strong> {user.usuario.MailUsuario}
                          <br />
                          <small className="text-muted">
                            Rol: {user.usuario.NombreRol}
                          </small>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="alert alert-warning">
                      <strong>⚠️ Usuario no identificado</strong>
                      <br />
                      <small>Por favor, inicie sesión para continuar</small>
                    </div>
                  )}
                </div>

                {/* Fecha requerida */}
                <div className="mb-3">
                  <label htmlFor="FechaRequeridaTurno" className="form-label">
                    <span className="material-symbols-outlined me-1">calendar_today</span>
                    Fecha deseada *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="FechaRequeridaTurno"
                    name="FechaRequeridaTurno"
                    value={formData.FechaRequeridaTurno}
                    onChange={handleChange}
                    min={getFechaMinima()}
                    required
                  />
                  <small className="form-text text-muted">
                    Seleccione la fecha en que desea su turno
                  </small>
                </div>

                {/* Horario requerido */}
                <div className="mb-3">
                  <label htmlFor="HorarioRequeridoTurno" className="form-label">
                    <span className="material-symbols-outlined me-1">schedule</span>
                    Horario deseado *
                  </label>
                  <select
                    className="form-select"
                    id="HorarioRequeridoTurno"
                    name="HorarioRequeridoTurno"
                    value={formData.HorarioRequeridoTurno}
                    onChange={handleChange}
                    required
                    disabled={!formData.FechaRequeridaTurno || isLoadingHorarios}
                  >
                    <option value="">
                      {!formData.FechaRequeridaTurno 
                        ? "Primero seleccione una fecha"
                        : isLoadingHorarios 
                          ? "Cargando horarios..."
                          : horariosDisponibles.length === 0 
                            ? "No hay horarios disponibles"
                            : "Seleccione un horario"
                      }
                    </option>
                    {horariosDisponibles.map((horarioObj, index) => (
                      <option key={`horario-${index}-${horarioObj.value}`} value={horarioObj.value}>
                        {horarioObj.label}
                      </option>
                    ))}
                  </select>
                  <small className="form-text text-muted">
                    Solo se muestran horarios disponibles (máximo 5 turnos por hora)
                  </small>
                </div>

                {/* Observaciones */}
                <div className="mb-3">
                  <label htmlFor="InformeTurno" className="form-label">
                    <span className="material-symbols-outlined me-1">note_add</span>
                    Observaciones
                  </label>
                  <textarea
                    className="form-control"
                    id="InformeTurno"
                    name="InformeTurno"
                    rows="3"
                    value={formData.InformeTurno}
                    onChange={handleChange}
                    placeholder="Describa brevemente el motivo de su consulta o cualquier observación relevante..."
                    maxLength="500"
                  />
                  <small className="form-text text-muted">
                    Opcional. Máximo 500 caracteres ({formData.InformeTurno.length}/500)
                  </small>
                </div>

                {/* Orden médica */}
                <div className="mb-4">
                  <label htmlFor="ordenMedica" className="form-label">
                    <span className="material-symbols-outlined me-1">upload_file</span>
                    Orden médica (opcional)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="ordenMedica"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                  />
                  <small className="form-text text-muted">
                    Formatos permitidos: JPG, PNG, PDF. Tamaño máximo: 10MB
                  </small>
                  {ordenMedica && (
                    <div className="mt-2">
                      <div className="alert alert-success py-2">
                        <span className="material-symbols-outlined me-1">check_circle</span>
                        Archivo seleccionado: {ordenMedica.name}
                      </div>
                    </div>
                  )}
                </div>

                {/* Información importante */}
                <div className="alert alert-warning">
                  <h6 className="alert-heading">
                    <span className="material-symbols-outlined me-1">info</span>
                    Información importante
                  </h6>
                  <ul className="mb-0">
                    <li>Su solicitud será procesada por nuestro personal médico</li>
                    <li>Recibirá confirmación por email una vez procesada</li>
                    <li>Los turnos están sujetos a disponibilidad de profesionales</li>
                    <li>Máximo 5 turnos por horario</li>
                  </ul>
                </div>

                {/* Botones */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isLoading || !formData.FechaRequeridaTurno || !formData.HorarioRequeridoTurno}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Enviando solicitud...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined me-2">send</span>
                        Enviar Solicitud de Turno
                      </>
                    )}
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

export default TurnosWeb;