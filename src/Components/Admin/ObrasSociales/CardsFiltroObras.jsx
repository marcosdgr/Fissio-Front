import React from 'react';
import useCustomObrasSociales from '../../../Custom/ObrasSociales/useCustomObrasSociales';

const Card = ({ title, count, active, onClick, colorClass }) => (
  <div className={`card card-filtro ${active ? 'border-primary shadow-sm' : ''}`} onClick={onClick} style={{ cursor: 'pointer' }}>
    <div className="card-body d-flex align-items-center justify-content-between">
      <div>
        <div className="small text-muted">{title}</div>
        <div className="h5 mb-0">{count}</div>
      </div>
      <div>
        <span className={`badge ${colorClass} badge-filtro`} style={{ padding: '0.6rem 0.9rem', fontSize: '0.9rem' }}>{/* icon placeholder */}</span>
      </div>
    </div>
  </div>
);

const CardsFiltroObras = ({ selected = 'Todas', onSelect }) => {
  const { obrasSociales = [] } = useCustomObrasSociales();

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
    <div className="d-flex gap-3 mb-3 cards-filtro-wrapper">
      <Card title="Todas" count={counts.total} active={selected === 'Todas'} onClick={() => onSelect && onSelect('Todas')} colorClass="bg-primary text-white" />
      <Card title="Activas" count={counts.act} active={selected === 'Activas'} onClick={() => onSelect && onSelect('Activas')} colorClass="bg-success" />
      <Card title="Inactivas" count={counts.inac} active={selected === 'Inactivas'} onClick={() => onSelect && onSelect('Inactivas')} colorClass="bg-secondary" />
    </div>
  );
};

export default CardsFiltroObras;
