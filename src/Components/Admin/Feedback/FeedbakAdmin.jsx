import { useState } from 'react';
import useCustomFeedback from '../../../Custom/Feedback/useCustomFeedback';
import Swal from 'sweetalert2';
import '../../../Css/Admin/FeedbackAdmin/FeedbackAdmin.css';
import FeedbackHeader from './FeedbackHeader';
import FeedbackFiltrar from './FeedbackFiltrar';
import FeedbackTabla from './FeedbackTabla';
import FeedbackModal from './FeedbackModal';

const FeedbakAdmin = () => {
  const { comentarios, loading, publicarComentario, despublicarComentario } = useCustomFeedback();
  const [busqueda, setBusqueda] = useState('');
  const [filtroCalificacion, setFiltroCalificacion] = useState('todos'); // 'todos', '1', '2', '3', '4', '5'
  const [showModal, setShowModal] = useState(false);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);

  // Filtrar comentarios
  const comentariosFiltrados = comentarios.filter(comentario => {
    const matchBusqueda = 
      comentario.pacienteNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      comentario.Comentario?.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchCalificacion = 
      filtroCalificacion === 'todos' || 
      comentario.CalificacionComentario === parseInt(filtroCalificacion);
    
    return matchBusqueda && matchCalificacion;
  });

  // Abrir modal para ver comentario completo
  const handleVerComentario = (comentario) => {
    setComentarioSeleccionado(comentario);
    setShowModal(true);
  };

  // Cerrar modal
  const handleCerrarModal = () => {
    setShowModal(false);
    setComentarioSeleccionado(null);
  };

  // Publicar/Despublicar comentario
  const handlePublicar = async (comentario) => {
    const estaPublicado = comentario.IsPublicado === 1;
    
    const result = await Swal.fire({
      title: estaPublicado ? '¿Despublicar comentario?' : '¿Publicar comentario?',
      text: estaPublicado 
        ? 'El comentario ya no se mostrará en la página de inicio.'
        : 'El comentario se mostrará en la página de inicio.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: estaPublicado ? '#ffc107' : '#0470BB',
      cancelButtonColor: '#6c757d',
      confirmButtonText: estaPublicado ? 'Sí, despublicar' : 'Sí, publicar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        console.log('ID del comentario:', comentario.idComentario);
        console.log('Estado actual:', estaPublicado ? 'Publicado' : 'No publicado');
        
        if (estaPublicado) {
          console.log('Despublicando...');
          await despublicarComentario(comentario.idComentario);
        } else {
          console.log('Publicando...');
          await publicarComentario(comentario.idComentario);
        }
        
        Swal.fire({
          title: estaPublicado ? '¡Despublicado!' : '¡Publicado!',
          text: estaPublicado 
            ? 'El comentario ya no se mostrará en la página de inicio.'
            : 'El comentario ahora se muestra en la página de inicio.',
          icon: 'success',
          confirmButtonColor: '#0470BB',
          timer: 2000,
          timerProgressBar: true
        });

        handleCerrarModal();
      } catch (error) {
        console.error('============ ERROR COMPLETO ============');
        console.error('Error:', error);
        console.error('Mensaje:', error.message);
        console.error('Respuesta del servidor:', error.response?.data);
        console.error('Status:', error.response?.status);
        console.error('URL llamada:', error.config?.url);
        console.error('=======================================');
        
        const mensajeError = error.response?.data?.message 
          || error.response?.data?.error 
          || error.message 
          || 'Hubo un problema. Por favor, inténtalo de nuevo.';
        
        Swal.fire({
          title: 'Error del servidor',
          html: `
            <p>${mensajeError}</p>
            ${error.response?.data ? `<pre style="text-align: left; font-size: 12px; background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 10px;">${JSON.stringify(error.response.data, null, 2)}</pre>` : ''}
          `,
          icon: 'error',
          confirmButtonColor: '#0470BB'
        });
      }
    }
  };

  return (
    <div className="feedback-admin-container">
      <FeedbackHeader totalComentarios={comentarios.length} />
      
      <FeedbackFiltrar
        busqueda={busqueda}
        filtroCalificacion={filtroCalificacion}
        onBusquedaChange={setBusqueda}
        onFiltroChange={setFiltroCalificacion}
      />

      <FeedbackTabla
        comentariosFiltrados={comentariosFiltrados}
        loading={loading}
        onVerComentario={handleVerComentario}
      />

      <FeedbackModal
        show={showModal}
        comentario={comentarioSeleccionado}
        onClose={handleCerrarModal}
        onPublicar={handlePublicar}
      />
    </div>
  );
};

export default FeedbakAdmin;