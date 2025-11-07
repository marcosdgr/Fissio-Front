import React from 'react';
import { FaFilter, FaCheckCircle, FaPauseCircle, FaTrashAlt } from 'react-icons/fa';

const OPTIONS = [
  { key: 'Todas', label: 'Todas', icon: <FaFilter /> },
  { key: 'Activa', label: 'Activas', icon: <FaCheckCircle /> },
  { key: 'Suspendida', label: 'Suspendidas', icon: <FaPauseCircle /> },
  { key: 'Eliminadas', label: 'Eliminadas', icon: <FaTrashAlt /> }
];

const FiltrodeObras = ({ value = 'Todas', onChange }) => {
  return (
    <div className="d-flex align-items-center filtro-obras">
      <div className="me-2 text-muted small">Filtrar:</div>
      <div className="btn-group" role="group" aria-label="Filtro obras">
        {OPTIONS.map(opt => (
          <button
            key={opt.key}
            type="button"
            className={`btn btn-sm ${value === opt.key ? 'btn-outline-primary active' : 'btn-outline-secondary'}`}
            onClick={() => onChange && onChange(opt.key)}
            title={opt.label}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{opt.icon} <span className="d-none d-md-inline">{opt.label}</span></span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FiltrodeObras;
