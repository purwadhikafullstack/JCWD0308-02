
import { showError } from "./toastutils";



export const handleApiError = (error: any, defaultMessage: string = 'An unexpected error occurred') => {
  if (error.response && error.response.data && error.response.data.errors) {
    const errorMessage = error.response.data.errors;
    showError(`${defaultMessage}: ${errorMessage}`);
  } else {
    console.error('Error:', error);
    showError(defaultMessage);
  }
};
