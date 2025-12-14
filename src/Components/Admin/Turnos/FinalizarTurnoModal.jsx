import { useState, useEffect } from 'react';
import { finalizarTurno, obtenerTratamientos } from '../../../Custom/CustomTurnos';
import { showSuccess, showError } from '../../../Utils/sweetAlerts';

const FinalizarTurnoModal = ({ isOpen, onClose, turnoData, onFinalizarSuccess }) => {
  const [formData, setFormData] = useState({
    observaciones: '',
    tratamientoId: ''
  });
  const [tratamientos, setTratamientos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTratamientos, setIsLoadingTratamientos] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarTratamientos();
    }
  }, [isOpen]);

  const cargarTratamientos = async () => {
    try {
      setIsLoadingTratamientos(true);
      const response = await obtenerTratamientos();
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
      const idTurno = turnoData?.IdTurno || turnoData?.idTurno;
      
      if (!idTurno) {
        showError('Error', 'No se pudo obtener el ID del turno');
        return;
      }
      
      const finalizacionData = {
        observacionesFinal: formData.observaciones || "",
        idEmpleado: turnoData.idEmpleado || turnoData.IdEmpleado || null,
        idTratamiento: formData.tratamientoId ? parseInt(formData.tratamientoId) : null
      };
      
      await finalizarTurno(idTurno, finalizacionData);
      showSuccess('Éxito', 'Turno finalizado correctamente');
      
      setFormData({
        observaciones: '',
        tratamientoId: ''
      });
      
      onFinalizarSuccess();
      onClose();
    } catch (error) {
      console.error('Error al finalizar turno:', error);
      if (error.response?.data?.message) {
        showError('Error', error.response.data.message);
      } else if (error.response?.status === 404) {
        showError('Error', 'Endpoint no encontrado. Verifique que el servidor esté funcionando correctamente.');
      } else {
        showError('Error', 'Error al finalizar el turno. Intente nuevamente.');
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
              <span className="material-symbols-outlined me-2">check_circle</span>
              Finalizar Turno
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
                    <strong>Paciente:</strong> {turnoData.NombrePaciente} <br />
                    <strong>Servicio:</strong> {turnoData.Servicio} <br />
                    <strong>Horario:</strong> {turnoData.HoraInicio} - {turnoData.HoraFin}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="tratamientos" className="form-label">
                    <span className="material-symbols-outlined me-1">healing</span>
                    Tratamiento
                  </label>
                  <select
                    className="form-select"
                    id="tratamientos"
                    name="tratamientoId"
                    value={formData.tratamientoId}
                    onChange={handleInputChange}
                    disabled={isLoadingTratamientos || isLoading}
                  >
                    <option value="">Seleccione un tratamiento</option>
                    {tratamientos.map(tratamiento => (
                      <option key={tratamiento.idTratamiento} value={tratamiento.idTratamiento}>
                        {tratamiento.NombreTratamiento}
                      </option>
                    ))}
                  </select>
                  {isLoadingTratamientos && (
                    <div className="form-text text-muted">
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Cargando tratamientos...
                    </div>
                  )}
                </div>

                <div className="col-12 mb-3">
                  <label htmlFor="observaciones" className="form-label">
                    <span className="material-symbols-outlined me-1">note_add</span>
                    Observaciones Finales de la Sesión
                  </label>
                  <textarea
                    className="form-control"
                    id="observaciones"
                    name="observaciones"
                    rows="5"
                    placeholder="Ingrese observaciones finales sobre la sesión realizada..."
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
                  Finalizando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined me-1">check_circle</span>
                  Finalizar Turno
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