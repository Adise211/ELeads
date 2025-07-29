import { toast, type ToastOptions } from "react-toastify";

const toastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  pauseOnHover: true,
  hideProgressBar: true,
  closeOnClick: true,
  draggable: true,
  theme: "light",
};

export const showSuccessToast = (message = "Success!") => {
  toast.success(message, {
    ...toastOptions,
  });
};

export const showErrorToast = (message = "Something went wrong.") => {
  toast.error(message, {
    ...toastOptions,
  });
};

export const showInfoToast = (message = "FYI") => {
  toast.info(message, {
    ...toastOptions,
  });
};

export const showWarningToast = (message = "Be careful.") => {
  toast.warning(message, {
    ...toastOptions,
  });
};
