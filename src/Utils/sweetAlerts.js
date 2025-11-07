import Swal from 'sweetalert2';

// Configuración base para SweetAlert2 con colores de Fissio
const baseConfig = {
  confirmButtonColor: '#0470BB',
  cancelButtonColor: '#6c757d',
  background: '#ffffff',
  color: '#333333',
  customClass: {
    popup: 'fissio-swal-popup',
    title: 'fissio-swal-title',
    content: 'fissio-swal-content'
  }
};

// Mensaje de éxito
export const showSuccess = (title, text = '') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'success',
    title: title,
    text: text,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false
  });
};

// Mensaje de error
export const showError = (title, text = '') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'error',
    title: title,
    text: text,
    confirmButtonText: 'Entendido'
  });
};

// Mensaje de información
export const showInfo = (title, text = '') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'info',
    title: title,
    text: text,
    confirmButtonText: 'OK'
  });
};

// Mensaje de confirmación
export const showConfirm = (title, text = '', confirmText = 'Sí', cancelText = 'No') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'question',
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText
  });
};

// Mensaje de carga
export const showLoading = (title = 'Cargando...') => {
  return Swal.fire({
    ...baseConfig,
    title: title,
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Cerrar cualquier mensaje activo
export const closeSwal = () => {
  Swal.close();
};