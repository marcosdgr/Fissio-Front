import React, { useState, useEffect } from 'react';
import { solicitarTurno, getDisponibilidadHorarios } from '../../../Custom/CustomTurnos';
import { showSuccess, showError } from '../../../Utils/sweetAlerts';

const SolicitarTurnoModal = ({ isOpen, onClose, onSolicitudExitosa }) => {
  const [formData, setFormData] = useState({
    dniPaciente: '',
    fechaRequerida: '',
    horarioRequerido: '',
    observaciones: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [errores, setErrores] = useState({});

  // Función para cargar horarios disponibles
  const cargarHorariosDisponibles = async (fecha) => {
    if (!fecha) {
      setHorariosDisponibles([]);
      return;
    }

    setLoadingHorarios(true);
    try {
      const response = await getDisponibilidadHorarios(fecha);
      setHorariosDisponibles(response.horariosDisponibles || []);
      
      // Limpiar horario seleccionado si ya no está disponible
      if (formData.horarioRequerido && !response.horariosDisponibles?.some(h => h.value === formData.horarioRequerido)) {
        setFormData(prev => ({ ...prev, horarioRequerido: '' }));
      }
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      setHorariosDisponibles([]);
      showError('Error', 'No se pudieron cargar los horarios disponibles');
    } finally {
      setLoadingHorarios(false);
    }
  };

  // Cargar horarios cuando cambia la fecha
  useEffect(() => {
    cargarHorariosDisponibles(formData.fechaRequerida);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.fechaRequerida]);

  // Función para validar el formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.dniPaciente.trim()) {
      nuevosErrores.dniPaciente = 'El DNI del paciente es requerido';
    } else if (!/^[0-9]{7,8}$/.test(formData.dniPaciente.trim())) {
      nuevosErrores.dniPaciente = 'El DNI debe tener 7 u 8 dígitos numéricos';
    }

    if (!formData.fechaRequerida) {
      nuevosErrores.fechaRequerida = 'La fecha requerida es obligatoria';
    }

    if (!formData.horarioRequerido) {
      nuevosErrores.horarioRequerido = 'Debe seleccionar un horario disponible';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario antes de enviar
    if (!validarFormulario()) {
      return; // No cerrar modal, solo mostrar errores
    }

    setIsLoading(true);

    try {
      const turnoData = {
        DNIPaciente: formData.dniPaciente,
        FechaRequeridaTurno: formData.fechaRequerida,
        HorarioRequeridoTurno: formData.horarioRequerido,
        InformeTurno: formData.observaciones 
      };

      await solicitarTurno(turnoData);
      
      showSuccess('Éxito', 'Turno solicitado correctamente');
      
      // Resetear formulario
      setFormData({
        dniPaciente: '',
        fechaRequerida: '',
        horarioRequerido: '',
        observaciones: ''
      });
      setHorariosDisponibles([]);
      setErrores({});
      
      onSolicitudExitosa();
      onClose();
    } catch (error) {
      console.error('Error al solicitar turno:', error);
      const errorMessage = error.response?.data?.message || 'Error al solicitar el turno';
      showError('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      dniPaciente: '',
      fechaRequerida: '',
      horarioRequerido: '',
      observaciones: ''
    });
    setHorariosDisponibles([]);
    setErrores({});
    onClose();
  };

  // Obtener fecha mínima (hoy)
  const fechaMinima = new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: '#0470BB', color: 'white' }}>
            <h5 className="modal-title">
              <span className="material-symbols-outlined me-2">add_circle</span>
              Solicitar Nuevo Turno
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleCancel}
              disabled={isLoading}
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="dniPaciente" className="form-label">
                    <span className="material-symbols-outlined me-1">badge</span>
                    DNI del Paciente *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errores.dniPaciente ? 'is-invalid' : ''}`}
                    id="dniPaciente"
                    name="dniPaciente"
                    placeholder="Ingrese el DNI del paciente"
                    value={formData.dniPaciente}
                    onChange={handleInputChange}
                    required
                    maxLength="8"
                    pattern="[0-9]{7,8}"
                  />
                  {errores.dniPaciente && (
                    <div className="invalid-feedback">
                      {errores.dniPaciente}
                    </div>
                  )}
                  <div className="form-text">
                    DNI sin puntos ni espacios (7-8 dígitos)
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="fechaRequerida" className="form-label">
                    <span className="material-symbols-outlined me-1">calendar_today</span>
                    Fecha Requerida *
                  </label>
                  <input
                    type="date"
                    className={`form-control ${errores.fechaRequerida ? 'is-invalid' : ''}`}
                    id="fechaRequerida"
                    name="fechaRequerida"
                    value={formData.fechaRequerida}
                    onChange={handleInputChange}
                    min={fechaMinima}
                    required
                  />
                  {errores.fechaRequerida && (
                    <div className="invalid-feedback">
                      {errores.fechaRequerida}
                    </div>
                  )}
                </div>

                <div className="col-12 mb-3">
                  <label htmlFor="horarioRequerido" className="form-label">
                    <span className="material-symbols-outlined me-1">schedule</span>
                    Horario Requerido *
                  </label>
                  <select
                    className={`form-select ${errores.horarioRequerido ? 'is-invalid' : ''}`}
                    id="horarioRequerido"
                    name="horarioRequerido"
                    value={formData.horarioRequerido}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.fechaRequerida || loadingHorarios}
                  >
                    <option value="">
                      {!formData.fechaRequerida 
                        ? 'Primero seleccione una fecha' 
                        : loadingHorarios 
                        ? 'Cargando horarios...' 
                        : 'Seleccione un horario disponible'
                      }
                    </option>
                    {horariosDisponibles.map((horario) => (
                      <option key={horario.value} value={horario.value}>
                        {horario.label}
                      </option>
                    ))}
                  </select>
                  {errores.horarioRequerido && (
                    <div className="invalid-feedback">
                      {errores.horarioRequerido}
                    </div>
                  )}
                  <div className="form-text">
                    {formData.fechaRequerida && horariosDisponibles.length === 0 && !loadingHorarios
                      ? 'No hay horarios disponibles para esta fecha'
                      : 'Seleccione un horario con disponibilidad'
                    }
                  </div>
                </div>

                <div className="col-12 mb-3">
                  <label htmlFor="observaciones" className="form-label">
                    <span className="material-symbols-outlined me-1">note_add</span>
                    Observaciones (Opcional)
                  </label>
                  <textarea
                    className="form-control"
                    id="observaciones"
                    name="observaciones"
                    rows="3"
                    placeholder="Ingrese observaciones adicionales para el turno..."
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    maxLength="300"
                  />
                  <div className="form-text">
                    {formData.observaciones.length}/300 caracteres
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <span className="material-symbols-outlined me-1">cancel</span>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn text-white"
              style={{ backgroundColor: '#0470BB' }}
              onClick={handleSubmit}
              disabled={isLoading || !formData.dniPaciente || !formData.fechaRequerida || !formData.horarioRequerido}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Solicitando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined me-1">add_circle</span>
                  Solicitar Turno
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitarTurnoModal;