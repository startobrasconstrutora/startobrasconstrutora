import Swal from 'sweetalert2';

// ============ ALERTS BÁSICOS ============

export const showSuccess = (title, message = '') => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonColor: '#28a745',
  });
};

export const showError = (title, message = '') => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonColor: '#dc3545',
  });
};

export const showWarning = (title, message = '') => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    confirmButtonColor: '#ffc107',
    confirmButtonTextColor: '#000',
  });
};

export const showInfo = (title, message = '') => {
  return Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    confirmButtonColor: '#17a2b8',
  });
};

// ============ CONFIRMAÇÕES ============

export const confirmDelete = (itemName = 'este item') => {
  return Swal.fire({
    icon: 'warning',
    title: 'Tem certeza?',
    text: `Você está prestes a deletar ${itemName}. Esta ação não pode ser desfeita.`,
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sim, deletar',
    cancelButtonText: 'Cancelar',
  });
};

export const confirmAction = (title, message = '', confirmText = 'Confirmar') => {
  return Swal.fire({
    icon: 'question',
    title: title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: '#007bff',
    cancelButtonColor: '#6c757d',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
  });
};

// ============ TOASTS (notificações rápidas) ============

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const toastSuccess = (message) => {
  return Toast.fire({
    icon: 'success',
    title: message,
  });
};

export const toastError = (message) => {
  return Toast.fire({
    icon: 'error',
    title: message,
  });
};

export const toastWarning = (message) => {
  return Toast.fire({
    icon: 'warning',
    title: message,
  });
};

export const toastInfo = (message) => {
  return Toast.fire({
    icon: 'info',
    title: message,
  });
};

// ============ PROMPTS (entrada de texto) ============

export const promptText = (title, placeholder = '') => {
  return Swal.fire({
    title: title,
    input: 'text',
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonColor: '#007bff',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value) {
        return 'Este campo não pode estar vazio!';
      }
    }
  });
};

// ============ LOADING ============

export const showLoading = (title = 'Carregando...') => {
  return Swal.fire({
    title: title,
    allowOutsideClick: false,
    didOpen: async () => {
      await Swal.showLoading();
    }
  });
};

export const hideLoading = () => {
  return Swal.close();
};

// ============ CUSTOMIZADOS ============

export const showCustom = (options) => {
  return Swal.fire({
    confirmButtonColor: '#007bff',
    ...options
  });
};