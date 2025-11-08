const PacientesHeader = ({ onCreateClick }) => {
  return (
    <div className="servicios-header">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="servicios-title">
            <span className="material-symbols-outlined me-2">groups</span>
            Gestión de Pacientes
          </h2>
          <p className="servicios-subtitle">Administra los pacientes de la clínica</p>
        </div>
        <button className="btn btn-fissio-primary" onClick={onCreateClick}>
          <span className="material-symbols-outlined me-1">person_add</span>
          Nuevo Paciente
        </button>
      </div>
    </div>
  )
}

export default PacientesHeader