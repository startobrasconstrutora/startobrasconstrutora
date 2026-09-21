import Swal from 'sweetalert2';

// Alerta de Sucesso
export const showSuccess = (title, text) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#3085d6',
  });
};

// Alerta de Erro
export const showError = (title, text) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#d33',
  });
};

// Alerta de Confirmação
export const showConfirm = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, confirmar!',
    cancelButtonText: 'Cancelar',
  });
};