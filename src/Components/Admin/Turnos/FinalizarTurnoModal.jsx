import React, { useState } from 'react';
import { finalizarTurno } from '../../../Custom/CustomTurnos';
import { showSuccess, showError } from '../../../Utils/sweetAlerts';

const FinalizarTurnoModal = ({ isOpen, onClose, turnoData, onFinalizarSuccess }) => {
  const [formData, setFormData] = useState({
    observaciones: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
      const finalizacionData = {
        observacionesFinal: formData.observaciones,
        idEmpleado: turnoData.idEmpleado || null
      };

      // Usar el ID correcto según lo que esté disponible
      const idTurno = turnoData?.IdTurno || turnoData?.idTurno;

      await finalizarTurno(idTurno, finalizacionData);
      
      showSuccess('Éxito', 'Turno finalizado correctamente');
      
      // Resetear formulario
      setFormData({
        observaciones: ''
      });
      
      onFinalizarSuccess();
      onClose();
    } catch (error) {
      console.error('Error al finalizar turno:', error);
      showError('Error', 'Error al finalizar el turno');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      observaciones: ''
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