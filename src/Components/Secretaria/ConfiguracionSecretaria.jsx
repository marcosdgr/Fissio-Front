import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../Store/useAuthStore';
import { obtenerEmpleadoPorId, actualizarEmpleado } from '../../Custom/Empleados/CustomEmpleados';
import { getLocalidades } from '../../Custom/CustomRegister';
import { showConfirm, showSuccess, showError } from '../../Utils/sweetAlerts';
import '../../Css/Secretaria/ConfiguracionSecretaria.css';

const ConfiguracionSecretaria = () => {
  const [formData, setFormData] = useState({
    NombreEmpleado: '',
    ApellidoEmpleado: '',
    DNI: '',
    TelefonoEmpleado: '',
    DireccionEmpleado: '',
    FechaNacEmpleado: '',
    idLocalidad: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [localidades, setLocalidades] = useState([]);
  const [empleadoOriginal, setEmpleadoOriginal] = useState(null);
  const [emailEmpleado, setEmailEmpleado] = useState(null);

  const { user } = useAuthStore();
  const idEmpleado = user?.idEmpleado || user?.usuario?.idEmpleado;

  useEffect(() => {
    const cargarDatos = async () => {
      if (!idEmpleado) {
        setError('No se encontró información del empleado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [datosEmpleado, localidadesData] = await Promise.all([
          obtenerEmpleadoPorId(idEmpleado),
          getLocalidades()
        ]);

        setEmpleadoOriginal(datosEmpleado);
        setEmailEmpleado(user?.email || datosEmpleado.email);

        setFormData({
          NombreEmpleado: datosEmpleado.NombreEmpleado || '',
          ApellidoEmpleado: datosEmpleado.ApellidoEmpleado || '',
          DNI: datosEmpleado.DNI || '',
          TelefonoEmpleado: datosEmpleado.TelefonoEmpleado || '',
          DireccionEmpleado: datosEmpleado.DireccionEmpleado || '',
          FechaNacEmpleado: datosEmpleado.FechaNacEmpleado ? 
            datosEmpleado.FechaNacEmpleado.split('T')[0] : '',
          idLocalidad: datosEmpleado.idLocalidad || ''
        });

        setLocalidades(localidadesData);

      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar la información');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [idEmpleado, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const validarFormulario = () => {
    const { NombreEmpleado, ApellidoEmpleado, TelefonoEmpleado, DireccionEmpleado, FechaNacEmpleado, idLocalidad } = formData;

    if (!NombreEmpleado.trim()) throw new Error('El nombre es requerido');
    if (!ApellidoEmpleado.trim()) throw new Error('El apellido es requerido');
    if (!TelefonoEmpleado.trim()) throw new Error('El teléfono es requerido');
    if (!DireccionEmpleado.trim()) throw new Error('La dirección es requerida');
    if (!FechaNacEmpleado) throw new Error('La fecha de nacimiento es requerida');
    if (!idLocalidad) throw new Error('La localidad es requerida');

    const fechaNac = new Date(FechaNacEmpleado);
    const hoy = new Date();
    if (fechaNac > hoy) throw new Error('La fecha de nacimiento no puede ser futura');
  };

  const hayChangeios = () => {
    if (!empleadoOriginal) return false;
    
    return (
      formData.NombreEmpleado !== (empleadoOriginal.NombreEmpleado || '') ||
      formData.ApellidoEmpleado !== (empleadoOriginal.ApellidoEmpleado || '') ||
      formData.TelefonoEmpleado !== (empleadoOriginal.TelefonoEmpleado || '') ||
      formData.DireccionEmpleado !== (empleadoOriginal.DireccionEmpleado || '') ||
      formData.FechaNacEmpleado !== (empleadoOriginal.FechaNacEmpleado ? empleadoOriginal.FechaNacEmpleado.split('T')[0] : '') ||
      parseInt(formData.idLocalidad) !== (empleadoOriginal.idLocalidad || 0)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let datosActualizados = null;

    try {
      setError(null);

      validarFormulario();

      if (!hayChangeios()) {
        await showError('Sin cambios', 'No hay cambios para guardar');
        return;
      }

      const result = await showConfirm(
        '¿Guardar cambios?',
        'Se actualizarán tus datos personales',
        'Sí, guardar',
        'Cancelar'
      );

      if (!result || !result.isConfirmed) {
        return;
      }

      setSaving(true);

      let permisosNormalizados = empleadoOriginal.PermisosEmpleado;
      if (permisosNormalizados) {
        const permisosStr = String(permisosNormalizados).toLowerCase();
        if (permisosStr.includes('administr')) {
          permisosNormalizados = 'Administración';
        } else if (permisosStr.includes('kines')) {
          permisosNormalizados = 'Kinesiología';
        } else {
          permisosNormalizados = 'Otros';
        }
      }

      datosActualizados = {
        ...formData,
        idLocalidad: parseInt(formData.idLocalidad),
        DNI: empleadoOriginal.DNI,
        SalarioEmpleado: empleadoOriginal.SalarioEmpleado,
        PermisosEmpleado: permisosNormalizados,
        idCatEmpleado: empleadoOriginal.idCatEmpleado,
        idUsuario: empleadoOriginal.idUsuario
      };

      await actualizarEmpleado(idEmpleado, datosActualizados);

      setEmpleadoOriginal({
        ...empleadoOriginal,
        ...datosActualizados
      });

      await showSuccess('¡Datos actualizados!', 'Tu información ha sido guardada correctamente');

    } catch (err) {
      console.error('Error al actualizar datos:', err);
      console.error('Respuesta del servidor:', err.response?.data);
      if (datosActualizados) {
        console.error('Datos enviados:', datosActualizados);
      }
      const errorMsg = err.response?.data?.message || err.message || 'Error al actualizar los datos';
      await showError('Error al guardar', errorMsg);
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!empleadoOriginal) return;

    setFormData({
      NombreEmpleado: empleadoOriginal.NombreEmpleado || '',
      ApellidoEmpleado: empleadoOriginal.ApellidoEmpleado || '',
      DNI: empleadoOriginal.DNI || '',
      TelefonoEmpleado: empleadoOriginal.TelefonoEmpleado || '',
      DireccionEmpleado: empleadoOriginal.DireccionEmpleado || '',
      FechaNacEmpleado: empleadoOriginal.FechaNacEmpleado ? 
        empleadoOriginal.FechaNacEmpleado.split('T')[0] : '',
      idLocalidad: empleadoOriginal.idLocalidad || ''
    });

    setError(null);
    setSuccess(false);
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'No disponible';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const edad = Math.floor((hoy - nacimiento) / (365.25 * 24 * 60 * 60 * 1000));
    return `${edad} años`;
  };

  if (loading) {
    return (
      <div className="config-secretaria-container">
        <div className="config-loading-container">
          <div className="config-loading-spinner"></div>
          <p>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="config-secretaria-container config-fade-in">
      <div className="config-welcome-section">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12">
              <div className="d-flex align-items-center">
                <div className="config-welcome-avatar rounded-circle d-flex align-items-center justify-content-center me-4">
                  <span className="material-symbols-outlined">settings</span>
                </div>
                <div>
                  <h1 className="welcome-name">Configuración</h1>
                  <p className="welcome-subtitle mb-0">
                    Edita tu información personal
                  </p>
                  <small className="welcome-date d-flex align-items-center">
                    <span className="material-symbols-outlined me-1">edit</span>
                    Mantén tus datos actualizados
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10 col-md-12">

            {success && (
              <div className="config-alert-success d-flex align-items-center" role="alert">
                <span className="material-symbols-outlined me-2">check_circle</span>
                <div>
                  <strong>¡Datos actualizados con éxito!</strong>
                  <div>Tu información ha sido guardada correctamente.</div>
                </div>
              </div>
            )}

            {error && (
              <div className="config-alert-danger d-flex align-items-center" role="alert">
                <span className="material-symbols-outlined me-2">error</span>
                <div>
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}

            <div className="config-form-card">
              <div className="config-form-icon">
                <span className="material-symbols-outlined">person_edit</span>
              </div>
              <h3 className="config-form-title">Datos Personales</h3>

              <form onSubmit={handleSubmit}>
                <div className="row g-4">

                  <div className="col-md-6 config-form-group">
                    <label htmlFor="NombreEmpleado" className="config-form-label">
                      <span className="material-symbols-outlined">person</span>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="NombreEmpleado"
                      name="NombreEmpleado"
                      className="config-form-control form-control"
                      value={formData.NombreEmpleado}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu nombre"
                      required
                    />
                  </div>

                  <div className="col-md-6 config-form-group">
                    <label htmlFor="ApellidoEmpleado" className="config-form-label">
                      <span className="material-symbols-outlined">person</span>
                      Apellido *
                    </label>
                    <input
                      type="text"
                      id="ApellidoEmpleado"
                      name="ApellidoEmpleado"
                      className="config-form-control form-control"
                      value={formData.ApellidoEmpleado}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu apellido"
                      required
                    />
                  </div>

                  <div className="col-md-6 config-form-group">
                    <label htmlFor="TelefonoEmpleado" className="config-form-label">
                      <span className="material-symbols-outlined">phone</span>
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="TelefonoEmpleado"
                      name="TelefonoEmpleado"
                      className="config-form-control form-control"
                      value={formData.TelefonoEmpleado}
                      onChange={handleInputChange}
                      placeholder="Ej: +54 9 11 1234-5678"
                      required
                    />
                  </div>

                  <div className="col-md-6 config-form-group">
                    <label htmlFor="FechaNacEmpleado" className="config-form-label">
                      <span className="material-symbols-outlined">cake</span>
                      Fecha de Nacimiento *
                    </label>
                    <input
                      type="date"
                      id="FechaNacEmpleado"
                      name="FechaNacEmpleado"
                      className="config-form-control form-control"
                      value={formData.FechaNacEmpleado}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                    {formData.FechaNacEmpleado && (
                      <div className="config-age-display">
                        <span className="material-symbols-outlined me-1" style={{fontSize: '1rem'}}>info</span>
                        Edad: {calcularEdad(formData.FechaNacEmpleado)}
                      </div>
                    )}
                  </div>

                  <div className="col-md-12 config-form-group">
                    <label htmlFor="idLocalidad" className="config-form-label">
                      <span className="material-symbols-outlined">location_on</span>
                      Localidad *
                    </label>
                    <select
                      id="idLocalidad"
                      name="idLocalidad"
                      className="config-form-select form-select"
                      value={formData.idLocalidad}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona una localidad</option>
                      {localidades.map(localidad => (
                        <option key={localidad.idLocalidad} value={localidad.idLocalidad}>
                          {localidad.NombreLocalidad}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-12 config-form-group">
                    <label htmlFor="DireccionEmpleado" className="config-form-label">
                      <span className="material-symbols-outlined">home</span>
                      Dirección *
                    </label>
                    <input
                      type="text"
                      id="DireccionEmpleado"
                      name="DireccionEmpleado"
                      className="config-form-control form-control"
                      value={formData.DireccionEmpleado}
                      onChange={handleInputChange}
                      placeholder="Ej: Av. Corrientes 1234, CABA"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <div className="config-readonly-section">
                      <h6 className="config-readonly-title">
                        <span className="material-symbols-outlined me-2">lock</span>
                        Información no editable
                      </h6>
                      <div className="row">
                        <div className="col-md-4">
                          <div className="config-readonly-item">
                            <div className="config-readonly-label">DNI:</div>
                            <div className="config-readonly-value">{empleadoOriginal?.DNI || 'No disponible'}</div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="config-readonly-item">
                            <div className="config-readonly-label">Email:</div>
                            <div className="config-readonly-value">{emailEmpleado || 'No disponible'}</div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="config-readonly-item">
                            <div className="config-readonly-label">Contraseña:</div>
                            <div className="config-readonly-value">••••••••</div>
                          </div>
                        </div>
                      </div>
                      <small className="text-muted mt-2 d-block">
                        Contacta al administrador para modificar estos datos
                      </small>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="d-flex gap-3 justify-content-end">
                      <button
                        type="button"
                        className="config-btn-secondary d-flex align-items-center config-btn"
                        onClick={handleReset}
                        disabled={saving || !hayChangeios()}
                      >
                        <span className="material-symbols-outlined me-2">refresh</span>
                        Restablecer
                      </button>
                      
                      <button
                        type="submit"
                        className="config-btn-primary d-flex align-items-center config-btn"
                        disabled={saving || !hayChangeios()}
                      >
                        {saving ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Cargando...</span>
                            </div>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined me-2">save</span>
                            Guardar Cambios
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="row mt-4 mb-0">
          <div className="col-12">
            <div className="config-info-card">
              <div className="card-body py-3">
                <div className="row align-items-center">
                  <div className="col-md-8 col-12">
                    <h6 className="config-info-title">
                      <span className="material-symbols-outlined me-2">info</span>
                      Información Importante
                    </h6>
                    <p className="config-info-text">
                      Mantén tus datos actualizados para recibir notificaciones del sistema.
                    </p>
                  </div>
                  <div className="col-md-4 col-12 text-md-end text-center mt-2 mt-md-0">
                    <small className="text-muted">
                      <span className="material-symbols-outlined me-1">support_agent</span>
                      ¿Dudas? Contacta soporte
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionSecretaria;
