const MobileCards = ({ visible = [], onView = () => {}, onEdit = () => {}, onToggle = () => {} }) => (
  <div className="obras-cards">
    {visible.map(obra => (
      <div className="obra-card" key={(obra.idObraSocial ?? obra.id) || Math.random()}>
        <div className="d-flex justify-content-between">
          <div>
            <strong>{obra.NombreObraSocial ?? obra.Nombre ?? obra.nombre}</strong>
            <div className="meta">{obra.TelefonoObra ?? obra.telefono}</div>
            <div className="meta">{obra.EmailObra ?? obra.email}</div>
          </div>
          <div className="text-end">
            <span className={`badge ${obra.IsActive ? 'bg-success' : 'bg-warning text-dark'}`}>{obra.IsActive ? 'Activa' : 'Suspendida'}</span>
          </div>
        </div>
        <div className="mt-3 d-flex">
          <button className="btn btn-sm btn-outline-info me-2" onClick={() => onView(obra)}>Ver</button>
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => onEdit(obra)}>Editar</button>
          <button className={`btn btn-sm ${obra.IsActive ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => onToggle(obra)}>{obra.IsActive ? 'Desactivar' : 'Activar'}</button>
        </div>
      </div>
    ))}
  </div>
)

export default MobileCards
