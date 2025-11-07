import React, { useState } from 'react';

// Versión trainee: componente simple que llama onSearch inmediatamente al cambiar
const BusquedaObrasSociales = ({ onSearch, placeholder = 'Buscar obras sociales...' }) => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    // llamamos al parent sin debounce (nivel trainee)
    onSearch(v);
  };

  return (
    <div className="mb-3 d-flex align-items-center">
      <input
        type="search"
        className="form-control me-2"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        style={{ maxWidth: 360 }}
      />
      <button className="btn btn-outline-secondary" onClick={() => { setValue(''); onSearch(''); }}>
        Limpiar
      </button>
    </div>
  );
};

export default BusquedaObrasSociales;
