import { useState, useEffect } from 'react';
import { crearPaciente, actualizarPaciente, cambiarEstadoPaciente, obtenerLocalidades } from '../../../Custom/CustomPaciente.js';
import usePacientesWrapper from '../../../Custom/usePacientesWrapper.js';
import Swal from 'sweetalert2';
import '../../../Css/Admin/Pacientes/Pacientes.css';
import PacientesHeader from './PacientesHeader';
import PacientesEstado from './PacientesEstado';
import PacientesFiltrar from './PacientesFiltrar';
import PacientesTabla from './PacientesTabla';
import PacientesModal from './PacientesModal';
import PacientesDetalleModal from './PacientesDetalleModal';
import PacientesPaginacion from './PacientesPaginacion';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [formData, setFormData] = useState({
    DNI: '',
    NombrePaciente: '',
    ApellidoPaciente: '',
    FechaNacPaciente: '',
    TelefonoPaciente: '',
    DireccionPaciente: '',
    Sexo: '',
    idLocalidad: 1,
    MailUsuario: '',
    PasswordUsuario: ''
  });
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [pacienteDetalle, setPacienteDetalle] = useState(null);
  const [localidades, setLocalidades] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [pacientesPorPagina] = useState(10);

  const { pacientes: pacientesWrapper, loading: loadingWrapper, refetch } = usePacientesWrapper();

  useEffect(() => {
    setPacientes(pacientesWrapper);
    setLoading(loadingWrapper);
  }, [pacientesWrapper, loadingWrapper]);

  const fetchLocalidades = async () => {
    try {
      const data = await obtenerLocalidades();
      setLocalidades(data);
    } catch (error) {
      console.error('Error al cargar localidades:', error);
      setLocalidades([{ idLocalidad: 1, NombreLocalidad: 'Localidad por defecto' }]);
    }
  };

  useEffect(() => {
    fetchLocalidades();
  }, []);

  const pacientesFiltrados = pacientes.filter(paciente => {
    const matchBusqueda = paciente.NombrePaciente?.toLowerCase().includes(busqueda.toLowerCase()) ||
                         paciente.ApellidoPaciente?.toLowerCase().includes(busqueda.toLowerCase()) ||
                         paciente.DNI?.includes(busqueda);
    
    const matchFiltro = filtro === 'todos' || 
                       (filtro === 'activos' && paciente.IsActive) ||
                       (filtro === 'inactivos' && !paciente.IsActive);
    
    return matchBusqueda && matchFiltro;
  });

  const totalPaginas = Math.ceil(pacientesFiltrados.length / pacientesPorPagina);
  const indiceInicio = (paginaActual - 1) * pacientesPorPagina;
  const indiceFin = indiceInicio + pacientesPorPagina;
  const pacientesPaginados = pacientesFiltrados.slice(indiceInicio, indiceFin);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtro, busqueda]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleViewDetails = (paciente) => {
    setPacienteDetalle(paciente);
    setShowDetalleModal(true);
  };

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      DNI: '',
      NombrePaciente: '',
      ApellidoPaciente: '',
      FechaNacPaciente: '',
      TelefonoPaciente: '',
      DireccionPaciente: '',
      Sexo: '',
      idLocalidad: 1,
      MailUsuario: '',
      PasswordUsuario: ''
    });
    setShowModal(true);
  };

  const handleEdit = (paciente) => {
    setModalMode('edit');
    setSelectedPaciente(paciente);
    setFormData({
      DNI: paciente.DNI,
      NombrePaciente: paciente.NombrePaciente,
      ApellidoPaciente: paciente.ApellidoPaciente,
      FechaNacPaciente: paciente.FechaNacPaciente.split('T')[0],
      TelefonoPaciente: paciente.TelefonoPaciente,
      DireccionPaciente: paciente.DireccionPaciente,
      Sexo: paciente.Sexo,
      idLocalidad: paciente.idLocalidad || 1,
      MailUsuario: '',
      PasswordUsuario: ''
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await crearPaciente(formData);
        Swal.fire({
          title: '¡Paciente creado!',
          text: `El paciente "${formData.NombrePaciente} ${formData.ApellidoPaciente}" ha sido creado correctamente.`,
          icon: 'success',
          confirmButtonColor: '#0470BB',
          timer: 2000,
          timerProgressBar: true
        });
      } else {
        const { MailUsuario, PasswordUsuario, ...pacienteData } = formData;
        await actualizarPaciente(selectedPaciente.idPaciente, pacienteData);
        Swal.fire({
          title: '¡Paciente actualizado!',
          text: `El paciente "${formData.NombrePaciente} ${formData.ApellidoPaciente}" ha sido actualizado correctamente.`,
          icon: 'success',
          confirmButtonColor: '#0470BB',
          timer: 2000,
          timerProgressBar: true
        });
      }
      setShowModal(false);
      refetch(); 
    } catch (error) {
      console.error('Error al guardar paciente:', error);
      let errorMessage = 'Hubo un problema al guardar el paciente.';
      if (error.response?.data?.message?.includes('DNI')) {
        errorMessage = `El DNI "${formData.DNI}" ya está registrado.`;
      }
      Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', confirmButtonColor: '#0470BB' });
    }
  };

  const handleToggleStatus = async (paciente) => {
    const isDeactivating = paciente.IsActive;
    const result = await Swal.fire({
      title: isDeactivating ? '¿Desactivar paciente?' : '¿Activar paciente?',
      text: `¿Estás seguro de ${isDeactivating ? 'desactivar' : 'activar'} a "${paciente.NombrePaciente} ${paciente.ApellidoPaciente}"?`,
      icon: isDeactivating ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: isDeactivating ? '#dc3545' : '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: isDeactivating ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const nuevoEstado = isDeactivating ? 0 : 1;
        await cambiarEstadoPaciente(paciente.idPaciente, nuevoEstado);
        refetch(); 
        Swal.fire({
          title: isDeactivating ? '¡Desactivado!' : '¡Activado!',
          text: `El paciente ha sido ${isDeactivating ? 'desactivado' : 'activado'}.`,
          icon: 'success',
          confirmButtonColor: '#0470BB',
          timer: 2000,
          timerProgressBar: true
        });
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        Swal.fire({ title: 'Error', text: 'No se pudo cambiar el estado.', icon: 'error', confirmButtonColor: '#0470BB' });
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPaciente(null);
    setFormData({
      DNI: '',
      NombrePaciente: '',
      ApellidoPaciente: '',
      FechaNacPaciente: '',
      TelefonoPaciente: '',
      DireccionPaciente: '',
      Sexo: '',
      idLocalidad: 1,
      MailUsuario: '',
      PasswordUsuario: ''
    });
  };

  const handleCloseDetalleModal = () => {
    setShowDetalleModal(false);
    setPacienteDetalle(null);
  };

  const handleCambioPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  return (
    <div className="pacientes-container">
      <PacientesHeader onCreateClick={handleCreate} />
      
      <PacientesEstado 
        pacientes={pacientes}
        pacientesFiltrados={pacientesFiltrados}
        filtro={filtro}
        onFiltroChange={setFiltro}
      />

      <PacientesFiltrar
        busqueda={busqueda}
        filtro={filtro}
        onBusquedaChange={setBusqueda}
        onFiltroChange={setFiltro}
      />

      <PacientesTabla
        pacientesFiltrados={pacientesPaginados}
        loading={loading}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onViewDetails={handleViewDetails}
      />

      <PacientesPaginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambioPagina={handleCambioPagina}
        totalRegistros={pacientesFiltrados.length}
        registrosPorPagina={pacientesPorPagina}
      />

      <PacientesModal
        showModal={showModal}
        modalMode={modalMode}
        formData={formData}
        pacientes={pacientes}
        localidades={localidades}
        selectedPaciente={selectedPaciente}
        onInputChange={handleInputChange}
        onSave={handleSave}
        onClose={handleCloseModal}
      />

      <PacientesDetalleModal
        showModal={showDetalleModal}
        pacienteDetalle={pacienteDetalle}
        onClose={handleCloseDetalleModal}
      />
    </div>
  );
};

export default Pacientes;