import { useState, useEffect } from 'react';
import { obtenerEmpleadosActivos } from '../../../Custom/Asistencias/useCustomAsistenciasAdmin';

const AsistenciasFiltrar = ({ filtros, onFiltrosChange, onAplicarFiltros, onLimpiarFiltros }) => {
  const [empleados, setEmpleados] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState('todos');

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const data = await obtenerEmpleadosActivos();
        setEmpleados(data);
      } catch (error) {
        console.error('Error al cargar empleados:', error);
      }
    };
    fetchEmpleados();
  }, []);

  const handleChange = (field, value) => {
    onFiltrosChange({ ...filtros, [field]: value });
  };

  const meses = [
    { valor: 1, nombre: 'Enero' },
    { valor: 2, nombre: 'Febrero' },
    { valor: 3, nombre: 'Marzo' },
    { valor: 4, nombre: 'Abril' },
    { valor: 5, nombre: 'Mayo' },
    { valor: 6, nombre: 'Junio' },
    { valor: 7, nombre: 'Julio' },
    { valor: 8, nombre: 'Agosto' },
    { valor: 9, nombre: 'Septiembre' },
    { valor: 10, nombre: 'Octubre' },
    { valor: 11, nombre: 'Noviembre' },
    { valor: 12, nombre: 'Diciembre' }
  ];

  return (
    <div className="asistencias-filtrar-card">
      <div className="filtrar-header">
        <h3><i className="fas fa-filter"></i> Filtrar Asistencias</h3>
      </div>

      <div className="filtrar-body">
        <div className="filtro-row">
          <div className="filtro-busqueda">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Buscar por nombre o DNI..."
              value={filtros.busqueda}
              onChange={(e) => handleChange('busqueda', e.target.value)}
            />
          </div>
        </div>

        <div className="filtro-row">
          <div className="filtro-tipo-buttons">
            <button
              className={`filtro-tipo-btn ${tipoFiltro === 'todos' ? 'active' : ''}`}
              onClick={() => setTipoFiltro('todos')}
            >
              <i className="fas fa-list"></i> Todos
            </button>
            <button
              className={`filtro-tipo-btn ${tipoFiltro === 'empleado' ? 'active' : ''}`}
              onClick={() => setTipoFiltro('empleado')}
            >
              <i className="fas fa-user"></i> Por Empleado
            </button>
            <button
              className={`filtro-tipo-btn ${tipoFiltro === 'fecha' ? 'active' : ''}`}
              onClick={() => setTipoFiltro('fecha')}
            >
              <i className="fas fa-calendar-day"></i> Por Día
            </button>
            <button
              className={`filtro-tipo-btn ${tipoFiltro === 'mes' ? 'active' : ''}`}
              onClick={() => setTipoFiltro('mes')}
            >
              <i className="fas fa-calendar-alt"></i> Por Mes
            </button>
          </div>
        </div>

        {tipoFiltro === 'empleado' && (
          <div className="filtro-row">
            <div className="filtro-item">
              <label><i className="fas fa-user"></i> Seleccionar Empleado</label>
              <select
                value={filtros.empleado}
                onChange={(e) => handleChange('empleado', e.target.value)}
              >
                <option value="">Todos los empleados</option>
                {empleados.map(emp => (
                  <option key={emp.idEmpleado} value={emp.idEmpleado}>
                    {emp.NombreEmpleado} {emp.ApellidoEmpleado} - DNI: {emp.DNI}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {tipoFiltro === 'fecha' && (
          <div className="filtro-row">
            <div className="filtro-item">
              <label><i className="fas fa-calendar-day"></i> Fecha</label>
              <input
                type="date"
                value={filtros.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)}
              />
            </div>
          </div>
        )}

        {tipoFiltro === 'mes' && (
          <div className="filtro-row">
            <div className="filtro-item">
              <label><i className="fas fa-calendar-alt"></i> Mes</label>
              <select
                value={filtros.mes}
                onChange={(e) => handleChange('mes', e.target.value)}
              >
                <option value="">Seleccionar mes</option>
                {meses.map(mes => (
                  <option key={mes.valor} value={mes.valor}>
                    {mes.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="filtro-item">
              <label><i className="fas fa-calendar"></i> Año</label>
              <input
                type="number"
                min="2020"
                max="2030"
                value={filtros.anio}
                onChange={(e) => handleChange('anio', e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="filtro-actions">
          <button className="btn-aplicar" onClick={onAplicarFiltros}>
            <i className="fas fa-check"></i> Aplicar Filtros
          </button>
          <button className="btn-limpiar" onClick={onLimpiarFiltros}>
            <i className="fas fa-times"></i> Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsistenciasFiltrar;
