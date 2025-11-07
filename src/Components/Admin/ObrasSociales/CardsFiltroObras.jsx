import React from 'react';
import useCustomObrasSociales from '../../../Custom/ObrasSociales/useCustomObrasSociales';

const Card = ({ title, count, active, onClick }) => (
  <div className={`stats-card card text-center clickable ${active ? 'active' : ''} stats-card--compact`} onClick={onClick} role="button">
    <div className="card-body">
      <div className="small text-muted">{title}</div>
      <div className="stats-value">{count}</div>
    </div>
  </div>
);

const CardsFiltroObras = ({ selected = 'Todas', onSelect, refreshKey }) => {
  const { obrasSociales = [], obtenerTodasLasObrasSociales } = useCustomObrasSociales();

  React.useEffect(() => {
    if (typeof refreshKey !== 'undefined') {
      obtenerTodasLasObrasSociales && obtenerTodasLasObrasSociales();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const counts = React.useMemo(() => {
    let total = 0, act = 0, inac = 0;
    (obrasSociales || []).forEach(o => {
      total += 1;
      if (o.IsActive === 0 || o.IsActive === false) {
        inac += 1;
      } else {
        act += 1;
      }
    });
    return { total, act, inac };
  }, [obrasSociales]);

  return (
    <div className="row mb-3 cards-filtro-wrapper g-2">
      <div className="col-md-4 mb-3 mb-md-0 px-1">
        <Card title="Todas" count={counts.total} active={selected === 'Todas'} onClick={() => onSelect && onSelect('Todas')} />
      </div>
      <div className="col-md-4 mb-3 mb-md-0 px-1">
        <Card title="Activas" count={counts.act} active={selected === 'Activas'} onClick={() => onSelect && onSelect('Activas')} />
      </div>
      <div className="col-md-4 mb-3 mb-md-0 px-1">
        <Card title="Inactivas" count={counts.inac} active={selected === 'Inactivas'} onClick={() => onSelect && onSelect('Inactivas')} />
      </div>
    </div>
  );
};

export default CardsFiltroObras;
