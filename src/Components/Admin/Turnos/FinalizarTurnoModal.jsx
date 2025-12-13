import React, { useState, useEffect } from 'react';
import { finalizarTurno, obtenerTratamientos, asignarTratamientoATurno } from '../../../Custom/CustomTurnos';
import { showSuccess, showError } from '../../../Utils/sweetAlerts';

const FinalizarTurnoModal = ({ isOpen, onClose, turnoData, onFinalizarSuccess }) => {
  const [formData, setFormData] = useState({
    observaciones: '',
    tratamientoId: ''
  });
  const [tratamientos, setTratamientos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTratamientos, setIsLoadingTratamientos] = useState(false);

  // Cargar informe actual cuando se abre el modal
  useEffect(() => {
    if (isOpen && turnoData) {
      // Llenar el formulario con los datos actuales del turno
      setFormData({
        observaciones: turnoData.InformeTurno || turnoData.ObservacionesFinal || turnoData.observacionesFinal || '',
        tratamientoId: turnoData.idTratamiento || ''
      });
      cargarTratamientos();
    }
  }, [isOpen, turnoData]);

  const cargarTratamientos = async () => {
    try {
      setIsLoadingTratamientos(true);
      const response = await obtenerTratamientos();
      // Filtrar solo tratamientos activos
      const tratamientosActivos = response.filter(tratamiento => tratamiento.IsActive === 1);
      setTratamientos(tratamientosActivos);
    } catch (error) {
      console.error('Error al cargar tratamientos:', error);
      showError('Error', 'No se pudieron cargar los tratamientos');
    } finally {
      setIsLoadingTratamientos(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Usar el ID correcto según lo que esté disponible
      const idTurno = turnoData?.idTurno || turnoData?.IdTurno;
      
      if (!idTurno) {
        showError('Error', 'No se pudo obtener el ID del turno');
        return;
      }

      console.log('ID del turno a actualizar:', idTurno);
      console.log('Informe a guardar:', formData.observaciones);

      // Preparar datos de actualización del informe
      const actualizacionData = {
        observacionesFinal: formData.observaciones || "",
        idEmpleado: turnoData.idEmpleado || turnoData.IdEmpleado || null
      };

      console.log('Datos enviados al backend:', actualizacionData);

      // Actualizar el informe del turno usando finalizarTurno
      const response = await finalizarTurno(idTurno, actualizacionData);
      console.log('Respuesta del servidor:', response);

      showSuccess('Éxito', 'Informe actualizado correctamente');
      
      onFinalizarSuccess();
      onClose();
    } catch (error) {
      console.error('Error al actualizar informe:', error);
      console.error('Detalles del error:', error.response?.data);
      
      // Verificar si es un error específico del backend
      if (error.response?.data?.message) {
        showError('Error', error.response.data.message);
      } else if (error.response?.status === 404) {
        showError('Error', 'Endpoint no encontrado. Verifique que el servidor esté funcionando correctamente.');
      } else {
        showError('Error', 'Error al actualizar el informe. Intente nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      observaciones: '',
      tratamientoId: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: '#0470BB', color: 'white' }}>
            <h5 className="modal-title">
              <span className="material-symbols-outlined me-2">edit_note</span>
              Editar Informe
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleCancel}
              disabled={isLoading}
            ></button>
          </div>

          <div className="modal-body">
            {turnoData && (
              <div className="mb-4">
                <div className="alert alert-info d-flex align-items-center">
                  <span className="material-symbols-outlined me-2">info</span>
                  <div>
                    <strong>Paciente:</strong> {turnoData.NombrePaciente} {turnoData.ApellidoPaciente} <br />
                    <strong>Tratamiento:</strong> {turnoData.NombreTratamiento} <br />
                    <strong>Horario:</strong> {turnoData.HorarioRequeridoTurno}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="observaciones" className="form-label">
                    <span className="material-symbols-outlined me-1">note_add</span>
                    Informe de la Sesión
                  </label>
                  <textarea
                    className="form-control"
                    id="observaciones"
                    name="observaciones"
                    rows="5"
                    placeholder="Ingrese el informe detallado de la sesión realizada..."
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    maxLength="500"
                  />
                  <div className="form-text">
                    {formData.observaciones.length}/500 caracteres
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined me-1">save</span>
                  Guardar Informe
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalizarTurnoModal;