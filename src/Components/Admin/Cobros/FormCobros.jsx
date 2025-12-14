import React, { useState, useEffect } from 'react';
import useCustomCobros from '../../../Custom/useCustomCobros';
import useCustomPacientesCobros from '../../../Custom/useCustomPacientesCobros';
import useCustomTurnosCobros from '../../../Custom/useCustomTurnosCobros';
import useCustomCatPagos from '../../../Custom/useCustomCatPagos';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import "../../../Css/Cobros/FormCobros.css";

const FormCobros = ({ cobro, onSuccess }) => {
  const { agregarCobro, editarCobro, cobros } = useCustomCobros();
  const { pacientesObj } = useCustomPacientesCobros();
  const { turnos } = useCustomTurnosCobros();
  const { mediosPago } = useCustomCatPagos();

  const esEdicion = !!cobro?.idCobro;

  const [dniBusqueda, setDniBusqueda] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [mostrarPacientes, setMostrarPacientes] = useState(false);

  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [mostrarTurnos, setMostrarTurnos] = useState(false);

  const fechaActual = new Date().toISOString().split('T')[0];

  const [nuevoCobro, setNuevoCobro] = useState({
    FechaCobro: fechaActual,
    idTurno: '',
    TipoCobro: 'Paciente',
    idMedioPago: '',
    MontoCobro: '',
    EstadoCobro: 'Cobrado',
    Descripcion: ''
  });

  const [procesando, setProcesando] = useState(false);
  const [errores, setErrores] = useState({});

  // MEDIOS DE PAGO DESDE LA BASE DE DATOS
  const mediosPagoValidos = mediosPago.map(m => ({
    id: m.idMedioPago,
    nombre: m.NombreMedio
  }));

  useEffect(() => {
    if (esEdicion && cobro) {
      setNuevoCobro({
        FechaCobro: cobro.FechaCobro.split('T')[0],
        idTurno: cobro.idTurno,
        TipoCobro: cobro.TipoCobro,
        idMedioPago: cobro.idMedioPago?.toString() || '',
        MontoCobro: cobro.MontoCobro,
        EstadoCobro: cobro.EstadoCobro || 'Cobrado',
        Descripcion: cobro.Descripcion || ''
      });

      const turno = turnos.turnos.find(t => t.idTurno == cobro.idTurno);
      if (turno) {
        const pac = pacientesObj.pacientes.find(p => p.idPaciente == turno.idPaciente);
        if (pac) {
          setPacienteSeleccionado(pac);
          setDniBusqueda(pac.DNI);
          setTurnoSeleccionado(turno);
        }
      }
    }
  }, [cobro, pacientesObj, turnos, esEdicion, cobros.cobros]);

  const pacientesFiltrados = pacientesObj.pacientes
    .filter(p => dniBusqueda.trim() && p.DNI.includes(dniBusqueda.trim()))
    .slice(0, 6);

  const turnosDelPaciente = turnos.turnos
    .filter(t => {
      if (t.idPaciente != pacienteSeleccionado?.idPaciente) return false;
      
      // Si estamos editando, permitir el turno actual
      if (esEdicion && t.idTurno == cobro?.idTurno) return true;
      
      // Filtrar turnos que ya tienen un cobro registrado
      const tieneCobro = cobros.cobros.some(c => c.idTurno == t.idTurno);
      return !tieneCobro;
    })
    .map(t => ({
      ...t,
      label: `${new Date(t.FechaRequeridaTurno).toLocaleDateString('es-AR')} - ${t.HorarioRequeridoTurno?.slice(0,5)} - ${t.NombreTratamiento || 'Turno'}`
    }));

  const validar = () => {
    const errs = {};
    if (!nuevoCobro.idTurno) errs.idTurno = "Selecciona un turno";
    if (!nuevoCobro.idMedioPago) errs.idMedioPago = "Selecciona un medio de pago";
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
    setDniBusqueda(pac.DNI);
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
        title: esEdicion ? "¿Actualizar cobro?" : "¿Registrar cobro?",
        html: `
          <div style="text-align:left; font-size:1rem;">
            <p><strong>Paciente:</strong> ${pacienteSeleccionado?.NombrePaciente} ${pacienteSeleccionado?.ApellidoPaciente}</p>
            <p><strong>DNI:</strong> ${pacienteSeleccionado?.DNI}</p>
            <p><strong>Turno:</strong> ${turnoSeleccionado?.label}</p>
            <p><strong>Fecha:</strong> ${esEdicion ? new Date(cobro.FechaCobro).toLocaleDateString('es-AR') : new Date().toLocaleDateString('es-AR')}</p>
            <p><strong>Medio:</strong> ${mediosPagoValidos.find(m => m.id == nuevoCobro.idMedioPago)?.nombre || '—'}</p>
            <p><strong>Monto:</strong> <span style="color:#28a745;font-weight:bold">$${parseFloat(nuevoCobro.MontoCobro).toFixed(2)}</span></p>
          </div>
          <p class="mt-3">¿Confirmas?</p>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "Cancelar",
        width: "560px"
      });

      if (!result.isConfirmed) {
        toast.info("Operación cancelada");
        return setProcesando(false);
      }

      let res;
      if (esEdicion) {
        // Formatear datos para enviar al backend
        const datosParaActualizar = {
          FechaCobro: nuevoCobro.FechaCobro,
          idTurno: parseInt(nuevoCobro.idTurno),
          TipoCobro: nuevoCobro.TipoCobro || 'Paciente',
          idMedioPago: parseInt(nuevoCobro.idMedioPago),
          MontoCobro: parseFloat(nuevoCobro.MontoCobro),
          EstadoCobro: nuevoCobro.EstadoCobro || 'Cobrado',
          Descripcion: nuevoCobro.Descripcion || null
        };
        console.log("📤 Enviando datos de edición:", datosParaActualizar);
        res = await editarCobro(cobro.idCobro, datosParaActualizar);
      } else {
        res = await agregarCobro(nuevoCobro);
      }

      if (res.success) {
        await Swal.fire({
          title: "¡Éxito!",
          text: esEdicion ? 'El cobro fue actualizado correctamente' : 'El cobro fue registrado correctamente',
          icon: "success",
          confirmButtonColor: "#28a745",
          confirmButtonText: "Aceptar"
        });
        onSuccess();
      } else {
        await Swal.fire({
          title: "Error",
          text: res.error || 'No se pudo completar la operación',
          icon: "error",
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Aceptar"
        });
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
        <div className="col-md-6 mb-3 position-relative">
          <label className="form-label">DNI del Paciente</label>
          <input
            type="text"
            className="form-control"
            placeholder="Escribe el DNI..."
            value={dniBusqueda}
            onChange={(e) => {
              setDniBusqueda(e.target.value);
              setMostrarPacientes(true);
              if (!esEdicion) {
                setPacienteSeleccionado(null);
                setTurnoSeleccionado(null);
              }
            }}
            onFocus={() => setMostrarPacientes(true)}
            onBlur={() => setTimeout(() => setMostrarPacientes(false), 200)}
            disabled={procesando || esEdicion}
            autoComplete="off"
          />
          {mostrarPacientes && pacientesFiltrados.length > 0 && (
            <ul className="list-group position-absolute w-100 mt-1 shadow-sm" style={{ zIndex: 1000, maxHeight: '220px', overflowY: 'auto', borderRadius: '8px' }}>
              {pacientesFiltrados.map(pac => (
                <li key={pac.idPaciente} className="list-group-item list-group-item-action py-2" onMouseDown={() => seleccionarPaciente(pac)} style={{ cursor: 'pointer', fontSize: '0.95rem' }}>
                  <div><strong>{pac.DNI}</strong> - {pac.NombrePaciente} {pac.ApellidoPaciente}</div>
                </li>
              ))}
            </ul>
          )}
          {mostrarPacientes && dniBusqueda && pacientesFiltrados.length === 0 && (
            <div className="position-absolute w-100 mt-1 p-2 bg-light border rounded text-center text-muted small">
              No se encontró paciente con ese DNI
            </div>
          )}
        </div>

        <div className="col-md-6 mb-3 position-relative">
          <label className="form-label">Turno</label>
          <input
            type="text"
            className={`form-control ${errores.idTurno ? 'is-invalid' : ''}`}
            placeholder={pacienteSeleccionado ? "Selecciona un turno..." : "Primero ingresa el DNI"}
            value={turnoSeleccionado?.label || ''}
            readOnly
            onClick={() => pacienteSeleccionado && !esEdicion && setMostrarTurnos(true)}
            disabled={procesando || !pacienteSeleccionado || esEdicion}
          />
          {errores.idTurno && <div className="invalid-feedback">{errores.idTurno}</div>}
          {mostrarTurnos && turnosDelPaciente.length > 0 && (
            <ul className="list-group position-absolute w-100 mt-1 shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto', borderRadius: '8px' }}>
              {turnosDelPaciente.map(t => (
                <li key={t.idTurno} className="list-group-item list-group-item-action py-2" onMouseDown={() => seleccionarTurno(t)} style={{ cursor: 'pointer', fontSize: '0.95rem' }}>
                  <div><strong>{t.label}</strong></div>
                  <small className="text-success">Precio: ${t.PrecioTotal || '—'}</small>
                </li>
              ))}
            </ul>
          )}
          {mostrarTurnos && turnosDelPaciente.length === 0 && pacienteSeleccionado && (
            <div className="position-absolute w-100 mt-1 p-2 bg-light border rounded text-center text-muted small">
              No hay turnos pendientes de cobro para este paciente
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Fecha del Cobro</label>
          <input 
            type="text" 
            className="form-control" 
            value={esEdicion ? new Date(cobro.FechaCobro).toLocaleDateString('es-AR') : new Date().toLocaleDateString('es-AR')} 
            readOnly 
            disabled
            style={{ backgroundColor: '#f8f9fa' }}
          />
          <small className="text-muted">
            {esEdicion ? 'Fecha original del cobro' : 'Se registra automáticamente'}
          </small>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Medio de Pago</label>
          {mediosPagoValidos.length === 0 ? (
            <div className="text-muted small p-2">
              No hay medios de pago en cobros registrados
            </div>
          ) : (
            <select 
              name="idMedioPago" 
              value={nuevoCobro.idMedioPago} 
              onChange={handleChange}
              className={`form-select ${errores.idMedioPago ? 'is-invalid' : ''}`} 
              required 
              disabled={procesando}
            >
              <option value="">Selecciona un medio...</option>
              {mediosPagoValidos.map(medio => (
                <option key={medio.id} value={medio.id}>
                  {medio.nombre}
                </option>
              ))}
            </select>
          )}
          {errores.idMedioPago && <div className="invalid-feedback">{errores.idMedioPago}</div>}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Monto</label>
        <input 
          name="MontoCobro" 
          type="number" 
          step="0.01" 
          value={nuevoCobro.MontoCobro}
          onChange={handleChange} 
          className={`form-control ${errores.MontoCobro ? 'is-invalid' : ''}`}
          required 
          disabled={procesando} 
        />
        {errores.MontoCobro && <div className="invalid-feedback">{errores.MontoCobro}</div>}
      </div>

      <div className="d-grid">
        <button 
          type="submit" 
          className="btn btn-primary btn-submit" 
          disabled={procesando || mediosPagoValidos.length === 0}
        >
          {procesando ? <>Procesando...</> : (esEdicion ? 'Actualizar Cobro' : 'Registrar Cobro')}
        </button>
      </div>
    </form>
  );
};

export default FormCobros;