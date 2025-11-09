import { useState } from 'react';
import { useCustomAsistencias } from '../../Custom/Asistencias/useCustomAsitencias';
import { useAuthStore } from '../../Store/useAuthStore';
import '../../Css/Asistencias/AsistenciaEmpleado.css';

const AsistenciaEmpleado = () => {
    const { user } = useAuthStore();
    const idEmpleado = user?.idEmpleado;

    const {
        asistencias,
        horariosSemanales,
        asistenciaActual,
        loading,
        filtros,
        setFiltros,
        registrarEntrada,
        registrarSalida,
        obtenerAsistenciasEmpleado,
        obtenerAsistenciasPorRango,
        filtrarPorMes,
        calcularEstadisticas
    } = useCustomAsistencias(idEmpleado);

    const [vistaActual, setVistaActual] = useState('horarios'); // 'horarios', 'historial'
    const [observaciones, setObservaciones] = useState('');
    const [mostrarObservaciones, setMostrarObservaciones] = useState(false);

    // Validar que el usuario tenga idEmpleado
    if (!user || !idEmpleado) {
        return (
            <div className="asistencia-empleado-container">
                <div className="alert alert-warning" style={{padding: '2rem', margin: '2rem', borderRadius: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffc107'}}>
                    <h3>⚠️ Acceso restringido</h3>
                    <p>No se pudo identificar al empleado. Por favor, inicia sesión nuevamente.</p>
                    <details>
                        <summary>Información de depuración</summary>
                        <pre>{JSON.stringify(user, null, 2)}</pre>
                    </details>
                </div>
            </div>
        );
    }

    // Días de la semana
    const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

    // Meses del año
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

    // Obtener el día actual
    const diaActual = diasSemana[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

    // Manejar registro de entrada
    const handleRegistrarEntrada = async () => {
        const exito = await registrarEntrada(observaciones);
        if (exito) {
            setObservaciones('');
            setMostrarObservaciones(false);
        }
    };

    // Manejar registro de salida
    const handleRegistrarSalida = async () => {
        const exito = await registrarSalida(observaciones);
        if (exito) {
            setObservaciones('');
            setMostrarObservaciones(false);
        }
    };

    // Formatear fecha
    const formatearFecha = (fecha) => {
        if (!fecha) return '-';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-AR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    };

    // Formatear hora
    const formatearHora = (hora) => {
        if (!hora) return '-';
        return hora.substring(0, 5);
    };

    // Calcular horas trabajadas
    const calcularHorasTrabajadas = (entrada, salida) => {
        if (!entrada || !salida) return '-';
        const timeEntrada = new Date(`2000-01-01T${entrada}`);
        const timeSalida = new Date(`2000-01-01T${salida}`);
        const diff = (timeSalida - timeEntrada) / (1000 * 60 * 60);
        return `${Math.floor(diff)}h ${Math.round((diff % 1) * 60)}min`;
    };

    // Buscar por rango de fechas
    const buscarPorRango = () => {
        if (filtros.fechaInicio && filtros.fechaFin) {
            obtenerAsistenciasPorRango(filtros.fechaInicio, filtros.fechaFin);
        }
    };

    // Buscar por mes
    const buscarPorMes = () => {
        if (filtros.mes && filtros.anio) {
            filtrarPorMes(parseInt(filtros.mes), parseInt(filtros.anio));
        }
    };

    // Limpiar filtros
    const limpiarFiltros = () => {
        setFiltros({
            fechaInicio: '',
            fechaFin: '',
            mes: '',
            anio: new Date().getFullYear()
        });
        obtenerAsistenciasEmpleado();
    };

    // Obtener estadísticas
    const estadisticas = calcularEstadisticas();

    // Obtener hora actual
    const horaActual = new Date().toLocaleTimeString('es-AR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    return (
        <div className="asistencia-empleado-container">
            <div className="asistencia-header">
                <h1>Control de Asistencias</h1>
                <div className="hora-actual">
                    <i className="fas fa-clock"></i>
                    <span>{horaActual}</span>
                </div>
            </div>

            {/* Sección de registro de entrada/salida */}
            <div className="registro-asistencia-card">
                <div className="registro-header">
                    <h2>
                        <i className="fas fa-calendar-check"></i>
                        Registro de Jornada
                    </h2>
                    <span className="fecha-hoy">
                        {new Date().toLocaleDateString('es-AR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                        })}
                    </span>
                </div>

                <div className="registro-body">
                    {!asistenciaActual ? (
                        <div className="registro-entrada">
                            <div className="registro-info">
                                <i className="fas fa-sign-in-alt"></i>
                                <div>
                                    <h3>Marcar Inicio de Jornada</h3>
                                    <p>Registra tu hora de entrada al iniciar tu turno</p>
                                </div>
                            </div>
                            
                            <button 
                                className="btn-registrar btn-entrada"
                                onClick={() => setMostrarObservaciones(!mostrarObservaciones)}
                            >
                                <i className="fas fa-play-circle"></i>
                                INICIAR JORNADA
                            </button>

                            {mostrarObservaciones && (
                                <div className="observaciones-section">
                                    <textarea
                                        placeholder="Observaciones (opcional)"
                                        value={observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        rows="3"
                                    />
                                    <div className="observaciones-actions">
                                        <button 
                                            className="btn-confirmar"
                                            onClick={handleRegistrarEntrada}
                                        >
                                            Confirmar Entrada
                                        </button>
                                        <button 
                                            className="btn-cancelar"
                                            onClick={() => {
                                                setMostrarObservaciones(false);
                                                setObservaciones('');
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="registro-salida">
                            <div className="jornada-activa">
                                <div className="jornada-info">
                                    <i className="fas fa-clock"></i>
                                    <div>
                                        <h3>Jornada Activa</h3>
                                        <p>Entrada registrada a las {formatearHora(asistenciaActual.HoraEntrada)}</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                className="btn-registrar btn-salida"
                                onClick={() => setMostrarObservaciones(!mostrarObservaciones)}
                            >
                                <i className="fas fa-stop-circle"></i>
                                FINALIZAR JORNADA
                            </button>

                            {mostrarObservaciones && (
                                <div className="observaciones-section">
                                    <textarea
                                        placeholder="Observaciones (opcional)"
                                        value={observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        rows="3"
                                    />
                                    <div className="observaciones-actions">
                                        <button 
                                            className="btn-confirmar"
                                            onClick={handleRegistrarSalida}
                                        >
                                            Confirmar Salida
                                        </button>
                                        <button 
                                            className="btn-cancelar"
                                            onClick={() => {
                                                setMostrarObservaciones(false);
                                                setObservaciones('');
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Navegación entre vistas */}
            <div className="tabs-container">
                <button 
                    className={`tab-btn ${vistaActual === 'horarios' ? 'active' : ''}`}
                    onClick={() => setVistaActual('horarios')}
                >
                    <i className="fas fa-calendar-week"></i>
                    Horarios Semanales
                </button>
                <button 
                    className={`tab-btn ${vistaActual === 'historial' ? 'active' : ''}`}
                    onClick={() => setVistaActual('historial')}
                >
                    <i className="fas fa-history"></i>
                    Historial de Asistencias
                </button>
            </div>

            {/* Vista de Horarios Semanales */}
            {vistaActual === 'horarios' && (
                <div className="horarios-semanales-card">
                    <h2>
                        <i className="fas fa-calendar-alt"></i>
                        Mis Horarios de la Semana
                    </h2>
                    
                    {loading ? (
                        <div className="loading">
                            <i className="fas fa-spinner fa-spin"></i>
                            Cargando horarios...
                        </div>
                    ) : horariosSemanales.length === 0 ? (
                        <div className="sin-datos">
                            <i className="fas fa-calendar-times"></i>
                            <p>No tienes horarios asignados</p>
                        </div>
                    ) : (
                        <div className="horarios-grid">
                            {diasSemana.map((dia) => {
                                const horario = horariosSemanales.find(h => h.DiaSemana === dia);
                                const esHoy = dia === diaActual;
                                
                                return (
                                    <div 
                                        key={dia} 
                                        className={`horario-card ${esHoy ? 'dia-actual' : ''} ${!horario ? 'sin-horario' : ''}`}
                                    >
                                        <div className="horario-dia">
                                            {dia}
                                            {esHoy && <span className="badge-hoy">HOY</span>}
                                        </div>
                                        {horario ? (
                                            <div className="horario-horas">
                                                <div className="hora-item">
                                                    <i className="fas fa-sign-in-alt"></i>
                                                    <span>{formatearHora(horario.HoraEntradaEsperada)}</span>
                                                </div>
                                                <div className="separador">-</div>
                                                <div className="hora-item">
                                                    <i className="fas fa-sign-out-alt"></i>
                                                    <span>{formatearHora(horario.HoraSalidaEsperada)}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="sin-horario-text">
                                                <i className="fas fa-times-circle"></i>
                                                <span>Sin horario</span>
                                            </div>
                                        )}
                                        {horario && horario.DescripcionHorario && (
                                            <div className="horario-descripcion">
                                                {horario.DescripcionHorario}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Vista de Historial de Asistencias */}
            {vistaActual === 'historial' && (
                <div className="historial-card">
                    <h2>
                        <i className="fas fa-list-alt"></i>
                        Historial de Asistencias
                    </h2>

                    {/* Filtros */}
                    <div className="filtros-container">
                        <div className="filtros-group">
                            <h3>
                                <i className="fas fa-filter"></i>
                                Filtrar por:
                            </h3>
                            
                            <div className="filtro-row">
                                <div className="filtro-item">
                                    <label>Rango de Fechas:</label>
                                    <div className="fecha-inputs">
                                        <input
                                            type="date"
                                            value={filtros.fechaInicio}
                                            onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
                                        />
                                        <span>hasta</span>
                                        <input
                                            type="date"
                                            value={filtros.fechaFin}
                                            onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
                                        />
                                        <button 
                                            className="btn-buscar"
                                            onClick={buscarPorRango}
                                            disabled={!filtros.fechaInicio || !filtros.fechaFin}
                                        >
                                            <i className="fas fa-search"></i>
                                            Buscar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="filtro-row">
                                <div className="filtro-item">
                                    <label>Por Mes:</label>
                                    <div className="mes-inputs">
                                        <select
                                            value={filtros.mes}
                                            onChange={(e) => setFiltros({...filtros, mes: e.target.value})}
                                        >
                                            <option value="">Seleccionar mes</option>
                                            {meses.map(mes => (
                                                <option key={mes.valor} value={mes.valor}>
                                                    {mes.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            min="2020"
                                            max="2030"
                                            value={filtros.anio}
                                            onChange={(e) => setFiltros({...filtros, anio: e.target.value})}
                                        />
                                        <button 
                                            className="btn-buscar"
                                            onClick={buscarPorMes}
                                            disabled={!filtros.mes}
                                        >
                                            <i className="fas fa-search"></i>
                                            Buscar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button className="btn-limpiar" onClick={limpiarFiltros}>
                                <i className="fas fa-times"></i>
                                Limpiar Filtros
                            </button>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="estadisticas-container">
                        <div className="estadistica-card">
                            <i className="fas fa-calendar-day"></i>
                            <div>
                                <span className="estadistica-valor">{estadisticas.totalDias}</span>
                                <span className="estadistica-label">Total Días</span>
                            </div>
                        </div>
                        <div className="estadistica-card">
                            <i className="fas fa-clock"></i>
                            <div>
                                <span className="estadistica-valor">{estadisticas.horasTrabajadas}h</span>
                                <span className="estadistica-label">Horas Trabajadas</span>
                            </div>
                        </div>
                        <div className="estadistica-card success">
                            <i className="fas fa-check-circle"></i>
                            <div>
                                <span className="estadistica-valor">{estadisticas.diasCompletos}</span>
                                <span className="estadistica-label">Días Completos</span>
                            </div>
                        </div>
                        <div className="estadistica-card warning">
                            <i className="fas fa-exclamation-triangle"></i>
                            <div>
                                <span className="estadistica-valor">{estadisticas.diasIncompletos}</span>
                                <span className="estadistica-label">Días Incompletos</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de asistencias */}
                    <div className="tabla-container">
                        {loading ? (
                            <div className="loading">
                                <i className="fas fa-spinner fa-spin"></i>
                                Cargando asistencias...
                            </div>
                        ) : asistencias.length === 0 ? (
                            <div className="sin-datos">
                                <i className="fas fa-inbox"></i>
                                <p>No hay registros de asistencias</p>
                            </div>
                        ) : (
                            <table className="tabla-asistencias">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Entrada</th>
                                        <th>Salida</th>
                                        <th>Horas Trabajadas</th>
                                        <th>Observaciones</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {asistencias.map((asistencia) => (
                                        <tr key={asistencia.idAsistencia}>
                                            <td>{formatearFecha(asistencia.Fecha)}</td>
                                            <td>
                                                <span className="hora-badge entrada">
                                                    {formatearHora(asistencia.HoraEntrada)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`hora-badge ${asistencia.HoraSalida ? 'salida' : 'pendiente'}`}>
                                                    {formatearHora(asistencia.HoraSalida) || 'Pendiente'}
                                                </span>
                                            </td>
                                            <td>
                                                {calcularHorasTrabajadas(asistencia.HoraEntrada, asistencia.HoraSalida)}
                                            </td>
                                            <td>
                                                {asistencia.Observaciones ? (
                                                    <span className="observaciones-badge" title={asistencia.Observaciones}>
                                                        <i className="fas fa-comment"></i>
                                                        {asistencia.Observaciones.substring(0, 30)}
                                                        {asistencia.Observaciones.length > 30 && '...'}
                                                    </span>
                                                ) : (
                                                    <span className="sin-observaciones">-</span>
                                                )}
                                            </td>
                                            <td>
                                                {asistencia.HoraSalida ? (
                                                    <span className="estado-badge completado">
                                                        <i className="fas fa-check-circle"></i>
                                                        Completado
                                                    </span>
                                                ) : (
                                                    <span className="estado-badge activo">
                                                        <i className="fas fa-clock"></i>
                                                        En curso
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AsistenciaEmpleado;
