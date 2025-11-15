import { useState, useEffect } from 'react';
import { useCustomAsistencias } from '../../Custom/Asistencias/useCustomAsitencias';
import { useAuthStore } from '../../Store/useAuthStore';
import { BASE_URL } from '../../Api/api';
import '../../Css/Asistencias/AsistenciaEmpleado.css';

const AsistenciaEmpleado = () => {
    const { user, login } = useAuthStore();
    // El usuario puede estar en user.usuario o directamente en user
    const userData = user?.usuario || user;
    const [idEmpleadoLocal, setIdEmpleadoLocal] = useState(userData?.idEmpleado || null);
    const [buscandoEmpleado, setBuscandoEmpleado] = useState(false);

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
        filtrarPorMes
    } = useCustomAsistencias(idEmpleadoLocal);

    const [vistaActual, setVistaActual] = useState('horarios'); // 'horarios', 'historial'
    const [observaciones, setObservaciones] = useState('');
    const [mostrarObservaciones, setMostrarObservaciones] = useState(false);

    // Si no tiene idEmpleado, buscarlo por idUsuario
    useEffect(() => {
        const buscarIdEmpleado = async () => {
            const userData = user?.usuario || user;
            if (userData && userData.NombreRol === 'Empleado' && !idEmpleadoLocal && !buscandoEmpleado) {
                setBuscandoEmpleado(true);
                try {
                    const response = await fetch(`${BASE_URL}api/empleados/v1/activos`);
                    const empleados = await response.json();
                    
                    if (response.ok) {
                        const empleado = empleados.find(emp => emp.idUsuario === userData.idUsuario);
                        if (empleado) {
                            setIdEmpleadoLocal(empleado.idEmpleado);
                            // Actualizar el store con el idEmpleado
                            login({
                                ...user,
                                idEmpleado: empleado.idEmpleado,
                                NombreEmpleado: empleado.NombreEmpleado,
                                ApellidoEmpleado: empleado.ApellidoEmpleado
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error al buscar empleado:', error);
                } finally {
                    setBuscandoEmpleado(false);
                }
            }
        };

        buscarIdEmpleado();
    }, [user, idEmpleadoLocal, buscandoEmpleado, login]);

    // Validar que el usuario esté logueado
    if (!user) {
        return (
            <div className="asistencia-empleado-container">
                <div className="alert alert-warning" style={{padding: '2rem', margin: '2rem', borderRadius: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffc107'}}>
                    <h3>⚠️ Acceso restringido</h3>
                    <p>Por favor, inicia sesión para acceder a esta sección.</p>
                </div>
            </div>
        );
    }

    // Validar que sea empleado
    if (userData.NombreRol !== 'Empleado') {
        return (
            <div className="asistencia-empleado-container">
                <div className="alert alert-warning" style={{padding: '2rem', margin: '2rem', borderRadius: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffc107'}}>
                    <h3>⚠️ Acceso restringido</h3>
                    <p>Esta sección es solo para empleados.</p>
                </div>
            </div>
        );
    }

    if (buscandoEmpleado) {
        return (
            <div className="asistencia-empleado-container">
                <div className="loading" style={{padding: '3rem', textAlign: 'center'}}>
                    <i className="fas fa-spinner fa-spin" style={{fontSize: '3rem', color: '#0470BB'}}></i>
                    <p style={{marginTop: '1rem', fontSize: '1.2rem'}}>Cargando datos del empleado...</p>
                </div>
            </div>
        );
    }

    if (!idEmpleadoLocal) {
        return (
            <div className="asistencia-empleado-container">
                <div className="alert alert-warning" style={{padding: '2rem', margin: '2rem', borderRadius: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffc107'}}>
                    <h3>⚠️ Error</h3>
                    <p>No se pudo encontrar el registro de empleado asociado a este usuario.</p>
                    <p>Por favor, contacta al administrador.</p>
                </div>
            </div>
        );
    }

    // Días de la semana
    const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];


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

    

    // Obtener estadísticas (se usa si quieres mantenerlas en otro lado)
    // const estadisticas = calcularEstadisticas();

    // Buscar por rango de fechas (mantener la funcionalidad de búsqueda)
    const buscarPorRango = () => {
        if (filtros.fechaInicio && filtros.fechaFin) {
            obtenerAsistenciasPorRango(filtros.fechaInicio, filtros.fechaFin);
        }
    };

    // Meses del año (para filtro por mes)
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

    // Buscar por mes y año
    const buscarPorMes = () => {
        if (filtros.mes && filtros.anio) {
            filtrarPorMes(parseInt(filtros.mes), parseInt(filtros.anio));
        }
    };

    // Limpiar filtros y recargar todas las asistencias
    const limpiarFiltros = () => {
        setFiltros({
            fechaInicio: '',
            fechaFin: '',
            mes: '',
            anio: new Date().getFullYear()
        });
        obtenerAsistenciasEmpleado();
    };

    // Obtener hora actual
    const horaActual = new Date().toLocaleTimeString('es-AR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    // Debug: ver qué horarios se están recibiendo
    console.log('🔍 Horarios semanales:', horariosSemanales);
    if (horariosSemanales.length > 0) {
        console.log('📋 Primer horario completo:', JSON.stringify(horariosSemanales[0], null, 2));
    }
    console.log('📅 Días semana array:', diasSemana);
    console.log('📆 Día actual:', diaActual);

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
                    ) : asistenciaActual.HoraSalida ? (
                        // Jornada completada
                        <div className="jornada-completada">
                            <div className="completada-info">
                                <i className="fas fa-check-circle"></i>
                                <div>
                                    <h3>Jornada Completada</h3>
                                    <p>Ya has registrado tu entrada y salida de hoy</p>
                                </div>
                            </div>
                            <div className="resumen-jornada">
                                <div className="resumen-item">
                                    <span className="resumen-label">Entrada:</span>
                                    <span className="resumen-valor">{formatearHora(asistenciaActual.HoraEntrada)}</span>
                                </div>
                                <div className="resumen-item">
                                    <span className="resumen-label">Salida:</span>
                                    <span className="resumen-valor">{formatearHora(asistenciaActual.HoraSalida)}</span>
                                </div>
                                <div className="resumen-item">
                                    <span className="resumen-label">Tiempo trabajado:</span>
                                    <span className="resumen-valor">
                                        {calcularHorasTrabajadas(asistenciaActual.HoraEntrada, asistenciaActual.HoraSalida)}
                                    </span>
                                </div>
                            </div>
                            {asistenciaActual.Observaciones && (
                                <div className="observaciones-completada">
                                    <i className="fas fa-comment"></i>
                                    <span>{asistenciaActual.Observaciones}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Jornada activa (con entrada pero sin salida)
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
                                // Buscar TODOS los horarios de este día
                                const horariosDelDia = horariosSemanales.filter(h => {
                                    if (!h.Fecha) return false;
                                    const fecha = new Date(h.Fecha);
                                    const diaSemanaIndex = fecha.getDay() === 0 ? 6 : fecha.getDay() - 1;
                                    const diaSemanaDelHorario = diasSemana[diaSemanaIndex];
                                    return diaSemanaDelHorario === dia;
                                });
                                
                                const esHoy = dia === diaActual;
                                
                                return (
                                    <div 
                                        key={dia} 
                                        className={`horario-card ${esHoy ? 'dia-actual' : ''} ${horariosDelDia.length === 0 ? 'sin-horario' : ''}`}
                                    >
                                        <div className="horario-dia">
                                            {dia}
                                            {esHoy && <span className="badge-hoy">HOY</span>}
                                        </div>
                                        {horariosDelDia.length > 0 ? (
                                            horariosDelDia.map((horario, index) => (
                                                <div key={index} className="horario-horas">
                                                    <div className="hora-item">
                                                        <i className="fas fa-sign-in-alt"></i>
                                                        <span>{formatearHora(horario.HoraEntradaEsperada) || 'No disponible'}</span>
                                                    </div>
                                                    <div className="separador">-</div>
                                                    <div className="hora-item">
                                                        <i className="fas fa-sign-out-alt"></i>
                                                        <span>{formatearHora(horario.HoraSalidaEsperada) || 'No disponible'}</span>
                                                    </div>
                                                    {horario.DescripcionHorario && (
                                                        <div className="horario-descripcion">
                                                            {horario.DescripcionHorario}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="sin-horario-text">
                                                <i className="fas fa-times-circle"></i>
                                                <span>No disponible</span>
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

                    {/* Filtro de búsqueda por rango de fechas */}
                    <div className="filtros-container">
                        <div className="filtros-group">
                            <h3>
                                <i className="fas fa-filter"></i>
                                Filtrar por rango de fechas
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

                            <div className="filtro-row mt-3">
                                <div className="filtro-item">
                                    <label>Por Mes:</label>
                                    <div className="mes-inputs d-flex align-items-center gap-2">
                                        <select
                                            value={filtros.mes}
                                            onChange={(e) => setFiltros({...filtros, mes: e.target.value})}
                                            className="form-select"
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
                                            className="form-control"
                                            style={{width: '120px'}}
                                        />
                                        <button 
                                            className="btn-buscar"
                                            onClick={buscarPorMes}
                                            disabled={!filtros.mes}
                                        >
                                            <i className="fas fa-search"></i>
                                            Buscar
                                        </button>
                                        <button className="btn-limpiar ms-2" onClick={limpiarFiltros}>
                                            <i className="fas fa-times"></i>
                                            Limpiar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas removidas por petición del usuario */}

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
