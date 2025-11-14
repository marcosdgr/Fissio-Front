// src/Components/Admin/Cobros/FormCobros.jsx
import React, { useState, useEffect } from 'react';
import useCustomCobros from '../../../Custom/useCustomCobros';
import useCustomPacientesCobros from '../../../Custom/useCustomPacientesCobros';
import useCustomTurnosCobros from '../../../Custom/useCustomTurnosCobros';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import "../../../Css/Cobros/FormCobros.css";

const FormCobros = ({ cobro, onSuccess }) => {
  const { agregarCobro, cobros } = useCustomCobros();
  const { pacientes } = useCustomPacientesCobros();
  const { turnos } = useCustomTurnosCobros();

  // Estados
  const [busqueda, setBusqueda] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [mostrarPacientes, setMostrarPacientes] = useState(false);

  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [mostrarTurnos, setMostrarTurnos] = useState(false);

  const [nuevoCobro, setNuevoCobro] = useState({
    FechaCobro: new Date().toISOString().split('T')[0],
    idTurno: '',
    TipoCobro: 'Paciente',
    idMedioPago: '',
    MontoCobro: '',
    Descripcion: ''
  });

  const [procesando, setProcesando] = useState(false);
  const [errores, setErrores] = useState({});

  // Cargar datos si es edición
  useEffect(() => {
    if (cobro) {
      setNuevoCobro({
        FechaCobro: cobro.FechaCobro.split('T')[0],
        idTurno: cobro.idTurno,
        TipoCobro: cobro.TipoCobro,
        idMedioPago: cobro.idMedioPago,
        MontoCobro: cobro.MontoCobro,
        Descripcion: cobro.Descripcion || ''
      });

      const turno = turnos.turnos.find(t => t.idTurno == cobro.idTurno);
      if (turno) {
        const pac = pacientes.pacientes.find(p => p.idPaciente == turno.idPaciente);
        setPacienteSeleccionado(pac);
        setBusqueda(`${pac.NombrePaciente} ${pac.ApellidoPaciente}`);
        setTurnoSeleccionado(turno);
      }
    }
  }, [cobro, pacientes, turnos]);

  // Filtrar pacientes al escribir
  const pacientesFiltrados = pacientes.pacientes
    .filter(p => {
      if (!busqueda.trim()) return false;
      const term = busqueda.toLowerCase().trim();
      const nombreCompleto = `${p.NombrePaciente} ${p.ApellidoPaciente}`.toLowerCase();
      const dni = p.DNI.toLowerCase();
      return nombreCompleto.includes(term) || dni.includes(term);
    })
    .slice(0, 6);

  // Todos los turnos del paciente seleccionado
  const turnosDelPaciente = turnos.turnos
    .filter(t => t.idPaciente == pacienteSeleccionado?.idPaciente)
    .map(t => ({
      ...t,
      label: `${new Date(t.FechaRequeridaTurno).toLocaleDateString('es-AR')} - ${t.HorarioRequeridoTurno?.slice(0,5)} - ${t.NombreTratamiento || 'Turno'}`
    }));

  // Validación
  const validar = () => {
    const errs = {};
    if (!nuevoCobro.FechaCobro) errs.FechaCobro = "Fecha requerida";
    if (!nuevoCobro.idTurno) errs.idTurno = "Selecciona un turno";
    if (!nuevoCobro.idMedioPago) errs.idMedioPago = "Selecciona medio";
    if (!nuevoCobro.MontoCobro || nuevoCobro.MontoCobro <= 0) errs.MontoCobro = "Monto > 0";
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoCobro(prev => ({ ...prev, [name]: value }));
    setErrores(prev => ({ ...prev, [name]: '' }));
  };

  const seleccionarPaciente = (pac) => {
    setPacienteSeleccionado(pac);
    setBusqueda(`${pac.NombrePaciente} ${pac.ApellidoPaciente}`);
    setMostrarPacientes(false);
    setTurnoSeleccionado(null);
    setNuevoCobro(prev => ({ ...prev, idTurno: '' }));
    setMostrarTurnos(true);
  };

  const seleccionarTurno = (turno) => {
    setTurnoSeleccionado(turno);
    setNuevoCobro(prev => ({ 
      ...prev, 
      idTurno: turno.idTurno, 
      MontoCobro: turno.PrecioTotal || '' 
    }));
    setMostrarTurnos(false);
    setErrores(prev => ({ ...prev, idTurno: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (procesando || !validar()) return;

    setProcesando(true);

    try {
      const result = await Swal.fire({
        title: "¿Registrar cobro?",
        html: `
          <div style="text-align:left; font-size:1rem;">
            <p><strong>Paciente:</strong> ${pacienteSeleccionado?.NombrePaciente} ${pacienteSeleccionado?.ApellidoPaciente}</p>
            <p><strong>Turno:</strong> ${turnoSeleccionado?.label}</p>
            <p><strong>Monto:</strong> <span style="color:#28a745;font-weight:bold">$${parseFloat(nuevoCobro.MontoCobro).toFixed(2)}</span></p>
          </div>
          <p class="mt-3">¿Confirmas?</p>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Sí, registrar",
        cancelButtonText: "Cancelar",
        width: "560px"
      });

      if (!result.isConfirmed) {
        toast.info("Cobro cancelado");
        return setProcesando(false);
      }

      const res = await agregarCobro(nuevoCobro);

      if (res.success) {
        toast.success('Cobro registrado');
        onSuccess();
      } else {
        toast.error(res.error || 'Error');
      }
    } catch (err) {
      toast.error('Error inesperado');
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-cobros">
      <div className="row">
        {/* BUSCADOR DE PACIENTE */}
        <div className="col-md-6 mb-3 position-relative">
          <label className="form-label">Paciente</label>
          <input
            type="text"
            className="form-control"
            placeholder="Escribe nombre, apellido o DNI..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setMostrarPacientes(true);
              setPacienteSeleccionado(null);
              setTurnoSeleccionado(null);
            }}
            onFocus={() => setMostrarPacientes(true)}
            onBlur={() => setTimeout(() => setMostrarPacientes(false), 200)}
            disabled={procesando}
            autoComplete="off"
          />
          
          {mostrarPacientes && pacientesFiltrados.length > 0 && (
            <ul className="list-group position-absolute w-100 mt-1 shadow-sm" 
                style={{ zIndex: 1000, maxHeight: '220px', overflowY: 'auto', borderRadius: '8px' }}>
              {pacientesFiltrados.map(pac => (
                <li 
                  key={pac.idPaciente} 
                  className="list-group-item list-group-item-action py-2"
                  onMouseDown={() => seleccionarPaciente(pac)}
                  style={{ cursor: 'pointer', fontSize: '0.95rem' }}
                >
                  <div><strong>{pac.NombrePaciente} {pac.ApellidoPaciente}</strong></div>
                  <small className="text-muted">DNI: {pac.DNI}</small>
                </li>
              ))}
            </ul>
          )}

          {mostrarPacientes && busqueda && pacientesFiltrados.length === 0 && (
            <div className="position-absolute w-100 mt-1 p-2 bg-light border rounded text-center text-muted small">
              No se encontraron pacientes
            </div>
          )}
        </div>

        {/* SELECCIÓN DE TURNO (CUALQUIERA) */}
        <div className="col-md-6 mb-3 position-relative">
          <label className="form-label">Turno</label>
          <input
            type="text"
            className={`form-control ${errores.idTurno ? 'is-invalid' : ''}`}
            placeholder={pacienteSeleccionado ? "Selecciona un turno..." : "Primero elige un paciente"}
            value={turnoSeleccionado?.label || ''}
            readOnly
            onClick={() => pacienteSeleccionado && setMostrarTurnos(true)}
            disabled={procesando || !pacienteSeleccionado}
          />
          {errores.idTurno && <div className="invalid-feedback">{errores.idTurno}</div>}
          
          {mostrarTurnos && turnosDelPaciente.length > 0 && (
            <ul className="list-group position-absolute w-100 mt-1 shadow-sm" 
                style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto', borderRadius: '8px' }}>
              {turnosDelPaciente.map(t => (
                <li 
                  key={t.idTurno} 
                  className="list-group-item list-group-item-action py-2"
                  onMouseDown={() => seleccionarTurno(t)}
                  style={{ cursor: 'pointer', fontSize: '0.95rem' }}
                >
                  <div><strong>{t.label}</strong></div>
                  <small className="text-success">Precio: ${t.PrecioTotal || '—'}</small>
                </li>
              ))}
            </ul>
          )}
          
          {pacienteSeleccionado && turnosDelPaciente.length === 0 && (
            <small className="text-muted d-block mt-1">Este paciente no tiene turnos</small>
          )}
        </div>
      </div>

      {/* RESTO DEL FORMULARIO */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Fecha Cobro</label>
          <input name="FechaCobro" type="date" value={nuevoCobro.FechaCobro}
            onChange={handleChange} className="form-control" required disabled={procesando} />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Medio de Pago</label>
          <select name="idMedioPago" value={nuevoCobro.idMedioPago} onChange={handleChange}
            className={`form-select ${errores.idMedioPago ? 'is-invalid' : ''}`} required disabled={procesando}>
            <option value="">Selecciona...</option>
            {Array.from(new Map(
              cobros.cobros.filter(c => c.idMedioPago).map(c => [c.idMedioPago, c.MedioPago])
            ).values()).map((nombre, id) => (
              <option key={id} value={id}>{nombre}</option>
            ))}
          </select>
          {errores.idMedioPago && <div className="invalid-feedback">{errores.idMedioPago}</div>}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Monto</label>
        <input name="MontoCobro" type="number" step="0.01" value={nuevoCobro.MontoCobro}
          onChange={handleChange} className={`form-control ${errores.MontoCobro ? 'is-invalid' : ''}`}
          required disabled={procesando} />
        {errores.MontoCobro && <div className="invalid-feedback">{errores.MontoCobro}</div>}
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary btn-submit" disabled={procesando}>
          {procesando ? <>Procesando...</> : 'Registrar Cobro'}
        </button>
      </div>
    </form>
  );
};

export default FormCobros;