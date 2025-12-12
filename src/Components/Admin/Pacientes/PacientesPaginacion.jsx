const PacientesPaginacion = ({ 
  paginaActual, 
  totalPaginas, 
  onCambioPagina, 
  totalRegistros, 
  registrosPorPagina 
}) => {
  if (totalPaginas <= 1) return null

  const paginasVisibles = []
  const maxPaginasVisibles = 5

  let inicio = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2))
  let fin = Math.min(totalPaginas, inicio + maxPaginasVisibles - 1)

  if (fin - inicio < maxPaginasVisibles - 1) {
    inicio = Math.max(1, fin - maxPaginasVisibles + 1)
  }

  for (let i = inicio; i <= fin; i++) {
    paginasVisibles.push(i)
  }

  const indiceInicio = (paginaActual - 1) * registrosPorPagina + 1
  const indiceFin = Math.min(paginaActual * registrosPorPagina, totalRegistros)

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
      <div className="mb-2 mb-md-0">
        <small className="text-muted">
          Mostrando {indiceInicio} a {indiceFin} de {totalRegistros} pacientes
        </small>
      </div>

      <nav aria-label="Paginación de pacientes">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link"
              onClick={() => onCambioPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              aria-label="Página anterior"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
          </li>

          {inicio > 1 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => onCambioPagina(1)}>
                  1
                </button>
              </li>
              {inicio > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}

          {paginasVisibles.map(pagina => (
            <li key={pagina} className={`page-item ${pagina === paginaActual ? 'active' : ''}`}>
              <button 
                className="page-link"
                onClick={() => onCambioPagina(pagina)}
                aria-label={`Página ${pagina}`}
                aria-current={pagina === paginaActual ? 'page' : undefined}
              >
                {pagina}
              </button>
            </li>
          ))}

          {fin < totalPaginas && (
            <>
              {fin < totalPaginas - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className="page-item">
                <button className="page-link" onClick={() => onCambioPagina(totalPaginas)}>
                  {totalPaginas}
                </button>
              </li>
            </>
          )}

          <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
            <button 
              className="page-link"
              onClick={() => onCambioPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              aria-label="Página siguiente"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default PacientesPaginacion