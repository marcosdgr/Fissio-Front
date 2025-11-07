const ServiciosHeader = ({ onCreateClick }) => {
  return (
    <div className="servicios-header">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="servicios-title">
            <span className="material-symbols-outlined me-2">medical_services</span>
            Gestión de Servicios
          </h2>
          <p className="servicios-subtitle">Administra los servicios de kinesiología</p>
        </div>
        <button className="btn btn-fissio-primary" onClick={onCreateClick}>
          <span className="material-symbols-outlined me-1">add</span>
          Nuevo Servicio
        </button>
      </div>
    </div>
  )
}

export default ServiciosHeader