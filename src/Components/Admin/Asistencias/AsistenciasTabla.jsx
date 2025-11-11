const AsistenciasTabla = ({ asistencias, loading }) => {
  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatearHora = (hora) => {
    if (!hora) return '-';
    return hora.substring(0, 5); // HH:MM
  };

  const calcularHorasTrabajadas = (entrada, salida) => {
    if (!entrada || !salida) return '-';
    
    const [horasEntrada, minutosEntrada] = entrada.split(':').map(Number);
    const [horasSalida, minutosSalida] = salida.split(':').map(Number);
    
    const totalMinutosEntrada = horasEntrada * 60 + minutosEntrada;
    const totalMinutosSalida = horasSalida * 60 + minutosSalida;
    
    const diferenciaMinutos = totalMinutosSalida - totalMinutosEntrada;
    
    if (diferenciaMinutos < 0) return '-';
    
    const horas = Math.floor(diferenciaMinutos / 60);
    const minutos = diferenciaMinutos % 60;
    
    return `${horas}h ${minutos}m`;
  };

  if (loading) {
    return (
      <div className="asistencias-tabla-card">
        <div className="tabla-loading">
          <div className="spinner"></div>
          <p>Cargando asistencias...</p>
        </div>
      </div>
    );
  }

  if (asistencias.length === 0) {
    return (
      <div className="asistencias-tabla-card">
        <div className="tabla-empty">
          <i className="fas fa-clipboard-list"></i>
          <p>No se encontraron asistencias</p>
          <span>Intenta ajustar los filtros de búsqueda</span>
        </div>
      </div>
    );
  }

  // Console.log para debug - ver qué datos llegan
  if (asistencias.length > 0) {
    console.log('Datos de asistencias:', asistencias[0]);
  }

  return (
    <div className="asistencias-tabla-card">
      <div className="tabla-header">
        <h3>Registros de Asistencias</h3>
      </div>

      <div className="tabla-container">
        <table className="asistencias-tabla">
          <thead>
            <tr>
              <th><i className="fas fa-user"></i> Empleado</th>
              <th><i className="fas fa-id-card"></i> DNI</th>
              <th><i className="fas fa-calendar"></i> Fecha</th>
              <th><i className="fas fa-clock"></i> Entrada Esperada</th>
              <th><i className="fas fa-sign-in-alt"></i> Entrada Real</th>
              <th><i className="fas fa-clock"></i> Salida Esperada</th>
              <th><i className="fas fa-sign-out-alt"></i> Salida Real</th>
              <th><i className="fas fa-hourglass-half"></i> Horas Trabajadas</th>
              <th><i className="fas fa-comment"></i> Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((asistencia) => {
              // Obtener horarios esperados - pueden venir con diferentes nombres del backend
              const horaEntradaEsperada = asistencia.HoraEntradaEsperada || asistencia.HoraInicio || asistencia.horaInicio;
              const horaSalidaEsperada = asistencia.HoraSalidaEsperada || asistencia.HoraFin || asistencia.horaFin;

              return (
                <tr key={asistencia.idAsistencia}>
                  <td className="empleado-cell">
                    <div className="empleado-info">
                      <i className="fas fa-user-circle"></i>
                      <span>
                        {asistencia.NombreEmpleado} {asistencia.ApellidoEmpleado}
                      </span>
                    </div>
                  </td>
                  <td>{asistencia.DNI || '-'}</td>
                  <td>{formatearFecha(asistencia.Fecha)}</td>
                  <td className="hora-cell">
                    {formatearHora(horaEntradaEsperada)}
                  </td>
                  <td className="hora-cell">
                    {formatearHora(asistencia.HoraEntrada)}
                  </td>
                  <td className="hora-cell">
                    {formatearHora(horaSalidaEsperada)}
                  </td>
                  <td className="hora-cell">
                    {formatearHora(asistencia.HoraSalida)}
                  </td>
                  <td className="horas-trabajadas">
                    {calcularHorasTrabajadas(asistencia.HoraEntrada, asistencia.HoraSalida)}
                  </td>
                  <td className="observaciones-cell">
                    {asistencia.Observaciones ? (
                      <span className="observaciones-text" title={asistencia.Observaciones}>
                        {asistencia.Observaciones}
                      </span>
                    ) : (
                      <span className="sin-observaciones">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AsistenciasTabla;
